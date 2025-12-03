using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Tempo_BLL.Interfaces;

namespace Tempo_BLL.Services;

public class MistralAIService : IMistralAIService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _apiUrl;
    private readonly string _model;

    public MistralAIService(IConfiguration configuration)
    {
        _httpClient = new HttpClient();
        _apiKey = configuration["MISTRAL_API_KEY"] ?? throw new ArgumentNullException("MISTRAL_API_KEY");
        _apiUrl = configuration["MISTRAL_API_URL"] ?? "https://api.mistral.ai/v1/chat/completions";
        _model = configuration["MISTRAL_MODEL"] ?? "mistral-small-latest";
        
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    }

    public async Task<string> GeneratePostTextAsync(string dishName, string dishDescription)
    {
        var prompt = $"Напиши привлекательный пост для Instagram о блюде '{dishName}'. " +
                    $"Описание блюда: {dishDescription}. " +
                    "Пост должен быть коротким (2-3 предложения), привлекательным, использовать эмодзи и вызывать желание попробовать это блюдо.";

        var requestBody = new
        {
            model = _model,
            messages = new[]
            {
                new
                {
                    role = "user",
                    content = prompt
                }
            },
            temperature = 0.7,
            max_tokens = 200
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync(_apiUrl, content);
        response.EnsureSuccessStatusCode();

        var responseContent = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<JsonElement>(responseContent);

        if (result.TryGetProperty("choices", out var choices) && choices.GetArrayLength() > 0)
        {
            var message = choices[0].GetProperty("message");
            if (message.TryGetProperty("content", out var contentElement))
            {
                return contentElement.GetString() ?? string.Empty;
            }
        }

        throw new Exception("Failed to generate post text from Mistral AI");
    }
}

