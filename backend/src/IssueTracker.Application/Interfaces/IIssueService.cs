using IssueTracker.Application.DTOs;

namespace IssueTracker.Application.Interfaces;

public interface IIssueService
{
    Task<IEnumerable<IssueDto>> GetAllIssuesAsync();
    Task<IssueDto?> GetIssueByIdAsync(int id);
    Task<IssueDto> CreateIssueAsync(CreateIssueDto createIssueDto);
    Task<bool> CloseIssueAsync(int id);
}
