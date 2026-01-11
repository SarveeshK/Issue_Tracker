using IssueTracker.Application.DTOs;

namespace IssueTracker.Application.Interfaces;

public interface ICommentService
{
    System.Threading.Tasks.Task<IEnumerable<CommentDto>> GetCommentsByTaskIdAsync(int taskId);
    System.Threading.Tasks.Task<IEnumerable<CommentDto>> GetCommentsByIssueIdAsync(int issueId);
    System.Threading.Tasks.Task<CommentDto> CreateCommentAsync(CreateCommentDto commentDto);
    // Add Delete?
}
