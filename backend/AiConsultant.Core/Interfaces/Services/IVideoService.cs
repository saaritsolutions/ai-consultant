using AiConsultant.Core.DTOs.Video;

namespace AiConsultant.Core.Interfaces.Services;

public interface IVideoService
{
    Task<IEnumerable<VideoDto>> GetAllAsync();
    Task<VideoDto?> GetByIdAsync(Guid id);
    Task<VideoDto> CreateAsync(CreateVideoDto dto);
    Task<VideoDto> UpdateAsync(Guid id, UpdateVideoDto dto);
    Task DeleteAsync(Guid id);
}
