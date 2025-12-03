namespace Tempo_BLL.Models;

public class PostModel
{
    public string Id { get; set; } = string.Empty;
    public string DishName { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    
    // Статистика поста
    public int Likes { get; set; } = 0;
    public int Views { get; set; } = 0;
    public int Reposts { get; set; } = 0;
    public int Comments { get; set; } = 0;
}

public class CreatePostModel
{
    public Guid DishId { get; set; }
    public string? ImageUrl { get; set; }
}

