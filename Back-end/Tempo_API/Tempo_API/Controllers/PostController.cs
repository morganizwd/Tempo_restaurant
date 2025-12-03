using AutoMapper;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Tempo_API.DTOs.PostDtos;
using Tempo_BLL.Interfaces;
using Tempo_BLL.Models;

namespace Tempo_API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PostController : ControllerBase
{
    private readonly IPostService _postService;
    private readonly IWebHostEnvironment _environment;
    private readonly IMapper _mapper;
    private readonly string _postsDirectory;

    public PostController(IPostService postService, IWebHostEnvironment environment, IMapper mapper)
    {
        _postService = postService;
        _environment = environment;
        _mapper = mapper;
        _postsDirectory = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "posts");
    }

    [HttpPost]
    [DisableRequestSizeLimit]
    [RequestFormLimits(MultipartBodyLengthLimit = 10485760)] // 10 MB
    public async Task<ActionResult<PostDto>> CreatePost(IFormFile? imageFile)
    {
        try
        {
            // Читаем dishId из формы
            if (!Request.Form.TryGetValue("dishId", out var dishIdValue) || string.IsNullOrEmpty(dishIdValue))
            {
                return BadRequest(new { error = "dishId is required" });
            }

            if (!Guid.TryParse(dishIdValue, out var dishId))
            {
                return BadRequest(new { error = "Invalid dishId format" });
            }

            string? imageUrl = null;

            // Если загружен файл, сохраняем его
            if (imageFile != null && imageFile.Length > 0)
            {
                var uploadsDirectory = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "posts");
                if (!Directory.Exists(uploadsDirectory))
                {
                    Directory.CreateDirectory(uploadsDirectory);
                }

                var extension = Path.GetExtension(imageFile.FileName);
                if (string.IsNullOrEmpty(extension))
                {
                    extension = ".png"; // По умолчанию PNG
                }

                var fileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsDirectory, fileName);
                
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(stream);
                }

                imageUrl = $"/uploads/posts/{fileName}";
            }

            var createPostModel = new CreatePostModel
            {
                DishId = dishId,
                ImageUrl = imageUrl
            };

            var postModel = await _postService.CreatePostAsync(createPostModel, _postsDirectory);
            var postDto = _mapper.Map<PostDto>(postModel);
            
            return Ok(postDto);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<PostDto>>> GetAllPosts()
    {
        var postModels = await _postService.GetAllPostsAsync(_postsDirectory);
        var postDtos = _mapper.Map<List<PostDto>>(postModels);
        return Ok(postDtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PostDto>> GetPostById(string id)
    {
        var postModel = await _postService.GetPostByIdAsync(id, _postsDirectory);
        if (postModel == null)
        {
            return NotFound();
        }
        var postDto = _mapper.Map<PostDto>(postModel);
        return Ok(postDto);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeletePost(string id)
    {
        var result = await _postService.DeletePostAsync(id, _postsDirectory);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }
}

