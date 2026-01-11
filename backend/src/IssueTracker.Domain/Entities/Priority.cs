using System.ComponentModel.DataAnnotations;

namespace IssueTracker.Domain.Entities;

public class Priority
{
    [Key]
    public int PriorityId { get; set; }

    [Required]
    [MaxLength(50)]
    public string PriorityName { get; set; } = string.Empty; // High, Medium, Low

    [MaxLength(20)]
    public string ColorCode { get; set; } = string.Empty; // e.g., "red", "orange", "blue"
}
