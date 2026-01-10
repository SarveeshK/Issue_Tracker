namespace IssueTracker.Application.DTOs;

public class TaskDto
{
    public int TaskId { get; set; }
    public string TaskTitle { get; set; } = string.Empty;
    public string TaskDescription { get; set; } = string.Empty;
    public int IssueId { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public string? AssignedToName { get; set; }
    // Add StartDate etc if needed
}

public class CreateTaskDto
{
    public int IssueId { get; set; }
    public string TaskTitle { get; set; } = string.Empty;
    public string TaskDescription { get; set; } = string.Empty;
    // We will default Status to Open and AssignedTo to null for now
}
