using Tempo_BLL.Models;

namespace Tempo_BLL.Interfaces;

public interface IPostService
{
    Task<PostModel> CreatePostAsync(CreatePostModel createPostModel, string postsDirectory);
    Task<List<PostModel>> GetAllPostsAsync(string postsDirectory);
    Task<PostModel?> GetPostByIdAsync(string id, string postsDirectory);
    Task<bool> DeletePostAsync(string id, string postsDirectory);
    Task<PostModel?> UpdatePostStatsAsync(string id, int? likes, int? views, int? reposts, int? comments, string postsDirectory);
}

