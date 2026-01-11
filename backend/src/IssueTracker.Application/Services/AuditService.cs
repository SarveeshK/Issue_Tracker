using IssueTracker.Application.Interfaces;
using IssueTracker.Domain.Entities;
using IssueTracker.Domain.Interfaces;

namespace IssueTracker.Application.Services;

public class AuditService : IAuditService
{
    private readonly IRepository<AuditLog> _auditLogRepository;

    public AuditService(IRepository<AuditLog> auditLogRepository)
    {
        _auditLogRepository = auditLogRepository;
    }

    public async System.Threading.Tasks.Task LogActivityAsync(string entityType, int entityId, string action, string detail, int? userId)
    {
        var log = new AuditLog
        {
            EntityType = entityType,
            EntityId = entityId,
            Action = action,
            Detail = detail,
            UserId = userId,
            Timestamp = DateTime.UtcNow
        };

        await _auditLogRepository.AddAsync(log);
    }

    public async System.Threading.Tasks.Task<IEnumerable<AuditLog>> GetLogsForEntityAsync(string entityType, int entityId)
    {
        var allLogs = await _auditLogRepository.GetAllAsync();
        return allLogs
            .Where(l => l.EntityType == entityType && l.EntityId == entityId)
            .OrderByDescending(l => l.Timestamp)
            .ToList();
    }
}
