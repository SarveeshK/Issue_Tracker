namespace IssueTracker.Application.DTOs;

public class IssueDto
{
    public int IssueId { get; set; }
    public string IssueTitle { get; set; } = string.Empty;
    public string IssueDescription { get; set; } = string.Empty;
    public string IssueType { get; set; } = string.Empty;
    public string StatusName { get; set; } = string.Empty;
    public int TasksCount { get; set; }
    public DateTime CreatedDate { get; set; }
}

public class CreateIssueDto
{
    public string IssueTitle { get; set; } = string.Empty;
    public string IssueDescription { get; set; } = string.Empty;
    public string IssueType { get; set; } = string.Empty;
}
