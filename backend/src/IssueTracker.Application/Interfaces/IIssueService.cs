using IssueTracker.Application.DTOs;

namespace IssueTracker.Application.Interfaces;

public interface IIssueService
{
    Task<IEnumerable<IssueDto>> GetAllIssuesAsync(string? search = null, string? status = null, string? priority = null, string? type = null);
    Task<IssueDto?> GetIssueByIdAsync(int id);
    Task<IssueDto> CreateIssueAsync(CreateIssueDto createIssueDto, int userId);
    Task<bool> CloseIssueAsync(int id);
}
