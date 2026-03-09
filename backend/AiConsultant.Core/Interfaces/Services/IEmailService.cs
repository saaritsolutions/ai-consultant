using AiConsultant.Core.DTOs.Consultation;

namespace AiConsultant.Core.Interfaces.Services;

public interface IEmailService
{
    Task SendConsultationNotificationAsync(ConsultationDto consultation);
}
