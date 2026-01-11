using IssueTracker.Application.DTOs;
using IssueTracker.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace IssueTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IssuesController : ControllerBase
{
    private readonly IIssueService _issueService;

    public IssuesController(IIssueService issueService)
    {
        _issueService = issueService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<IssueDto>>> GetIssues(
        [FromQuery] string? search,
        [FromQuery] string? status,
        [FromQuery] string? priority,
        [FromQuery] string? type)
    {
        var issues = await _issueService.GetAllIssuesAsync(search, status, priority, type);
        return Ok(issues);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<IssueDto>> GetIssue(int id)
    {
        var issue = await _issueService.GetIssueByIdAsync(id);
        if (issue == null) return NotFound();
        return Ok(issue);
    }

    [HttpPost]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<ActionResult<IssueDto>> CreateIssue(CreateIssueDto dto)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();
        
        var userId = int.Parse(userIdClaim.Value);
        var issue = await _issueService.CreateIssueAsync(dto, userId);
        return CreatedAtAction(nameof(GetIssue), new { id = issue.IssueId }, issue);
    }

    [HttpPut("{id}/close")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> CloseIssue(int id)
    {
        try
        {
            var result = await _issueService.CloseIssueAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
