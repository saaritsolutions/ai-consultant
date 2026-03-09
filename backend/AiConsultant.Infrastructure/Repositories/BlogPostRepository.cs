using AiConsultant.Core.Entities;
using AiConsultant.Core.Interfaces.Repositories;
using AiConsultant.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AiConsultant.Infrastructure.Repositories;

public class BlogPostRepository : IBlogPostRepository
{
    private readonly AppDbContext _context;

    public BlogPostRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<BlogPost>> GetAllAsync()
        => await _context.BlogPosts.OrderByDescending(b => b.CreatedAt).ToListAsync();

    public async Task<BlogPost?> GetByIdAsync(Guid id)
        => await _context.BlogPosts.FindAsync(id);

    public async Task<BlogPost?> GetBySlugAsync(string slug)
        => await _context.BlogPosts.FirstOrDefaultAsync(b => b.Slug == slug);

    public async Task<IEnumerable<BlogPost>> GetByCategoryAsync(string category)
        => await _context.BlogPosts
            .Where(b => b.Category.ToLower() == category.ToLower())
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

    public async Task<IEnumerable<string>> GetCategoriesAsync()
        => await _context.BlogPosts
            .Select(b => b.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();

    public async Task<BlogPost> CreateAsync(BlogPost blogPost)
    {
        _context.BlogPosts.Add(blogPost);
        await _context.SaveChangesAsync();
        return blogPost;
    }

    public async Task<BlogPost> UpdateAsync(BlogPost blogPost)
    {
        _context.Entry(blogPost).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return blogPost;
    }

    public async Task DeleteAsync(Guid id)
    {
        var post = await _context.BlogPosts.FindAsync(id);
        if (post != null)
        {
            _context.BlogPosts.Remove(post);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<int> GetCountAsync()
        => await _context.BlogPosts.CountAsync();
}
