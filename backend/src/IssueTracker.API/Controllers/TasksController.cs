using IssueTracker.Application.DTOs;
using IssueTracker.Application.Interfaces;
using IssueTracker.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace IssueTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpGet("issue/{issueId}")]
    public async Task<ActionResult<IEnumerable<TaskDto>>> GetByIssueId(int issueId)
    {
        var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        int? userId = null;
        if (int.TryParse(userIdString, out int id))
        {
            userId = id;
        }
        var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

        var tasks = await _taskService.GetTasksByIssueIdAsync(issueId, userId, role);
        return Ok(tasks);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskDto>> GetById(int id)
    {
        var task = await _taskService.GetTaskByIdAsync(id);
        if (task == null) return NotFound();
        return Ok(task);
    }

    [HttpPost]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<ActionResult<TaskDto>> Create(CreateTaskDto dto)
    {
        try
        {
            var task = await _taskService.CreateTaskAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = task.TaskId }, task);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}/assign")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")] // Strictly Admin
    public async Task<IActionResult> Assign(int id, [FromBody] AssignTaskDto dto)
    {
        try
        {
            var result = await _taskService.AssignTaskAsync(id, dto.UserId);
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}/status")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin,Developer,Manager,QA")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateTaskStatusDto dto)
    {
        try
        {
            var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value ?? "User";
            var result = await _taskService.UpdateTaskStatusAsync(id, dto.StatusName, userRole);
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();

        var userId = int.Parse(userIdClaim.Value);
        var result = await _taskService.DeleteTaskAsync(id, userId);
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpGet("{id}/logs")]
    public async Task<ActionResult<IEnumerable<AuditLog>>> GetLogs(int id)
    {
        var logs = await _taskService.GetTaskLogsAsync(id);
        return Ok(logs);
    }
}
