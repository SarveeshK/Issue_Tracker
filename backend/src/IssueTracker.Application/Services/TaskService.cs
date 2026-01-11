using IssueTracker.Application.DTOs;
using IssueTracker.Application.Interfaces;
using IssueTracker.Domain.Interfaces;
using IssueTracker.Domain.Entities;

namespace IssueTracker.Application.Services;

public class TaskService : ITaskService
{
    private readonly IRepository<IssueTracker.Domain.Entities.Task> _taskRepo;
    private readonly IRepository<Status> _statusRepo;



    private readonly IRepository<User> _userRepo;
    private readonly IRepository<Employee> _employeeRepo;
    private readonly IRepository<Issue> _issueRepo;
    private readonly IRepository<Priority> _priorityRepo;
    private readonly IAuditService _auditService;

    public TaskService(IRepository<IssueTracker.Domain.Entities.Task> taskRepo, IRepository<Status> statusRepo, IRepository<User> userRepo, IRepository<Employee> employeeRepo, IRepository<Issue> issueRepo, IRepository<Priority> priorityRepo, IAuditService auditService)
    {
        _taskRepo = taskRepo;
        _statusRepo = statusRepo;
        _userRepo = userRepo;
        _employeeRepo = employeeRepo;
        _issueRepo = issueRepo;
        _priorityRepo = priorityRepo;
        _auditService = auditService;
    }

    public async System.Threading.Tasks.Task<IEnumerable<TaskDto>> GetTasksByIssueIdAsync(int issueId, int? userId = null, string? role = null)
    {
        var tasks = await _taskRepo.FindAsync(t => t.IssueId == issueId);
        
        // Filter for Employee: Only see assigned tasks
        if (userId.HasValue && (role == "Developer" || role == "QA"))
        {
             var user = await _userRepo.GetByIdAsync(userId.Value);
             if (user != null && user.EmployeeId.HasValue)
             {
                 tasks = tasks.Where(t => t.AssignedTo == user.EmployeeId.Value).ToList();
             }
             else
             {
                 // Fallback if employee ID not found
                 tasks = new List<IssueTracker.Domain.Entities.Task>();
             }
        }

        var employees = await _employeeRepo.GetAllAsync();
        var statuses = await _statusRepo.GetAllAsync();
        var priorities = await _priorityRepo.GetAllAsync();

        return tasks.Select(t => new TaskDto
        {
            TaskId = t.TaskId,
            TaskTitle = t.TaskTitle,
            TaskDescription = t.TaskDescription,
            IssueId = t.IssueId,
            StatusName = statuses.FirstOrDefault(s => s.StatusId == t.StatusId)?.StatusName ?? "Unknown",
            PriorityName = priorities.FirstOrDefault(p => p.PriorityId == t.PriorityId)?.PriorityName ?? "Medium",
            AssignedToName = t.AssignedTo.HasValue ? employees.FirstOrDefault(e => e.EmployeeId == t.AssignedTo)?.EmployeeName : null
        });
    }

    public async System.Threading.Tasks.Task<TaskDto?> GetTaskByIdAsync(int taskId)
    {
        var task = await _taskRepo.GetByIdAsync(taskId);
        if (task == null) return null;

        var status = await _statusRepo.GetByIdAsync(task.StatusId);
        var priority = await _priorityRepo.GetByIdAsync(task.PriorityId);
        string? assignedName = null;
        if (task.AssignedTo.HasValue)
        {
            var emp = await _employeeRepo.GetByIdAsync(task.AssignedTo.Value);
            assignedName = emp?.EmployeeName;
        }

        return new TaskDto
        {
            TaskId = task.TaskId,
            TaskTitle = task.TaskTitle,
            TaskDescription = task.TaskDescription,
            IssueId = task.IssueId,
            StatusName = status?.StatusName ?? "Unknown",
            PriorityName = priority?.PriorityName ?? "Medium",
            AssignedToName = assignedName
        };
    }

    public async System.Threading.Tasks.Task<TaskDto> CreateTaskAsync(CreateTaskDto dto)
    {
        // 1. Get Default Status (Open)
        var statuses = await _statusRepo.FindAsync(s => s.StatusName == "Open");
        var openStatus = statuses.FirstOrDefault();
        if (openStatus == null) throw new Exception("Open status not found in DB");

        // 2. Validate Issue exists and is not closed
        var issue = await _issueRepo.GetByIdAsync(dto.IssueId);
        if (issue == null) throw new Exception("Issue not found");
        
        // Assuming 3 is Closed, or fetch "Closed" status to compare
        var closedStatuses = await _statusRepo.FindAsync(s => s.StatusName.ToLower() == "closed");
        var closedStatus = closedStatuses.FirstOrDefault();
        if (closedStatus != null && issue.StatusId == closedStatus.StatusId)
        {
            throw new Exception("Cannot add new tasks to a closed issue.");
        }

        var task = new IssueTracker.Domain.Entities.Task
        {
            IssueId = dto.IssueId,
            TaskTitle = dto.TaskTitle,
            TaskDescription = dto.TaskDescription,
            StatusId = openStatus.StatusId,
            PriorityId = dto.PriorityId > 0 ? dto.PriorityId : 2, // Default Medium
            StartDate = DateTime.UtcNow
        };

        await _taskRepo.AddAsync(task);

        await _auditService.LogActivityAsync("Task", task.TaskId, "Created", $"Task '{task.TaskTitle}' was created for Issue #{task.IssueId}.", null); // User ID usually passed from controller, but CreateTaskDto doesn't have it yet.

        var priority = await _priorityRepo.GetByIdAsync(task.PriorityId);

        return new TaskDto
        {
            TaskId = task.TaskId,
            TaskTitle = task.TaskTitle,
            TaskDescription = task.TaskDescription,
            IssueId = task.IssueId,
            StatusName = "Open",
            PriorityName = priority?.PriorityName ?? "Medium",
            AssignedToName = null
        };
    }

    public async System.Threading.Tasks.Task<bool> AssignTaskAsync(int taskId, int userId)
    {
        var task = await _taskRepo.GetByIdAsync(taskId);
        if (task == null) throw new Exception("Task not found");

        var user = await _userRepo.GetByIdAsync(userId);
        if (user == null) throw new Exception("User not found");

        if (user.EmployeeId == null) throw new Exception("User is not an employee and cannot be assigned tasks.");

        task.AssignedTo = user.EmployeeId;
        await _taskRepo.UpdateAsync(task);

        await _auditService.LogActivityAsync("Task", taskId, "Assigned", $"Task '{task.TaskTitle}' was assigned to {user.Name}.", null);
        return true;
    }

    public async System.Threading.Tasks.Task<bool> UpdateTaskStatusAsync(int taskId, string statusName, string userRole)
    {
        var task = await _taskRepo.GetByIdAsync(taskId);
        if (task == null) throw new Exception("Task not found");

        // Enforce Workflow: Non-admins cannot "Close" directly. They must use "Resolved" (Submit for Review).
        if (statusName.Equals("Closed", StringComparison.OrdinalIgnoreCase) && !userRole.Equals("Admin", StringComparison.OrdinalIgnoreCase))
        {
            throw new Exception("Only Admins can close tasks after review. Please mark as Resolved instead.");
        }

        var allStatuses = await _statusRepo.GetAllAsync();
        var status = allStatuses.FirstOrDefault(s => s.StatusName.Trim().Equals(statusName, StringComparison.OrdinalIgnoreCase));
        if (status == null) throw new Exception($"Status error: '{statusName}' is not a valid task status in the system registry.");

        task.StatusId = status.StatusId;
        await _taskRepo.UpdateAsync(task);

        await _auditService.LogActivityAsync("Task", taskId, "StatusUpdated", $"Task status set to {statusName}.", null);

        // Automation: If Task is re-opened (Open), and Issue is Closed, Re-open the Issue.
        if (statusName.Equals("Open", StringComparison.OrdinalIgnoreCase))
        {
            var issue = await _issueRepo.GetByIdAsync(task.IssueId);
            if (issue != null)
            {
                var closedStatus = (await _statusRepo.FindAsync(s => s.StatusName.ToLower() == "closed")).FirstOrDefault();
                if (closedStatus != null && issue.StatusId == closedStatus.StatusId)
                {
                    var openStatus = (await _statusRepo.FindAsync(s => s.StatusName.ToLower() == "open")).FirstOrDefault();
                    if (openStatus != null)
                    {
                        issue.StatusId = openStatus.StatusId;
                        await _issueRepo.UpdateAsync(issue);
                    }
                }
            }
        }

        return true;
    }

    public async System.Threading.Tasks.Task<bool> DeleteTaskAsync(int id, int userId)
    {
        var task = await _taskRepo.GetByIdAsync(id);
        if (task == null) return false;

        task.IsDeleted = true;
        await _taskRepo.UpdateAsync(task);

        await _auditService.LogActivityAsync("Task", id, "Deleted", $"Task '{task.TaskTitle}' was soft-deleted.", userId);
        return true;
    }

    public async System.Threading.Tasks.Task<IEnumerable<AuditLog>> GetTaskLogsAsync(int id)
    {
        return await _auditService.GetLogsForEntityAsync("Task", id);
    }
}
