using AiConsultant.Core.Entities;

namespace AiConsultant.Core.Interfaces.Repositories;

public interface IBlogPostRepository
{
    Task<IEnumerable<BlogPost>> GetAllAsync();
    Task<BlogPost?> GetByIdAsync(Guid id);
    Task<BlogPost?> GetBySlugAsync(string slug);
    Task<IEnumerable<BlogPost>> GetByCategoryAsync(string category);
    Task<IEnumerable<string>> GetCategoriesAsync();
    Task<BlogPost> CreateAsync(BlogPost blogPost);
    Task<BlogPost> UpdateAsync(BlogPost blogPost);
    Task DeleteAsync(Guid id);
    Task<int> GetCountAsync();
}
