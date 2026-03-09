using AiConsultant.Core.DTOs.Auth;

namespace AiConsultant.Core.Interfaces.Services;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginDto dto);
}
