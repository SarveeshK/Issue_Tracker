using IssueTracker.Application.DTOs;
using IssueTracker.Application.Interfaces;
using IssueTracker.Domain.Interfaces;
using IssueTracker.Domain.Entities;

namespace IssueTracker.Application.Services;

public class CommentService : ICommentService
{
    private readonly IRepository<Comment> _commentRepo;
    private readonly IRepository<User> _userRepo;

    public CommentService(IRepository<Comment> commentRepo, IRepository<User> userRepo)
    {
        _commentRepo = commentRepo;
        _userRepo = userRepo;
    }

    public async System.Threading.Tasks.Task<IEnumerable<CommentDto>> GetCommentsByTaskIdAsync(int taskId)
    {
        var comments = await _commentRepo.FindAsync(c => c.TaskId == taskId); // Assuming soft delete might come later, but for now just TaskId
        return await BuildDtoAndTree(comments);
    }

    public async System.Threading.Tasks.Task<IEnumerable<CommentDto>> GetCommentsByIssueIdAsync(int issueId)
    {
        var comments = await _commentRepo.FindAsync(c => c.IssueId == issueId);
        return await BuildDtoAndTree(comments);
    }

    private async System.Threading.Tasks.Task<IEnumerable<CommentDto>> BuildDtoAndTree(IEnumerable<Comment> comments)
    {
        var allUsers = await _userRepo.GetAllAsync();
        var userDictionary = allUsers.ToDictionary(u => u.UserId, u => u.Name);

        var dtos = comments.Select(c => new CommentDto
        {
            CommentId = c.CommentId,
            TaskId = c.TaskId,
            IssueId = c.IssueId,
            UserId = c.UserId,
            UserName = userDictionary.ContainsKey(c.UserId) ? userDictionary[c.UserId] : "Unknown",
            CommentText = c.CommentText,
            ParentCommentId = c.ParentCommentId,
            CreatedDate = c.CreatedDate
        }).ToList();

        return BuildCommentTree(dtos);
    }

    private IEnumerable<CommentDto> BuildCommentTree(List<CommentDto> allComments)
    {
        var rootComments = allComments.Where(c => c.ParentCommentId == null).ToList();
        foreach (var comment in rootComments)
        {
            AddChildren(comment, allComments);
        }
        return rootComments;
    }

    private void AddChildren(CommentDto parent, List<CommentDto> allComments)
    {
        var children = allComments.Where(c => c.ParentCommentId == parent.CommentId).ToList();
        parent.Replies = children;
        foreach (var child in children)
        {
            AddChildren(child, allComments);
        }
    }

    public async System.Threading.Tasks.Task<CommentDto> CreateCommentAsync(CreateCommentDto dto)
    {
        if (!dto.TaskId.HasValue && !dto.IssueId.HasValue)
        {
             throw new Exception("Comment must be linked to either a Task or an Issue.");
        }

        var comment = new Comment
        {
            TaskId = dto.TaskId,
            IssueId = dto.IssueId,
            UserId = dto.UserId,
            CommentText = dto.CommentText,
            ParentCommentId = dto.ParentCommentId,
            CreatedDate = DateTime.UtcNow
        };

        await _commentRepo.AddAsync(comment);

        var user = await _userRepo.GetByIdAsync(dto.UserId);

        return new CommentDto
        {
            CommentId = comment.CommentId,
            TaskId = comment.TaskId,
            IssueId = comment.IssueId,
            UserId = comment.UserId,
            UserName = user?.Name ?? "Unknown",
            CommentText = comment.CommentText,
            ParentCommentId = comment.ParentCommentId,
            CreatedDate = comment.CreatedDate,
            Replies = new List<CommentDto>()
        };
    }
}
