using System.Text.RegularExpressions;
using AiConsultant.Core.DTOs.Blog;
using AiConsultant.Core.Entities;
using AiConsultant.Core.Interfaces.Repositories;
using AiConsultant.Core.Interfaces.Services;

namespace AiConsultant.Infrastructure.Services;

public class BlogService : IBlogService
{
    private readonly IBlogPostRepository _repository;

    public BlogService(IBlogPostRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<BlogPostSummaryDto>> GetAllAsync(string? category = null)
    {
        var posts = string.IsNullOrWhiteSpace(category)
            ? await _repository.GetAllAsync()
            : await _repository.GetByCategoryAsync(category);

        return posts.Select(MapToSummary);
    }

    public async Task<BlogPostDto?> GetBySlugAsync(string slug)
    {
        var post = await _repository.GetBySlugAsync(slug);
        return post == null ? null : MapToDto(post);
    }

    public async Task<BlogPostDto?> GetByIdAsync(Guid id)
    {
        var post = await _repository.GetByIdAsync(id);
        return post == null ? null : MapToDto(post);
    }

    public async Task<IEnumerable<string>> GetCategoriesAsync()
        => await _repository.GetCategoriesAsync();

    public async Task<BlogPostDto> CreateAsync(CreateBlogPostDto dto)
    {
        var slug = await GenerateUniqueSlugAsync(dto.Title);

        var post = new BlogPost
        {
            Title = dto.Title,
            Slug = slug,
            Content = dto.Content,
            Category = dto.Category,
            Tags = string.Join(",", dto.Tags.Select(t => t.Trim()).Where(t => !string.IsNullOrEmpty(t))),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var created = await _repository.CreateAsync(post);
        return MapToDto(created);
    }

    public async Task<BlogPostDto> UpdateAsync(Guid id, UpdateBlogPostDto dto)
    {
        var existing = await _repository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Blog post with ID {id} not found.");

        var newSlug = GenerateSlug(dto.Title);
        if (newSlug != existing.Slug)
        {
            var existingWithSlug = await _repository.GetBySlugAsync(newSlug);
            if (existingWithSlug != null && existingWithSlug.Id != id)
                newSlug = $"{newSlug}-{DateTime.UtcNow:yyyyMMddHHmmss}";
        }

        existing.Title = dto.Title;
        existing.Slug = newSlug;
        existing.Content = dto.Content;
        existing.Category = dto.Category;
        existing.Tags = string.Join(",", dto.Tags.Select(t => t.Trim()).Where(t => !string.IsNullOrEmpty(t)));
        existing.UpdatedAt = DateTime.UtcNow;

        var updated = await _repository.UpdateAsync(existing);
        return MapToDto(updated);
    }

    public async Task DeleteAsync(Guid id) => await _repository.DeleteAsync(id);

    private async Task<string> GenerateUniqueSlugAsync(string title)
    {
        var slug = GenerateSlug(title);
        var existing = await _repository.GetBySlugAsync(slug);
        if (existing != null)
            slug = $"{slug}-{DateTime.UtcNow:yyyyMMddHHmmss}";
        return slug;
    }

    private static string GenerateSlug(string title)
    {
        var slug = title.ToLowerInvariant();
        slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
        slug = Regex.Replace(slug, @"\s+", "-");
        slug = Regex.Replace(slug, @"-+", "-");
        return slug.Trim('-');
    }

    private static string StripHtml(string html)
    {
        return Regex.Replace(html, "<.*?>", string.Empty);
    }

    private static BlogPostSummaryDto MapToSummary(BlogPost post)
    {
        var plainText = StripHtml(post.Content);
        return new BlogPostSummaryDto
        {
            Id = post.Id,
            Title = post.Title,
            Slug = post.Slug,
            Category = post.Category,
            Tags = ParseTags(post.Tags),
            Excerpt = plainText.Length > 250 ? plainText[..250] + "..." : plainText,
            CreatedAt = post.CreatedAt
        };
    }

    private static BlogPostDto MapToDto(BlogPost post) => new()
    {
        Id = post.Id,
        Title = post.Title,
        Slug = post.Slug,
        Content = post.Content,
        Category = post.Category,
        Tags = ParseTags(post.Tags),
        CreatedAt = post.CreatedAt,
        UpdatedAt = post.UpdatedAt
    };

    private static List<string> ParseTags(string tags)
        => tags.Split(',', StringSplitOptions.RemoveEmptyEntries)
               .Select(t => t.Trim())
               .Where(t => !string.IsNullOrEmpty(t))
               .ToList();
}
