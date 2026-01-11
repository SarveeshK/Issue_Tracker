using IssueTracker.Application.DTOs;

namespace IssueTracker.Application.Interfaces;

public interface ICommentService
{
    System.Threading.Tasks.    Task<IEnumerable<CommentDto>> GetCommentsByTaskIdAsync(int taskId, string requesterRole);
    Task<IEnumerable<CommentDto>> GetCommentsByIssueIdAsync(int issueId, string requesterRole);
    System.Threading.Tasks.Task<CommentDto> CreateCommentAsync(CreateCommentDto commentDto);
    // Add Delete?
}
