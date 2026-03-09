using AiConsultant.Core.DTOs.Blog;

namespace AiConsultant.Core.Interfaces.Services;

public interface IBlogService
{
    Task<IEnumerable<BlogPostSummaryDto>> GetAllAsync(string? category = null);
    Task<BlogPostDto?> GetBySlugAsync(string slug);
    Task<BlogPostDto?> GetByIdAsync(Guid id);
    Task<IEnumerable<string>> GetCategoriesAsync();
    Task<BlogPostDto> CreateAsync(CreateBlogPostDto dto);
    Task<BlogPostDto> UpdateAsync(Guid id, UpdateBlogPostDto dto);
    Task DeleteAsync(Guid id);
}
