using IssueTracker.Application.DTOs;
using IssueTracker.Application.Interfaces;
using IssueTracker.Domain.Entities;
using IssueTracker.Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace IssueTracker.Application.Services;

public class AuthService : IAuthService
{
    private readonly IRepository<User> _userRepo;
    private readonly IRepository<Employee> _employeeRepo;
    private readonly IRepository<Role> _roleRepo;
    private readonly IConfiguration _config;

    public AuthService(IRepository<User> userRepo, IRepository<Employee> employeeRepo, IRepository<Role> roleRepo, IConfiguration config)
    {
        _userRepo = userRepo;
        _employeeRepo = employeeRepo;
        _roleRepo = roleRepo; // We might need to fetch role name
        _config = config;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        // 1. Check if user exists (mock check for now as repository might not have Find)
        // In real app: var existing = await _userRepo.FindAsync(u => u.Email == dto.Email);
        
        // 2. Hash Password
        string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        // 3. Create User
        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email
        };

        // Note: We don't have a generic "Add and Return" in our simple repo, so we add and then assume ID logic or refetch.
        // For scaffolding simplicity, we will assume generic AddAsync works or we mock the ID return.
        // Actually, our repository AddAsync matches: Task AddAsync(T entity); 
        // EF Core populates ID after SaveChanges.
        
        await _userRepo.AddAsync(user);

        // 4. Create Employee record (since User and Employee are separate in our somewhat complex schema)
        // Ideally User and Employee should be linked 1:1 or be the same table. 
        // For this architecture, we'll create an Employee record linked to the same name/email.
        // Wait, the schema in architecture_design.md says Employee has User? Or Role?
        // Let's verify Employee entity. Expected: Employee has RoleId. 
        
        var employee = new Employee
        {
            EmployeeName = dto.Name,
            Email = dto.Email,
            RoleId = dto.RoleId
        };
        await _employeeRepo.AddAsync(employee);

        // 5. Generate Token
        // Use the Employee Role for the claim
        var role = await _roleRepo.GetByIdAsync(dto.RoleId);
        var roleName = role?.RoleName ?? "Developer";

        return GenerateToken(user, roleName);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        // 1. Find User by Email (Scanning all users - inefficient but fine for scaffold)
        var users = await _userRepo.GetAllAsync();
        var user = users.FirstOrDefault(u => u.Email == dto.Email);
        if (user == null) throw new Exception("Invalid credentials");

        if (string.IsNullOrEmpty(user.PasswordHash))
        {
            // Fallback for seeded users w/o password - simple check or block
            // For now, allow "password" if hash is empty (DEV ONLY)
            if (dto.Password != "password") throw new Exception("Invalid credentials");
        }
        else
        {
             bool verified = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
             if (!verified) throw new Exception("Invalid credentials");
        }

        var employees = await _employeeRepo.GetAllAsync();
        var employee = employees.FirstOrDefault(e => e.Email == dto.Email);
        
        string roleName = "User";
        if (employee != null) {
             var role = await _roleRepo.GetByIdAsync(employee.RoleId);
             if (role != null) roleName = role.RoleName;
        }

        return GenerateToken(user, roleName);
    }

    private AuthResponseDto GenerateToken(User user, string roleName)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_config["Jwt:Key"] ?? "IssueTrackerSecretKeyForDevelopmentOnly123!");
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, roleName)
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        
        return new AuthResponseDto
        {
            Token = tokenHandler.WriteToken(token),
            User = new UserDto
            {
                UserId = user.UserId,
                Name = user.Name,
                Email = user.Email,
                RoleName = roleName
            }
        };
    }
}
