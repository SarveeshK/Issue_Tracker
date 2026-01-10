using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IssueTracker.Domain.Entities;

public class Employee
{
    [Key]
    public int EmployeeId { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string EmployeeName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    public int RoleId { get; set; }
    [ForeignKey("RoleId")]
    public Role Role { get; set; } = null!;

    public ICollection<Task> AssignedTasks { get; set; } = new List<Task>();
    public ICollection<User> LinkedUsers { get; set; } = new List<User>();
}
