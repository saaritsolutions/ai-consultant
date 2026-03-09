using AiConsultant.Core.DTOs.Blog;
using AiConsultant.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AiConsultant.API.Controllers;

[ApiController]
[Route("api/blogs")]
public class BlogController : ControllerBase
{
    private readonly IBlogService _blogService;

    public BlogController(IBlogService blogService)
    {
        _blogService = blogService;
    }

    /// <summary>Get all blog posts. Optionally filter by category.</summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BlogPostSummaryDto>>> GetAll([FromQuery] string? category = null)
    {
        var posts = await _blogService.GetAllAsync(category);
        return Ok(posts);
    }

    /// <summary>Get all distinct categories.</summary>
    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<string>>> GetCategories()
    {
        var categories = await _blogService.GetCategoriesAsync();
        return Ok(categories);
    }

    /// <summary>Get blog post by slug (public).</summary>
    [HttpGet("{slug}")]
    public async Task<ActionResult<BlogPostDto>> GetBySlug(string slug)
    {
        var post = await _blogService.GetBySlugAsync(slug);
        if (post == null) return NotFound(new { message = $"Blog post '{slug}' not found." });
        return Ok(post);
    }

    /// <summary>Get blog post by ID (admin edit).</summary>
    [HttpGet("admin/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<BlogPostDto>> GetById(Guid id)
    {
        var post = await _blogService.GetByIdAsync(id);
        if (post == null) return NotFound(new { message = "Blog post not found." });
        return Ok(post);
    }

    /// <summary>Create a new blog post (admin).</summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<BlogPostDto>> Create([FromBody] CreateBlogPostDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var created = await _blogService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetBySlug), new { slug = created.Slug }, created);
    }

    /// <summary>Update an existing blog post (admin).</summary>
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<BlogPostDto>> Update(Guid id, [FromBody] UpdateBlogPostDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var updated = await _blogService.UpdateAsync(id, dto);
        return Ok(updated);
    }

    /// <summary>Delete a blog post (admin).</summary>
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _blogService.DeleteAsync(id);
        return NoContent();
    }
}
