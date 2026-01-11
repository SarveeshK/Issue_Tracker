using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IssueTracker.Domain.Entities;

public class AuditLog
{
    [Key]
    public int LogId { get; set; }

    [Required]
    [MaxLength(50)]
    public string EntityType { get; set; } = string.Empty; // Issue, Task

    public int EntityId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Action { get; set; } = string.Empty; // Created, StatusUpdated, Assigned, etc.

    public string Detail { get; set; } = string.Empty;

    public int? UserId { get; set; }
    [ForeignKey("UserId")]
    public User? User { get; set; }

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
