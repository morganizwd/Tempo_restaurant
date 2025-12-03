namespace Tempo_API.DTOs.PostDtos;

public class PostDto
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

public class UpdatePostStatsDto
{
    public int? Likes { get; set; }
    public int? Views { get; set; }
    public int? Reposts { get; set; }
    public int? Comments { get; set; }
}

