using System.ComponentModel.DataAnnotations;

namespace IssueTracker.Domain.Entities;

public class Status
{
    [Key]
    public int StatusId { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string StatusName { get; set; } = string.Empty; // Open, In Progress, Closed
    
    public int Priority { get; set; } // 1 (Low) - 5 (Critical)
    public int Severity { get; set; } // 1 (Cosmetic) - 5 (Blocker)
}
