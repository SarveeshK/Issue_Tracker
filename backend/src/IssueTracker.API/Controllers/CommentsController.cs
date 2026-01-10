using IssueTracker.Application.DTOs;
using IssueTracker.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

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

    [HttpPost]
    public async Task<ActionResult<CommentDto>> Create(CreateCommentDto dto)
    {
        try
        {
            var comment = await _commentService.CreateCommentAsync(dto);
            return CreatedAtAction(nameof(GetByTaskId), new { taskId = dto.TaskId }, comment);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
