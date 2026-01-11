using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IssueTracker.Domain.Entities;

public class Task
{
    [Key]
    public int TaskId { get; set; }
    
    public int IssueId { get; set; }
    [ForeignKey("IssueId")]
    public Issue Issue { get; set; } = null!;
    
    [Required]
    [MaxLength(200)]
    public string TaskTitle { get; set; } = string.Empty;
    
    public string TaskDescription { get; set; } = string.Empty;
    
    public int? AssignedTo { get; set; }
    [ForeignKey("AssignedTo")]
    public Employee? AssignedEmployee { get; set; }
    
    public int StatusId { get; set; }
    [ForeignKey("StatusId")]
    public Status Status { get; set; } = null!;

    public int PriorityId { get; set; }
    [ForeignKey("PriorityId")]
    public Priority Priority { get; set; } = null!;
    
    public DateTime? StartDate { get; set; }

    public bool IsDeleted { get; set; } = false;

    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
