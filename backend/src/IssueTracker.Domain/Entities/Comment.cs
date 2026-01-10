using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IssueTracker.Domain.Entities;

public class Comment
{
    [Key]
    public int CommentId { get; set; }
    
    public int TaskId { get; set; }
    [ForeignKey("TaskId")]
    public IssueTracker.Domain.Entities.Task Task { get; set; } = null!;
    
    public int UserId { get; set; }
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;
    
    [Required]
    public string CommentText { get; set; } = string.Empty;
    
    public int? ParentCommentId { get; set; }
    [ForeignKey("ParentCommentId")]
    public Comment? ParentComment { get; set; }
    
    public ICollection<Comment> Replies { get; set; } = new List<Comment>();
    
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}
