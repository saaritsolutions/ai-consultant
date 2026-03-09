using AiConsultant.Core.DTOs.Video;
using AiConsultant.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AiConsultant.API.Controllers;

[ApiController]
[Route("api/videos")]
public class VideoController : ControllerBase
{
    private readonly IVideoService _videoService;

    public VideoController(IVideoService videoService)
    {
        _videoService = videoService;
    }

    /// <summary>Get all videos (public).</summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<VideoDto>>> GetAll()
    {
        var videos = await _videoService.GetAllAsync();
        return Ok(videos);
    }

    /// <summary>Get video by ID (public).</summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<VideoDto>> GetById(Guid id)
    {
        var video = await _videoService.GetByIdAsync(id);
        if (video == null) return NotFound(new { message = "Video not found." });
        return Ok(video);
    }

    /// <summary>Create a new video (admin).</summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<VideoDto>> Create([FromBody] CreateVideoDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var created = await _videoService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>Update a video (admin).</summary>
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<VideoDto>> Update(Guid id, [FromBody] UpdateVideoDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var updated = await _videoService.UpdateAsync(id, dto);
        return Ok(updated);
    }

    /// <summary>Delete a video (admin).</summary>
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _videoService.DeleteAsync(id);
        return NoContent();
    }
}
