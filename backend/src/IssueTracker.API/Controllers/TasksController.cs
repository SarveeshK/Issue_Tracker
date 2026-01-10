using IssueTracker.Application.DTOs;
using IssueTracker.Application.Interfaces;
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
        var tasks = await _taskService.GetTasksByIssueIdAsync(issueId);
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
    public async Task<ActionResult<TaskDto>> Create(CreateTaskDto dto)
    {
        try
        {
            var task = await _taskService.CreateTaskAsync(dto);
            return CreatedAtAction(nameof(GetByIssueId), new { issueId = dto.IssueId }, task);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
