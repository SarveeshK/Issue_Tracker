using IssueTracker.Application.DTOs;
using IssueTracker.Application.Interfaces;
using IssueTracker.Domain.Entities;
using IssueTracker.Domain.Interfaces;

namespace IssueTracker.Application.Services;

public class IssueService : IIssueService
{
    private readonly IRepository<Issue> _issueRepository;
    private readonly IRepository<Status> _statusRepository;

    public IssueService(IRepository<Issue> issueRepository, IRepository<Status> statusRepository)
    {
        _issueRepository = issueRepository;
        _statusRepository = statusRepository;
    }

    public async System.Threading.Tasks.Task<IEnumerable<IssueDto>> GetAllIssuesAsync()
    {
        // Ideally use AutoMapper here, manual mapping for learning clarity
        var issues = await _issueRepository.GetAllAsync();
        // Note: Real world would need Includes/Joins for efficient StatusName fetching
        // This is a simplified demo version
        
        // Simulating "Include" since generic repo doesn't expose it directly in this demo version
        // In real app, Repository would expose IQueryable or specialized methods
        var statuses = await _statusRepository.GetAllAsync(); 
        
        return issues.Select(i => new IssueDto
        {
            IssueId = i.IssueId,
            IssueTitle = i.IssueTitle,
            IssueDescription = i.IssueDescription,
            IssueType = i.IssueType,
            StatusName = statuses.FirstOrDefault(s => s.StatusId == i.StatusId)?.StatusName ?? "Unknown",
            CreatedDate = i.CreatedDate,
            TasksCount = i.Tasks?.Count ?? 0
        });
    }

    public async System.Threading.Tasks.Task<IssueDto?> GetIssueByIdAsync(int id)
    {
        var issue = await _issueRepository.GetByIdAsync(id);
        if (issue == null) return null;

        var status = await _statusRepository.GetByIdAsync(issue.StatusId);

        return new IssueDto
        {
            IssueId = issue.IssueId,
            IssueTitle = issue.IssueTitle,
            IssueDescription = issue.IssueDescription,
            IssueType = issue.IssueType,
            StatusName = status?.StatusName ?? "Unknown",
            CreatedDate = issue.CreatedDate
        };
    }

    public async System.Threading.Tasks.Task<IssueDto> CreateIssueAsync(CreateIssueDto dto)
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
            CreatedDate = DateTime.UtcNow
        };

        await _issueRepository.AddAsync(issue);

        return new IssueDto
        {
            IssueId = issue.IssueId,
            IssueTitle = issue.IssueTitle,
            IssueDescription = issue.IssueDescription,
            IssueType = issue.IssueType,
            StatusName = openStatus.StatusName,
            CreatedDate = issue.CreatedDate
        };
    }

    public async System.Threading.Tasks.Task<bool> CloseIssueAsync(int id)
    {
        var issue = await _issueRepository.GetByIdAsync(id);
        if (issue == null) return false;

        // Validation: Can only close if all tasks are closed?
        // Skipped for simplicity in this scaffold, but place logic here.

        var closedStatus = (await _statusRepository.FindAsync(s => s.StatusName == "Closed")).FirstOrDefault();
        if (closedStatus == null) throw new Exception("Closed status not found");

        issue.StatusId = closedStatus.StatusId;
        await _issueRepository.UpdateAsync(issue);
        return true;
    }
}
