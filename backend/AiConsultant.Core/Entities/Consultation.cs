namespace AiConsultant.Core.Entities;

public enum ConsultationType
{
    Free,
    Paid
}

public enum ConsultationStatus
{
    Pending,
    Completed
}

public class Consultation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Organization { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public ConsultationType Type { get; set; } = ConsultationType.Free;
    public ConsultationStatus Status { get; set; } = ConsultationStatus.Pending;
    public DateTime PreferredDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
