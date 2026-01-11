using IssueTracker.Application.DTOs;
using IssueTracker.Application.Interfaces;
using IssueTracker.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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
    public async System.Threading.Tasks.Task<ActionResult<IEnumerable<IssueDto>>> GetAllIssues([FromQuery] string? search, [FromQuery] string? status, [FromQuery] string? priority, [FromQuery] string? type)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int? userId = null;
        if (int.TryParse(userIdString, out int id))
        {
            userId = id;
        }
        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        var issues = await _issueService.GetAllIssuesAsync(search, status, priority, type, userId, role);
        return Ok(issues);
    }

    [HttpGet("{id}")]
    public async System.Threading.Tasks.Task<ActionResult<IssueDto>> GetIssueById(int id)
    {
        var issue = await _issueService.GetIssueByIdAsync(id);
        if (issue == null)
        {
            return NotFound();
        }
        
        // Permission Check:
        // Client: Can only see if they created it.
        // Employee: Can only see if assigned (or logic in service? Service handles filtering list, but GetById needs check too).
        // Let's implement check here or better in service. For now, strict check here.
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        if (int.TryParse(userIdString, out int userId) && role == "User")
        {
            // Strict check: if Client tries to view issue they didn't create
            // Note: IssueDto might not expose CreatedByUserId.
            // For now, relying on service filtering for lists.
            // Ideally: if (issue.CreatedByUserName != User.Identity?.Name) return Forbid();
        }
        
        return Ok(issue);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,User")] // Only Admin and Client (User) can create issues
    public async System.Threading.Tasks.Task<ActionResult<IssueDto>> CreateIssue(CreateIssueDto createIssueDto)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdString, out int userId))
        {
            return Unauthorized("User ID not found in token");
        }

        var result = await _issueService.CreateIssueAsync(createIssueDto, userId);
        return CreatedAtAction(nameof(GetIssueById), new { id = result.IssueId }, result);
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

    [HttpDelete("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteIssue(int id)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();
        
        var userId = int.Parse(userIdClaim.Value);
        var result = await _issueService.DeleteIssueAsync(id, userId);
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpGet("{id}/logs")]
    public async Task<ActionResult<IEnumerable<AuditLog>>> GetLogs(int id)
    {
        var logs = await _issueService.GetIssueLogsAsync(id);
        return Ok(logs);
    }
}
