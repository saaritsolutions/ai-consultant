using AiConsultant.Core.DTOs.Dashboard;

namespace AiConsultant.Core.Interfaces.Services;

public interface IDashboardService
{
    Task<DashboardDto> GetDashboardAsync();
}
