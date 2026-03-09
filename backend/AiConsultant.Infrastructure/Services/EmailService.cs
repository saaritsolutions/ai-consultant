using AiConsultant.Core.DTOs.Consultation;
using AiConsultant.Core.Interfaces.Services;
using Microsoft.Extensions.Logging;

namespace AiConsultant.Infrastructure.Services;

/// <summary>
/// Placeholder email service. Replace with a real provider such as SendGrid, Mailgun, or SMTP.
/// </summary>
public class EmailService : IEmailService
{
    private readonly ILogger<EmailService> _logger;

    public EmailService(ILogger<EmailService> logger)
    {
        _logger = logger;
    }

    public Task SendConsultationNotificationAsync(ConsultationDto consultation)
    {
        // TODO: Integrate real email provider here.
        // Example: await _sendGridClient.SendEmailAsync(msg);
        _logger.LogInformation(
            "[EMAIL PLACEHOLDER] New {Type} consultation from {Name} ({Email}) for {Date}. Message: {Message}",
            consultation.Type,
            consultation.Name,
            consultation.Email,
            consultation.PreferredDate.ToString("yyyy-MM-dd HH:mm"),
            consultation.Message[..Math.Min(100, consultation.Message.Length)]);

        return Task.CompletedTask;
    }
}
