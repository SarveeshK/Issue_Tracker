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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed default statuses
        modelBuilder.Entity<Status>().HasData(
            new Status { StatusId = 1, StatusName = "Open", Priority = 0, Severity = 0 },
            new Status { StatusId = 2, StatusName = "In Progress", Priority = 0, Severity = 0 },
            new Status { StatusId = 3, StatusName = "Closed", Priority = 0, Severity = 0 }
        );

        // Seed default roles
        modelBuilder.Entity<Role>().HasData(
            new Role { RoleId = 1, RoleName = "Admin" },
            new Role { RoleId = 2, RoleName = "Developer" },
            new Role { RoleId = 3, RoleName = "Manager" },
            new Role { RoleId = 4, RoleName = "QA" }
        );

        // Seed default user (required for comments)
        modelBuilder.Entity<User>().HasData(
            new User { UserId = 1, Name = "Test User", Email = "test@example.com" }
        );
        
        // Define relationships if necessary manual overrides required
        modelBuilder.Entity<Comment>()
            .HasOne(c => c.ParentComment)
            .WithMany(c => c.Replies)
            .HasForeignKey(c => c.ParentCommentId)
            .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete cycles
    }
}
