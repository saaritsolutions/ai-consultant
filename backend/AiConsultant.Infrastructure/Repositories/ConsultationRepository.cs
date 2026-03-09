using AiConsultant.Core.Entities;
using AiConsultant.Core.Interfaces.Repositories;
using AiConsultant.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AiConsultant.Infrastructure.Repositories;

public class ConsultationRepository : IConsultationRepository
{
    private readonly AppDbContext _context;

    public ConsultationRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Consultation>> GetAllAsync()
        => await _context.Consultations.OrderByDescending(c => c.CreatedAt).ToListAsync();

    public async Task<Consultation?> GetByIdAsync(Guid id)
        => await _context.Consultations.FindAsync(id);

    public async Task<Consultation> CreateAsync(Consultation consultation)
    {
        _context.Consultations.Add(consultation);
        await _context.SaveChangesAsync();
        return consultation;
    }

    public async Task<Consultation> UpdateStatusAsync(Guid id, ConsultationStatus status)
    {
        var consultation = await _context.Consultations.FindAsync(id)
            ?? throw new KeyNotFoundException($"Consultation with ID {id} not found.");

        consultation.Status = status;
        await _context.SaveChangesAsync();
        return consultation;
    }

    public async Task<int> GetCountAsync()
        => await _context.Consultations.CountAsync();

    public async Task<int> GetCountByStatusAsync(ConsultationStatus status)
        => await _context.Consultations.CountAsync(c => c.Status == status);

    public async Task<IEnumerable<Consultation>> GetRecentAsync(int count)
        => await _context.Consultations
            .OrderByDescending(c => c.CreatedAt)
            .Take(count)
            .ToListAsync();
}
