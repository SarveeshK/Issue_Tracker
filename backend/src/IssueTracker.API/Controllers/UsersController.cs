using Microsoft.AspNetCore.Mvc;
using IssueTracker.Application.Interfaces;
using IssueTracker.Domain.Entities;
using IssueTracker.Domain.Interfaces;

namespace IssueTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IRepository<User> _userRepo;

    public UsersController(IRepository<User> userRepo)
    {
        _userRepo = userRepo;
    }

    [HttpGet]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin,Developer,Manager,QA")]
    public async Task<ActionResult<IEnumerable<dynamic>>> GetUsers()
    {
        // Simple endpoint to list users for assignment dropdown
        // In real app, restrict this to auth users
        var users = await _userRepo.GetAllAsync();
        return Ok(users.Select(u => new 
        { 
            u.UserId, 
            u.Name,
            u.Email 
        }));
    }
}
