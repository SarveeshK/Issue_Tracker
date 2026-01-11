using IssueTracker.Application.DTOs;
using IssueTracker.Domain.Entities;

namespace IssueTracker.Application.Interfaces;

public interface IIssueService
{
    Task<IEnumerable<IssueDto>> GetAllIssuesAsync(string? search = null, string? status = null, string? priority = null, string? type = null, int? userId = null, string? role = null);
    Task<IssueDto?> GetIssueByIdAsync(int id);
    Task<IssueDto> CreateIssueAsync(CreateIssueDto createIssueDto, int userId);
    Task<bool> CloseIssueAsync(int id);
    Task<bool> DeleteIssueAsync(int id, int userId);
    Task<IEnumerable<AuditLog>> GetIssueLogsAsync(int id);
}
