using IssueTracker.Domain.Entities;

namespace IssueTracker.Application.Interfaces;

public interface IAuditService
{
    System.Threading.Tasks.Task LogActivityAsync(string entityType, int entityId, string action, string detail, int? userId);
    System.Threading.Tasks.Task<IEnumerable<AuditLog>> GetLogsForEntityAsync(string entityType, int entityId);
}
