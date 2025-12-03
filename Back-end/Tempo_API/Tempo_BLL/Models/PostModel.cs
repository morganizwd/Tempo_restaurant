namespace Tempo_BLL.Models;

public class PostModel
{
    public string Id { get; set; } = string.Empty;
    public string DishName { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreatePostModel
{
    public Guid DishId { get; set; }
    public string? ImageUrl { get; set; }
}

