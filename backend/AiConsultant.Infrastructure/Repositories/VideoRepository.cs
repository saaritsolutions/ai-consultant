using AiConsultant.Core.Entities;
using AiConsultant.Core.Interfaces.Repositories;
using AiConsultant.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AiConsultant.Infrastructure.Repositories;

public class VideoRepository : IVideoRepository
{
    private readonly AppDbContext _context;

    public VideoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Video>> GetAllAsync()
        => await _context.Videos.OrderByDescending(v => v.CreatedAt).ToListAsync();

    public async Task<Video?> GetByIdAsync(Guid id)
        => await _context.Videos.FindAsync(id);

    public async Task<Video> CreateAsync(Video video)
    {
        _context.Videos.Add(video);
        await _context.SaveChangesAsync();
        return video;
    }

    public async Task<Video> UpdateAsync(Video video)
    {
        _context.Entry(video).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return video;
    }

    public async Task DeleteAsync(Guid id)
    {
        var video = await _context.Videos.FindAsync(id);
        if (video != null)
        {
            _context.Videos.Remove(video);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<int> GetCountAsync()
        => await _context.Videos.CountAsync();
}
