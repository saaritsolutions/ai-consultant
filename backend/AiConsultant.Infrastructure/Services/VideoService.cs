using System.Text.RegularExpressions;
using AiConsultant.Core.DTOs.Video;
using AiConsultant.Core.Entities;
using AiConsultant.Core.Interfaces.Repositories;
using AiConsultant.Core.Interfaces.Services;

namespace AiConsultant.Infrastructure.Services;

public class VideoService : IVideoService
{
    private readonly IVideoRepository _repository;

    public VideoService(IVideoRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<VideoDto>> GetAllAsync()
    {
        var videos = await _repository.GetAllAsync();
        return videos.Select(MapToDto);
    }

    public async Task<VideoDto?> GetByIdAsync(Guid id)
    {
        var video = await _repository.GetByIdAsync(id);
        return video == null ? null : MapToDto(video);
    }

    public async Task<VideoDto> CreateAsync(CreateVideoDto dto)
    {
        var video = new Video
        {
            Title = dto.Title,
            Description = dto.Description,
            YouTubeUrl = dto.YouTubeUrl,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _repository.CreateAsync(video);
        return MapToDto(created);
    }

    public async Task<VideoDto> UpdateAsync(Guid id, UpdateVideoDto dto)
    {
        var existing = await _repository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Video with ID {id} not found.");

        existing.Title = dto.Title;
        existing.Description = dto.Description;
        existing.YouTubeUrl = dto.YouTubeUrl;

        var updated = await _repository.UpdateAsync(existing);
        return MapToDto(updated);
    }

    public async Task DeleteAsync(Guid id) => await _repository.DeleteAsync(id);

    private static VideoDto MapToDto(Video video) => new()
    {
        Id = video.Id,
        Title = video.Title,
        Description = video.Description,
        YouTubeUrl = video.YouTubeUrl,
        EmbedUrl = ConvertToEmbedUrl(video.YouTubeUrl),
        CreatedAt = video.CreatedAt
    };

    private static string ConvertToEmbedUrl(string url)
    {
        var match = Regex.Match(url,
            @"(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^&\?\/\s]+)");
        return match.Success
            ? $"https://www.youtube.com/embed/{match.Groups[1].Value}"
            : url;
    }
}
