using System.ComponentModel.DataAnnotations;

namespace AiConsultant.Core.DTOs.Consultation;

public class ConsultationDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Organization { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime PreferredDate { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateConsultationDto
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [MaxLength(300)]
    public string Organization { get; set; } = string.Empty;

    [Required]
    [MaxLength(2000)]
    public string Message { get; set; } = string.Empty;

    [Required]
    public string Type { get; set; } = "Free";

    [Required]
    public DateTime PreferredDate { get; set; }
}

public class UpdateConsultationStatusDto
{
    [Required]
    public string Status { get; set; } = string.Empty;
}
