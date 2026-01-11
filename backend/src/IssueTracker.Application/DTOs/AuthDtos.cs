using IssueTracker.Application.DTOs;

namespace IssueTracker.Application.DTOs;

public class LoginDto
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}

public class RegisterDto
{
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public int RoleId { get; set; } = 2; // Default to Developer (2)
}

public class AuthResponseDto
{
    public required string Token { get; set; }
    public required UserDto User { get; set; }
}

public class UserDto
{
    public int UserId { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string RoleName { get; set; }
}
