using IssueTracker.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IssueTracker.Infrastructure.Data;

public class IssueTrackerContext : DbContext
{
    public IssueTrackerContext(DbContextOptions<IssueTrackerContext> options) : base(options)
    {
    }

    public DbSet<Role> Roles { get; set; }
    public DbSet<Employee> Employees { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Status> Statuses { get; set; }
    public DbSet<Issue> Issues { get; set; }
    public DbSet<IssueTracker.Domain.Entities.Task> Tasks { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Priority> Priorities { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed default statuses
        modelBuilder.Entity<Status>().HasData(
            new Status { StatusId = 1, StatusName = "Open", Priority = 0, Severity = 0 },
            new Status { StatusId = 2, StatusName = "In Progress", Priority = 0, Severity = 0 },
            new Status { StatusId = 3, StatusName = "Closed", Priority = 0, Severity = 0 },
            new Status { StatusId = 4, StatusName = "Resolved", Priority = 0, Severity = 0 }
        );

        // Seed default roles
        modelBuilder.Entity<Role>().HasData(
            new Role { RoleId = 1, RoleName = "Admin" },
            new Role { RoleId = 2, RoleName = "Developer" },
            new Role { RoleId = 3, RoleName = "Manager" },
            new Role { RoleId = 4, RoleName = "QA" }
        );

        // Seed default priorities
        modelBuilder.Entity<Priority>().HasData(
            new Priority { PriorityId = 1, PriorityName = "High", ColorCode = "red" },
            new Priority { PriorityId = 2, PriorityName = "Medium", ColorCode = "orange" },
            new Priority { PriorityId = 3, PriorityName = "Low", ColorCode = "blue" }
        );

        // Seed default employees
        modelBuilder.Entity<Employee>().HasData(
            new Employee { EmployeeId = 1, EmployeeName = "Test User", Email = "test@example.com", RoleId = 1 },
            new Employee { EmployeeId = 2, EmployeeName = "Sarveesh", Email = "sarveesh@macs.com", RoleId = 1 }, // Admin/Lead
            new Employee { EmployeeId = 3, EmployeeName = "Nigesh", Email = "nigesh@macs.com", RoleId = 2 }, // Developer
            new Employee { EmployeeId = 4, EmployeeName = "Keerthii", Email = "keerthii@macs.com", RoleId = 2 },
            new Employee { EmployeeId = 5, EmployeeName = "Hanumanth", Email = "hanumanth@macs.com", RoleId = 2 },
            new Employee { EmployeeId = 6, EmployeeName = "Gowtham", Email = "gowtham@macs.com", RoleId = 2 }
        );

        // Seed default users (Map to Employees for Login)
        // Note: Password hash logic is handled in Auth service. Seeding pre-made users might require a known hash.
        // For simplicity, we seed the structure, but login might fail if PasswordHash is required and empty.
        // Assuming AuthController handles registration or we use a tool to set password later.
        // Providing a basic BCrypt hash for "password" would be ideal if possible.
        string defaultHash = BCrypt.Net.BCrypt.HashPassword("password");
        
        modelBuilder.Entity<User>().HasData(
            new User { UserId = 1, Name = "Test User", Email = "test@example.com", EmployeeId = 1, PasswordHash = defaultHash, CompanyName = "Internal" },
            new User { UserId = 2, Name = "Client User", Email = "client@example.com", PasswordHash = defaultHash, CompanyName = "ClientCo" },
            new User { UserId = 3, Name = "Sarveesh", Email = "sarveesh@macs.com", EmployeeId = 2, PasswordHash = defaultHash, CompanyName = "MACS" },
            new User { UserId = 4, Name = "Nigesh", Email = "nigesh@macs.com", EmployeeId = 3, PasswordHash = defaultHash, CompanyName = "MACS" },
            new User { UserId = 5, Name = "Keerthii", Email = "keerthii@macs.com", EmployeeId = 4, PasswordHash = defaultHash, CompanyName = "MACS" },
            new User { UserId = 6, Name = "Hanumanth", Email = "hanumanth@macs.com", EmployeeId = 5, PasswordHash = defaultHash, CompanyName = "MACS" },
            new User { UserId = 7, Name = "Gowtham", Email = "gowtham@macs.com", EmployeeId = 6, PasswordHash = defaultHash, CompanyName = "MACS" },
            new User { UserId = 8, Name = "Ramesh", Email = "ramesh@perfect.com", PasswordHash = defaultHash, CompanyName = "Perfect Solutions" } // Client
        );
        
        // Define relationships if necessary manual overrides required
        modelBuilder.Entity<Comment>()
            .HasOne(c => c.ParentComment)
            .WithMany(c => c.Replies)
            .HasForeignKey(c => c.ParentCommentId)
            .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete cycles

        // Soft Delete Filters
        modelBuilder.Entity<Issue>().HasQueryFilter(i => !i.IsDeleted);
        modelBuilder.Entity<IssueTracker.Domain.Entities.Task>().HasQueryFilter(t => !t.IsDeleted);
    }
}
