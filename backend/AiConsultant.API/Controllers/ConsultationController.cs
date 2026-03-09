using AiConsultant.Core.DTOs.Consultation;
using AiConsultant.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AiConsultant.API.Controllers;

[ApiController]
[Route("api/consultations")]
public class ConsultationController : ControllerBase
{
    private readonly IConsultationService _consultationService;

    public ConsultationController(IConsultationService consultationService)
    {
        _consultationService = consultationService;
    }

    /// <summary>Submit a new consultation request (public).</summary>
    [HttpPost]
    public async Task<ActionResult<ConsultationDto>> Create([FromBody] CreateConsultationDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var created = await _consultationService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetAll), new { id = created.Id }, created);
    }

    /// <summary>Get all consultation requests (admin).</summary>
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<ConsultationDto>>> GetAll()
    {
        var consultations = await _consultationService.GetAllAsync();
        return Ok(consultations);
    }

    /// <summary>Update consultation status (admin).</summary>
    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ConsultationDto>> UpdateStatus(
        Guid id,
        [FromBody] UpdateConsultationStatusDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var updated = await _consultationService.UpdateStatusAsync(id, dto.Status);
        return Ok(updated);
    }
}
