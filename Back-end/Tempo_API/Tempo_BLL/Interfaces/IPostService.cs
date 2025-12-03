using Tempo_BLL.Models;

namespace Tempo_BLL.Interfaces;

public interface IPostService
{
    Task<PostModel> CreatePostAsync(CreatePostModel createPostModel, string postsDirectory);
    Task<List<PostModel>> GetAllPostsAsync(string postsDirectory);
    Task<PostModel?> GetPostByIdAsync(string id, string postsDirectory);
    Task<bool> DeletePostAsync(string id, string postsDirectory);
}

