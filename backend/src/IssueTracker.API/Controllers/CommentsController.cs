using IssueTracker.Application.DTOs;
using IssueTracker.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace IssueTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentsController : ControllerBase
{
    private readonly ICommentService _commentService;

    public CommentsController(ICommentService commentService)
    {
        _commentService = commentService;
    }

    [HttpGet("task/{taskId}")]
    public async Task<ActionResult<IEnumerable<CommentDto>>> GetByTaskId(int taskId)
    {
        var comments = await _commentService.GetCommentsByTaskIdAsync(taskId);
        return Ok(comments);
    }

    [HttpGet("issue/{issueId}")]
    public async Task<ActionResult<IEnumerable<CommentDto>>> GetByIssueId(int issueId)
    {
        var comments = await _commentService.GetCommentsByIssueIdAsync(issueId);
        return Ok(comments);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<CommentDto>> Create(CreateCommentDto dto)
    {
        try
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdString, out int userId))
            {
                dto.UserId = userId; // Override with authenticated user
            }

            var comment = await _commentService.CreateCommentAsync(dto);
            return Ok(comment);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
