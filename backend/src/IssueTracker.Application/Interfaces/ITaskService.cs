using IssueTracker.Application.DTOs;
using IssueTracker.Domain.Entities;

namespace IssueTracker.Application.Interfaces;

public interface ITaskService
{
    System.Threading.Tasks.Task<IEnumerable<TaskDto>> GetTasksByIssueIdAsync(int issueId, int? userId = null, string? role = null);
    System.Threading.Tasks.Task<TaskDto?> GetTaskByIdAsync(int taskId);
    System.Threading.Tasks.Task<TaskDto> CreateTaskAsync(CreateTaskDto taskDto);
    System.Threading.Tasks.Task<bool> AssignTaskAsync(int taskId, int userId);
    System.Threading.Tasks.Task<bool> UpdateTaskStatusAsync(int taskId, string statusName, string userRole);
    System.Threading.Tasks.Task<bool> DeleteTaskAsync(int id, int userId);
    System.Threading.Tasks.Task<IEnumerable<AuditLog>> GetTaskLogsAsync(int id);
}
