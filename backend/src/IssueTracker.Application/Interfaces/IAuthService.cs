using IssueTracker.Application.DTOs;
using System.Threading.Tasks;

namespace IssueTracker.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
    Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
}
