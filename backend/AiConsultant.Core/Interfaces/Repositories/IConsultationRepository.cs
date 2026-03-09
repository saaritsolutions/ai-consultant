using AiConsultant.Core.Entities;

namespace AiConsultant.Core.Interfaces.Repositories;

public interface IConsultationRepository
{
    Task<IEnumerable<Consultation>> GetAllAsync();
    Task<Consultation?> GetByIdAsync(Guid id);
    Task<Consultation> CreateAsync(Consultation consultation);
    Task<Consultation> UpdateStatusAsync(Guid id, ConsultationStatus status);
    Task<int> GetCountAsync();
    Task<int> GetCountByStatusAsync(ConsultationStatus status);
    Task<IEnumerable<Consultation>> GetRecentAsync(int count);
}
