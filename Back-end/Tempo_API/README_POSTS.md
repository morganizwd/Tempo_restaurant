# Функциональность создания постов для Instagram

Эта функциональность позволяет создавать посты для Instagram с использованием AI для генерации текста и изображений.

## Настройка

### 1. Добавьте API ключи в `.env` файл

Добавьте следующие переменные в файл `Back-end/Tempo_API/Tempo_API/.env`:

```env
# Mistral AI настройки
MISTRAL_API_KEY=AwBdCR0tAxsXZBzfQtRtViHzJcSK63dO
MISTRAL_API_URL=https://api.mistral.ai/v1/chat/completions
MISTRAL_MODEL=mistral-small-latest

# DeepAI настройки
DEEPAI_API_KEY=your_deepai_api_key_here
```

**Примечание:** Получите бесплатный API ключ DeepAI на https://deepai.org/

### 2. Структура папок

Приложение автоматически создаст следующие папки:
- `wwwroot/posts/` - для хранения JSON файлов с постами
- `wwwroot/uploads/posts/` - для загруженных пользователем изображений

## API Endpoints

### POST /api/Post
Создает новый пост для Instagram.

**Параметры:**
- `DishId` (Guid) - ID блюда из базы данных
- `ImageUrl` (string, опционально) - URL изображения (сгенерированного через Puter.js на клиенте или загруженного)
- `imageFile` (IFormFile, опционально) - файл изображения для загрузки

**Пример запроса:**
```json
{
  "dishId": "1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a",
  "imageUrl": "data:image/png;base64,..."
}
```

**Примечание:** Изображения генерируются на клиенте через Puter.js перед отправкой запроса на сервер.

**Ответ:**
```json
{
  "id": "guid",
  "dishName": "Борщ",
  "text": "Сгенерированный текст поста...",
  "imageUrl": "https://...",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### GET /api/Post
Получает все созданные посты.

### GET /api/Post/{id}
Получает пост по ID.

### DELETE /api/Post/{id}
Удаляет пост.

## Как это работает

1. **Генерация текста**: Используется Mistral AI для создания привлекательного текста поста на основе названия блюда (на сервере)
2. **Генерация изображения**: 
   - Если выбрана генерация через AI - изображение генерируется на клиенте через Puter.js (бесплатно, без API ключей)
   - Если загружено пользовательское изображение - используется оно
   - Иначе используется фото из базы данных
3. **Сохранение**: Пост сохраняется как JSON файл в папке `wwwroot/posts/`

**Преимущества Puter.js:**
- ✅ Бесплатно и без ограничений
- ✅ Не требует API ключей
- ✅ Работает прямо в браузере
- ✅ Множество моделей на выбор (DALL-E 3, GPT Image, Gemini, Flux, Stable Diffusion и др.)

## Использование на фронтенде

Создайте компонент для создания постов в приложении для персонала (`tempo_workers`):

1. Добавьте новую вкладку "AI Посты" в навигацию
2. Создайте форму для выбора блюда
3. Добавьте возможность загрузки изображения
4. Отправьте запрос на `/api/Post`
5. Отобразите созданные посты в списке

## Пример использования

```typescript
// Генерация изображения через Puter.js
const generateImage = async (dishName: string, model: string = 'dall-e-3'): Promise<string> => {
  const prompt = `Beautiful professional food photography of ${dishName}, appetizing, high quality, restaurant style`;
  const imgElement = await puter.ai.txt2img(prompt, { 
    model: model,
    quality: model === 'dall-e-3' ? 'hd' : undefined 
  });
  return imgElement.src; // Возвращает data URL или URL изображения
};

// Создание поста
const createPost = async (dishId: string, imageUrl?: string, imageFile?: File) => {
  if (imageFile) {
    // Загрузка файла через FormData
    const formData = new FormData();
    formData.append('dishId', dishId);
    formData.append('imageFile', imageFile);
    
    const response = await fetch('http://localhost:5126/api/Post', {
      method: 'POST',
      body: formData
    });
    return await response.json();
  } else {
    // Отправка JSON с imageUrl
    const response = await fetch('http://localhost:5126/api/Post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dishId, imageUrl })
    });
    return await response.json();
  }
};
```

