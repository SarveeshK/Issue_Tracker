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
    public async Task<ActionResult<IEnumerable<IssueDto>>> GetIssues()
    {
        var issues = await _issueService.GetAllIssuesAsync();
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
    public async Task<ActionResult<IssueDto>> CreateIssue(CreateIssueDto dto)
    {
        var issue = await _issueService.CreateIssueAsync(dto);
        return CreatedAtAction(nameof(GetIssue), new { id = issue.IssueId }, issue);
    }

    [HttpPut("{id}/close")]
    public async Task<IActionResult> CloseIssue(int id)
    {
        var result = await _issueService.CloseIssueAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }
}
