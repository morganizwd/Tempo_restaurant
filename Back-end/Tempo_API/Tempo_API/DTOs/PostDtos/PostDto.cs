namespace Tempo_API.DTOs.PostDtos;

public class PostDto
{
    public string Id { get; set; } = string.Empty;
    public string DishName { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

