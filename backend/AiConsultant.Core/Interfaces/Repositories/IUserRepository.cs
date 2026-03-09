using AiConsultant.Core.Entities;

namespace AiConsultant.Core.Interfaces.Repositories;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);
    Task<User> CreateAsync(User user);
    Task<bool> ExistsAsync(string email);
}
