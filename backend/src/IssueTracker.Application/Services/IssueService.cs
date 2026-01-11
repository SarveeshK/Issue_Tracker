using IssueTracker.Application.DTOs;
using IssueTracker.Application.Interfaces;
using IssueTracker.Domain.Entities;
using IssueTracker.Domain.Interfaces;

namespace IssueTracker.Application.Services;

public class IssueService : IIssueService
{
    private readonly IRepository<Issue> _issueRepository;
    private readonly IRepository<Status> _statusRepository;
    private readonly IRepository<IssueTracker.Domain.Entities.Task> _taskRepository;
    private readonly IRepository<Priority> _priorityRepository;
    private readonly IRepository<User> _userRepository;
    private readonly IAuditService _auditService;

    public IssueService(IRepository<Issue> issueRepository, IRepository<Status> statusRepository, IRepository<IssueTracker.Domain.Entities.Task> taskRepository, IRepository<Priority> priorityRepository, IRepository<User> userRepository, IAuditService auditService)
    {
        _issueRepository = issueRepository;
        _statusRepository = statusRepository;
        _taskRepository = taskRepository;
        _priorityRepository = priorityRepository;
        _userRepository = userRepository;
        _auditService = auditService;
    }

    public async System.Threading.Tasks.Task<IEnumerable<IssueDto>> GetAllIssuesAsync(string? search = null, string? status = null, string? priority = null, string? type = null, int? userId = null, string? role = null)
    {
        // Ideally use AutoMapper here, manual mapping for learning clarity
        var issues = await _issueRepository.GetAllAsync();
        
        var statues = await _statusRepository.GetAllAsync();
        var priorities = await _priorityRepository.GetAllAsync();
        var users = await _userRepository.GetAllAsync();
        var allTasks = await _taskRepository.GetAllAsync();

        // Apply filters in memory (Simplified for scaffold, ideally done in DB)
        var filteredIssues = issues.AsEnumerable();

        // Role-based filtering
        if (userId.HasValue && !string.IsNullOrEmpty(role))
        {
            if (role == "User") // Client
            {
                filteredIssues = filteredIssues.Where(i => i.CreatedByUserId == userId);
            }
            else if (role == "Developer" || role == "QA") // Employee
            {
                // Employee can only see issues where they are assigned to a task
                // We need to find the EmployeeId for this UserId
                var currentUser = users.FirstOrDefault(u => u.UserId == userId);
                if (currentUser != null && currentUser.EmployeeId.HasValue)
                {
                    var empId = currentUser.EmployeeId.Value;
                    filteredIssues = filteredIssues.Where(i => allTasks.Any(t => t.IssueId == i.IssueId && t.AssignedTo == empId));
                }
                else
                {
                    // Should not happen for valid employees, but safe fallback: show nothing or everything? 
                    // Let's safe fallback to hiding everything if we can't identify employee
                     filteredIssues = Enumerable.Empty<Issue>();
                }
            }
        }

        if (!string.IsNullOrEmpty(search))
        {
            var s = search.ToLower();
            filteredIssues = filteredIssues.Where(i => 
                i.IssueTitle.ToLower().Contains(s) || 
                i.IssueDescription.ToLower().Contains(s));
        }

        if (!string.IsNullOrEmpty(status))
        {
            filteredIssues = filteredIssues.Where(i => 
                statues.FirstOrDefault(st => st.StatusId == i.StatusId)?.StatusName.Trim().Equals(status.Trim(), StringComparison.OrdinalIgnoreCase) == true);
        }

        if (!string.IsNullOrEmpty(priority))
        {
            filteredIssues = filteredIssues.Where(i => 
                priorities.FirstOrDefault(p => p.PriorityId == i.PriorityId)?.PriorityName.Equals(priority, StringComparison.OrdinalIgnoreCase) == true);
        }

        if (!string.IsNullOrEmpty(type))
        {
            filteredIssues = filteredIssues.Where(i => i.IssueType.Equals(type, StringComparison.OrdinalIgnoreCase));
        }
        
        // var allTasks = await _taskRepository.GetAllAsync(); // Already fetched above
        var allEmployees = await _userRepository.GetAllAsync(); // Actually we need Employee names, but we used User names mostly. 
        // Let's use User names consistently if possible, or fetch Employees if needed.
        // Based on TaskService, AssignedTo is EmployeeId.
        
        return filteredIssues.Select(i => {
            var user = users.FirstOrDefault(u => u.UserId == i.CreatedByUserId);
            var issueTasks = allTasks.Where(t => t.IssueId == i.IssueId);
            var assignedUserNames = issueTasks
                .Where(t => t.AssignedTo.HasValue)
                .Select(t => users.FirstOrDefault(u => u.EmployeeId == t.AssignedTo)?.Name ?? "Unassigned")
                .Distinct()
                .ToList();

            return new IssueDto
            {
                IssueId = i.IssueId,
                IssueTitle = i.IssueTitle,
                IssueDescription = i.IssueDescription,
                IssueType = i.IssueType,
                StatusName = statues.FirstOrDefault(s => s.StatusId == i.StatusId)?.StatusName ?? "Unknown",
                PriorityName = priorities.FirstOrDefault(p => p.PriorityId == i.PriorityId)?.PriorityName ?? "Medium",
                CreatedDate = i.CreatedDate,
                TasksCount = issueTasks.Count(),
                CreatedByUserName = user?.Name ?? "Admin",
                CreatedByCompanyName = user?.CompanyName ?? "Internal",
                AssignedToUsers = assignedUserNames
            };
        });
    }

    public async System.Threading.Tasks.Task<IssueDto?> GetIssueByIdAsync(int id)
    {
        var issue = await _issueRepository.GetByIdAsync(id);
        if (issue == null) return null;

        var status = await _statusRepository.GetByIdAsync(issue.StatusId);
        var priority = await _priorityRepository.GetByIdAsync(issue.PriorityId);
        var user = issue.CreatedByUserId.HasValue ? await _userRepository.GetByIdAsync(issue.CreatedByUserId.Value) : null;

        var tasks = await _taskRepository.FindAsync(t => t.IssueId == id);
        var users = await _userRepository.GetAllAsync();
        var assignedUserNames = tasks
            .Where(t => t.AssignedTo.HasValue)
            .Select(t => users.FirstOrDefault(u => u.EmployeeId == t.AssignedTo)?.Name ?? "Unassigned")
            .Distinct()
            .ToList();

        return new IssueDto
        {
            IssueId = issue.IssueId,
            IssueTitle = issue.IssueTitle,
            IssueDescription = issue.IssueDescription,
            IssueType = issue.IssueType,
            StatusName = status?.StatusName ?? "Unknown",
            PriorityName = priority?.PriorityName ?? "Medium",
            CreatedDate = issue.CreatedDate,
            CreatedByUserName = user?.Name ?? "Admin",
            CreatedByCompanyName = user?.CompanyName ?? "Internal",
            AssignedToUsers = assignedUserNames
        };
    }

    public async System.Threading.Tasks.Task<IssueDto> CreateIssueAsync(CreateIssueDto dto, int userId)
    {
        // Default to "Open" status
        var openStatus = (await _statusRepository.FindAsync(s => s.StatusName == "Open")).FirstOrDefault();
        if (openStatus == null) throw new Exception("Open status not found in DB");

        var issue = new Issue
        {
            IssueTitle = dto.IssueTitle,
            IssueDescription = dto.IssueDescription,
            IssueType = dto.IssueType,
            StatusId = openStatus.StatusId,
            PriorityId = dto.PriorityId > 0 ? dto.PriorityId : 2, // Default to Medium if not provided
            CreatedDate = DateTime.UtcNow,
            CreatedByUserId = userId
        };

        await _issueRepository.AddAsync(issue);

        await _auditService.LogActivityAsync("Issue", issue.IssueId, "Created", $"Issue '{issue.IssueTitle}' was created.", userId);

        var priority = await _priorityRepository.GetByIdAsync(issue.PriorityId);
        var user = await _userRepository.GetByIdAsync(userId);

        return new IssueDto
        {
            IssueId = issue.IssueId,
            IssueTitle = issue.IssueTitle,
            IssueDescription = issue.IssueDescription,
            IssueType = issue.IssueType,
            StatusName = openStatus.StatusName,
            PriorityName = priority?.PriorityName ?? "Medium",
            CreatedDate = issue.CreatedDate,
            CreatedByUserName = user?.Name ?? "Unknown",
            CreatedByCompanyName = user?.CompanyName ?? "Unknown"
        };
    }

    public async System.Threading.Tasks.Task<bool> CloseIssueAsync(int id)
    {
        var issue = await _issueRepository.GetByIdAsync(id);
        if (issue == null) return false;

        // Fetch all statuses to avoid multiple DB calls and handle case-insensitivity
        var allStatuses = await _statusRepository.GetAllAsync();
        var closedStatus = allStatuses.FirstOrDefault(s => s.StatusName.Trim().Equals("Closed", StringComparison.OrdinalIgnoreCase));
        if (closedStatus == null) throw new Exception("Configuration error: 'Closed' status not found in database registry.");

        // Check for open tasks
        var tasks = await _taskRepository.FindAsync(t => t.IssueId == id);
        var openTasks = tasks.Where(t => t.StatusId != closedStatus.StatusId).ToList();
        
        if (openTasks.Any())
        {
            var openTitles = string.Join(", ", openTasks.Select(t => $"'{t.TaskTitle}'"));
            throw new Exception($"Cannot close issue. The following tasks must be closed first: {openTitles}. Please ensure all tasks are marked as 'Closed' by an Admin.");
        }

        issue.StatusId = closedStatus.StatusId;
        await _issueRepository.UpdateAsync(issue);

        // We don't have the current user ID here easily, let's pass a default or try to get it if possible. 
        // For now, logging without userId or using a generic system id if needed.
        await _auditService.LogActivityAsync("Issue", issue.IssueId, "Closed", "Issue was marked as Closed.", null);
        
        return true;
    }

    public async System.Threading.Tasks.Task<bool> DeleteIssueAsync(int id, int userId)
    {
        var issue = await _issueRepository.GetByIdAsync(id);
        if (issue == null) return false;

        issue.IsDeleted = true;
        await _issueRepository.UpdateAsync(issue);

        await _auditService.LogActivityAsync("Issue", id, "Deleted", $"Issue '{issue.IssueTitle}' was soft-deleted.", userId);
        return true;
    }

    public async System.Threading.Tasks.Task<IEnumerable<AuditLog>> GetIssueLogsAsync(int id)
    {
        return await _auditService.GetLogsForEntityAsync("Issue", id);
    }
}
