using System.ComponentModel.DataAnnotations;

namespace IssueTracker.Domain.Entities;

public class Role
{
    [Key]
    public int RoleId { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string RoleName { get; set; } = string.Empty;

    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
}
