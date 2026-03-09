using AiConsultant.Core.DTOs.Consultation;
using AiConsultant.Core.DTOs.Dashboard;
using AiConsultant.Core.Entities;
using AiConsultant.Core.Interfaces.Repositories;
using AiConsultant.Core.Interfaces.Services;

namespace AiConsultant.Infrastructure.Services;

public class DashboardService : IDashboardService
{
    private readonly IBlogPostRepository _blogRepository;
    private readonly IVideoRepository _videoRepository;
    private readonly IConsultationRepository _consultationRepository;

    public DashboardService(
        IBlogPostRepository blogRepository,
        IVideoRepository videoRepository,
        IConsultationRepository consultationRepository)
    {
        _blogRepository = blogRepository;
        _videoRepository = videoRepository;
        _consultationRepository = consultationRepository;
    }

    public async Task<DashboardDto> GetDashboardAsync()
    {
        var totalBlogs = await _blogRepository.GetCountAsync();
        var totalVideos = await _videoRepository.GetCountAsync();
        var totalConsultations = await _consultationRepository.GetCountAsync();
        var pendingCount = await _consultationRepository.GetCountByStatusAsync(ConsultationStatus.Pending);
        var completedCount = await _consultationRepository.GetCountByStatusAsync(ConsultationStatus.Completed);
        var recentConsultations = await _consultationRepository.GetRecentAsync(5);

        return new DashboardDto
        {
            TotalBlogs = totalBlogs,
            TotalVideos = totalVideos,
            TotalConsultations = totalConsultations,
            PendingConsultations = pendingCount,
            CompletedConsultations = completedCount,
            RecentConsultations = recentConsultations.Select(c => new ConsultationDto
            {
                Id = c.Id,
                Name = c.Name,
                Email = c.Email,
                Organization = c.Organization,
                Message = c.Message,
                Type = c.Type.ToString(),
                Status = c.Status.ToString(),
                PreferredDate = c.PreferredDate,
                CreatedAt = c.CreatedAt
            }).ToList()
        };
    }
}
