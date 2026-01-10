using IssueTracker.Application.DTOs;

namespace IssueTracker.Application.Interfaces;

public interface ITaskService
{
    System.Threading.Tasks.Task<IEnumerable<TaskDto>> GetTasksByIssueIdAsync(int issueId);
    System.Threading.Tasks.Task<TaskDto?> GetTaskByIdAsync(int taskId);
    System.Threading.Tasks.Task<TaskDto> CreateTaskAsync(CreateTaskDto taskDto);
    // Add Update/Delete later if needed
}
