using System.ComponentModel.DataAnnotations;

namespace AiConsultant.Core.DTOs.Video;

public class VideoDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string YouTubeUrl { get; set; } = string.Empty;
    public string EmbedUrl { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateVideoDto
{
    [Required]
    [MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [Url]
    public string YouTubeUrl { get; set; } = string.Empty;
}

public class UpdateVideoDto
{
    [Required]
    [MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [Url]
    public string YouTubeUrl { get; set; } = string.Empty;
}
