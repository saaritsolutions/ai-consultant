using AiConsultant.Core.DTOs.Consultation;

namespace AiConsultant.Core.DTOs.Dashboard;

public class DashboardDto
{
    public int TotalBlogs { get; set; }
    public int TotalVideos { get; set; }
    public int TotalConsultations { get; set; }
    public int PendingConsultations { get; set; }
    public int CompletedConsultations { get; set; }
    public List<ConsultationDto> RecentConsultations { get; set; } = [];
}
