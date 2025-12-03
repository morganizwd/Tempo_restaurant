namespace Tempo_BLL.Interfaces;

public interface IMistralAIService
{
    Task<string> GeneratePostTextAsync(string dishName, string dishDescription);
}

