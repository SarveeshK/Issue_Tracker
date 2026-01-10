using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IssueTracker.Domain.Entities;

public class Issue
{
    [Key]
    public int IssueId { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string IssueTitle { get; set; } = string.Empty;
    
    public string IssueDescription { get; set; } = string.Empty;
    
    [MaxLength(50)]
    public string IssueType { get; set; } = string.Empty; // Bug, Feature

    public int StatusId { get; set; }
    [ForeignKey("StatusId")]
    public Status Status { get; set; } = null!;

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    public ICollection<Task> Tasks { get; set; } = new List<Task>();
}
