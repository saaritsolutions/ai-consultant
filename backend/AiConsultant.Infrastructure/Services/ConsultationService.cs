using AiConsultant.Core.DTOs.Consultation;
using AiConsultant.Core.Entities;
using AiConsultant.Core.Interfaces.Repositories;
using AiConsultant.Core.Interfaces.Services;

namespace AiConsultant.Infrastructure.Services;

public class ConsultationService : IConsultationService
{
    private readonly IConsultationRepository _repository;
    private readonly IEmailService _emailService;

    public ConsultationService(IConsultationRepository repository, IEmailService emailService)
    {
        _repository = repository;
        _emailService = emailService;
    }

    public async Task<IEnumerable<ConsultationDto>> GetAllAsync()
    {
        var consultations = await _repository.GetAllAsync();
        return consultations.Select(MapToDto);
    }

    public async Task<ConsultationDto> CreateAsync(CreateConsultationDto dto)
    {
        if (!Enum.TryParse<ConsultationType>(dto.Type, true, out var type))
            throw new ArgumentException($"Invalid consultation type: {dto.Type}. Valid values: Free, Paid");

        var consultation = new Consultation
        {
            Name = dto.Name,
            Email = dto.Email,
            Organization = dto.Organization,
            Message = dto.Message,
            Type = type,
            Status = ConsultationStatus.Pending,
            PreferredDate = dto.PreferredDate,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _repository.CreateAsync(consultation);
        var dto2 = MapToDto(created);

        await _emailService.SendConsultationNotificationAsync(dto2);

        return dto2;
    }

    public async Task<ConsultationDto> UpdateStatusAsync(Guid id, string status)
    {
        if (!Enum.TryParse<ConsultationStatus>(status, true, out var consultationStatus))
            throw new ArgumentException($"Invalid status: {status}. Valid values: Pending, Completed");

        var updated = await _repository.UpdateStatusAsync(id, consultationStatus);
        return MapToDto(updated);
    }

    private static ConsultationDto MapToDto(Consultation c) => new()
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
    };
}
