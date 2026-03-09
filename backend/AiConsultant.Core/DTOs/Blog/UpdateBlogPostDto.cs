using System.ComponentModel.DataAnnotations;

namespace AiConsultant.Core.DTOs.Blog;

public class UpdateBlogPostDto
{
    [Required]
    [MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    public List<string> Tags { get; set; } = [];
}
