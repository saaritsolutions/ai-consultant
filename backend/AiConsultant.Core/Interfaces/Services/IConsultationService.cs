using AiConsultant.Core.DTOs.Consultation;

namespace AiConsultant.Core.Interfaces.Services;

public interface IConsultationService
{
    Task<IEnumerable<ConsultationDto>> GetAllAsync();
    Task<ConsultationDto> CreateAsync(CreateConsultationDto dto);
    Task<ConsultationDto> UpdateStatusAsync(Guid id, string status);
}
