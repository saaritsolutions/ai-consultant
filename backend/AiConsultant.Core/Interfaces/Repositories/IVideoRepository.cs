using AiConsultant.Core.Entities;

namespace AiConsultant.Core.Interfaces.Repositories;

public interface IVideoRepository
{
    Task<IEnumerable<Video>> GetAllAsync();
    Task<Video?> GetByIdAsync(Guid id);
    Task<Video> CreateAsync(Video video);
    Task<Video> UpdateAsync(Video video);
    Task DeleteAsync(Guid id);
    Task<int> GetCountAsync();
}
