using System.Text.Json;
using Tempo_BLL.Interfaces;
using Tempo_BLL.Models;

namespace Tempo_BLL.Services;

public class PostService : IPostService
{
    private readonly IDishService _dishService;
    private readonly IMistralAIService _mistralAIService;

    public PostService(
        IDishService dishService,
        IMistralAIService mistralAIService)
    {
        _dishService = dishService;
        _mistralAIService = mistralAIService;
    }

    public async Task<PostModel> CreatePostAsync(CreatePostModel createPostModel, string postsDirectory)
    {
        // Создаем директорию если её нет
        if (!Directory.Exists(postsDirectory))
        {
            Directory.CreateDirectory(postsDirectory);
        }

        // Получаем информацию о блюде
        var dish = await _dishService.GetById(createPostModel.DishId, CancellationToken.None);
        if (dish == null)
        {
            throw new Exception($"Dish with id {createPostModel.DishId} not found");
        }

        // Генерируем текст поста через Mistral AI
        var dishDescription = $"Вкусное блюдо {dish.Name} по цене {dish.Price} рублей. Время приготовления: {dish.Approx_time} минут.";
        var postText = await _mistralAIService.GeneratePostTextAsync(dish.Name, dishDescription);

        // Используем изображение от клиента или фото из базы данных
        string imageUrl = !string.IsNullOrEmpty(createPostModel.ImageUrl) 
            ? createPostModel.ImageUrl 
            : dish.Photo;

        // Создаем пост
        var post = new PostModel
        {
            Id = Guid.NewGuid().ToString(),
            DishName = dish.Name,
            Text = postText,
            ImageUrl = imageUrl,
            CreatedAt = DateTime.UtcNow
        };

        // Сохраняем пост в JSON файл
        await SavePostToFileAsync(post, postsDirectory);

        return post;
    }

    public async Task<List<PostModel>> GetAllPostsAsync(string postsDirectory)
    {
        var posts = new List<PostModel>();
        
        if (!Directory.Exists(postsDirectory))
        {
            return posts;
        }

        var files = Directory.GetFiles(postsDirectory, "*.json");
        
        foreach (var file in files)
        {
            try
            {
                var json = await File.ReadAllTextAsync(file);
                var post = JsonSerializer.Deserialize<PostModel>(json);
                if (post != null)
                {
                    posts.Add(post);
                }
            }
            catch
            {
                // Пропускаем поврежденные файлы
            }
        }

        return posts.OrderByDescending(p => p.CreatedAt).ToList();
    }

    public async Task<PostModel?> GetPostByIdAsync(string id, string postsDirectory)
    {
        var filePath = Path.Combine(postsDirectory, $"{id}.json");
        
        if (!File.Exists(filePath))
        {
            return null;
        }

        try
        {
            var json = await File.ReadAllTextAsync(filePath);
            return JsonSerializer.Deserialize<PostModel>(json);
        }
        catch
        {
            return null;
        }
    }

    public async Task<bool> DeletePostAsync(string id, string postsDirectory)
    {
        var filePath = Path.Combine(postsDirectory, $"{id}.json");
        
        if (!File.Exists(filePath))
        {
            return false;
        }

        try
        {
            File.Delete(filePath);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<PostModel?> UpdatePostStatsAsync(string id, int? likes, int? views, int? reposts, int? comments, string postsDirectory)
    {
        var post = await GetPostByIdAsync(id, postsDirectory);
        if (post == null)
        {
            return null;
        }

        // Обновляем только переданные значения
        if (likes.HasValue)
        {
            post.Likes = likes.Value;
        }
        if (views.HasValue)
        {
            post.Views = views.Value;
        }
        if (reposts.HasValue)
        {
            post.Reposts = reposts.Value;
        }
        if (comments.HasValue)
        {
            post.Comments = comments.Value;
        }

        // Сохраняем обновленный пост
        await SavePostToFileAsync(post, postsDirectory);

        return post;
    }

    private async Task SavePostToFileAsync(PostModel post, string postsDirectory)
    {
        var filePath = Path.Combine(postsDirectory, $"{post.Id}.json");
        var json = JsonSerializer.Serialize(post, new JsonSerializerOptions { WriteIndented = true });
        await File.WriteAllTextAsync(filePath, json);
    }
}
