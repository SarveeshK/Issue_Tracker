namespace IssueTracker.Application.DTOs;

public class CommentDto
{
    public int CommentId { get; set; }
    public int TaskId { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty; // Join with User table
    public string CommentText { get; set; } = string.Empty;
    public int? ParentCommentId { get; set; }
    public DateTime CreatedDate { get; set; }
    public List<CommentDto> Replies { get; set; } = new List<CommentDto>();
}

public class CreateCommentDto
{
    public int TaskId { get; set; }
    public int UserId { get; set; } // Passed from frontend for now (mock auth)
    public string CommentText { get; set; } = string.Empty;
    public int? ParentCommentId { get; set; }
}
