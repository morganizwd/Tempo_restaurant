namespace Tempo_API.DTOs.PostDtos;

public class CreatePostDto
{
    public Guid DishId { get; set; }
    public string? ImageUrl { get; set; } // URL изображения (сгенерированного через Puter.js или загруженного)
}

