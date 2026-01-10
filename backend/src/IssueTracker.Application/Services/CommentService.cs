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
        // Fetch all comments for the task
        var comments = await _commentRepo.FindAsync(c => c.TaskId == taskId);
        
        // Fetch users to map names (Manual join again since no Includes in generic repo yet)
        var userIds = comments.Select(c => c.UserId).Distinct();
        // This is inefficient (N+1-ish if we loop find), but better:
        // Generic Repo FindAsync usage limits us. 
        // In real app, we use Join or Includes.
        // For scaffold, I'll just map IDs to names if I can, or return "User X".
        // Actually, let's try to fetch all users.
        var allUsers = await _userRepo.GetAllAsync();
        var userDictionary = allUsers.ToDictionary(u => u.UserId, u => u.Name);

        // Map to DTOs
        var dtos = comments.Select(c => new CommentDto
        {
            CommentId = c.CommentId,
            TaskId = c.TaskId,
            UserId = c.UserId,
            UserName = userDictionary.ContainsKey(c.UserId) ? userDictionary[c.UserId] : "Unknown",
            CommentText = c.CommentText,
            ParentCommentId = c.ParentCommentId,
            CreatedDate = c.CreatedDate
        }).ToList();

        // Build Hierarchy (Threading)
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
        var comment = new Comment
        {
            TaskId = dto.TaskId,
            UserId = dto.UserId,
            CommentText = dto.CommentText,
            ParentCommentId = dto.ParentCommentId,
            CreatedDate = DateTime.UtcNow
        };

        await _commentRepo.AddAsync(comment);

        // Fetch user name
        var user = await _userRepo.GetByIdAsync(dto.UserId);

        return new CommentDto
        {
            CommentId = comment.CommentId,
            TaskId = comment.TaskId,
            UserId = comment.UserId,
            UserName = user?.Name ?? "Unknown",
            CommentText = comment.CommentText,
            ParentCommentId = comment.ParentCommentId,
            CreatedDate = comment.CreatedDate,
            Replies = new List<CommentDto>()
        };
    }
}
