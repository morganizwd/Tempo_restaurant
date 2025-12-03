# Tempo Restaurant - Инструкция по запуску

Этот проект состоит из бекенда на .NET 8.0 и двух фронтенд-приложений на React/TypeScript.

## Требования

### Для бекенда:
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [PostgreSQL](https://www.postgresql.org/download/) (база данных)
- [Entity Framework Core Tools](https://docs.microsoft.com/en-us/ef/core/cli/dotnet) (для миграций)

### Для фронтенда:
- [Node.js](https://nodejs.org/) (версия 16 или выше)
- [npm](https://www.npmjs.com/) (обычно устанавливается вместе с Node.js)

## Настройка проекта

### 1. Настройка базы данных PostgreSQL

1. Установите PostgreSQL, если еще не установлен
2. Создайте базу данных:
   ```sql
   CREATE DATABASE tempo_restaurant;
   ```

### 2. Настройка бекенда

1. Перейдите в папку бекенда:
   ```bash
   cd Back-end/Tempo_API/Tempo_API
   ```

2. Создайте файл `.env` в папке `Tempo_API` со следующим содержимым:
   ```
   DB_CONNECTION=Host=localhost;Port=5432;Database=tempo_restaurant;Username=your_username;Password=your_password
   USER_FRONT=http://localhost:8081
   ```
   
   **Примечание:** Используется HTTP для упрощения разработки. Для продакшена рекомендуется HTTPS.
   
   Замените `your_username` и `your_password` на ваши учетные данные PostgreSQL.

3. Восстановите NuGet пакеты:
   ```bash
   cd Back-end/Tempo_API
   dotnet restore
   ```

4. Установите правильную версию Entity Framework Core tools (совместимую с .NET 8.0):
   ```bash
   dotnet tool uninstall --global dotnet-ef
   dotnet tool install --global dotnet-ef --version 8.0.0
   ```
   
   **Примечание:** Если у вас уже установлена версия 10.0.0 или выше, она может быть несовместима с проектом на .NET 8.0.

5. Примените миграции базы данных (убедитесь, что вы находитесь в папке `Tempo_API`):
   ```bash
   cd Tempo_API
   dotnet ef database update --project ../Tempo_DAL/Tempo_DAL.csproj --startup-project .
   ```
   
   **Важно:** Обратите внимание на точку (`.`) в конце команды после `--startup-project` - она указывает на текущую директорию.

### 3. Настройка фронтенда

#### Для приложения tempo_guests (гости):

1. Перейдите в папку:
   ```bash
   cd Front-end/tempo_guests
   ```

2. Установите зависимости:
   ```bash
   npm install
   ```

3. Создайте файл `.env` в папке `tempo_guests`:
   ```
   API_URL=http://localhost:5126/api
   ```

   **Примечание:** По умолчанию проект настроен на использование HTTP для упрощения разработки. Это не требует SSL сертификатов. Если вам нужен HTTPS, см. раздел "Решение проблем" ниже.

#### Для приложения tempo_workers (работники):

1. Перейдите в папку:
   ```bash
   cd Front-end/tempo_workers
   ```

2. Установите зависимости:
   ```bash
   npm install
   ```

3. Создайте файл `.env` в папке `tempo_workers`:
   ```
   API_URL=http://localhost:5126/api
   ```

## Запуск проекта

### Запуск бекенда

1. Откройте терминал в папке `Back-end/Tempo_API/Tempo_API`

2. Запустите проект:
   ```bash
   dotnet run
   ```
   
   Или используйте профиль из launchSettings.json:
   ```bash
   dotnet run --launch-profile https
   ```

3. Бекенд будет доступен по адресам:
   - HTTP: http://localhost:5126
   - HTTPS: https://localhost:7027
   - Swagger UI: https://localhost:7027/swagger

### Запуск фронтенда

**Важно:** Оба приложения используют один и тот же порт (8081), поэтому их нужно запускать **по очереди**, а не одновременно.

#### Для запуска tempo_guests (гости):
```bash
cd Front-end/tempo_guests
npm start
```
Приложение будет доступно по адресу: **http://localhost:8081**

#### Для запуска tempo_workers (работники):
```bash
cd Front-end/tempo_workers
npm start
```
Приложение будет доступно по адресу: **http://localhost:8081**

**Примечание:** Остановите одно приложение перед запуском другого, так как они используют один порт.

## Структура проекта

```
Tempo_restaurant/
├── Back-end/
│   └── Tempo_API/
│       ├── Tempo_API/          # API слой
│       ├── Tempo_BLL/          # Бизнес-логика
│       ├── Tempo_DAL/          # Доступ к данным
│       └── Tempo_Shared/       # Общие компоненты
└── Front-end/
    ├── tempo_guests/           # Приложение для гостей
    └── tempo_workers/          # Приложение для работников
```

## Решение проблем

### Проблемы с подключением к базе данных
- Убедитесь, что PostgreSQL запущен
- Проверьте правильность строки подключения в `.env`
- Убедитесь, что база данных создана

### Проблемы с миграциями базы данных
- Если получаете ошибку `Assets file 'project.assets.json' not found`, выполните `dotnet restore` в папке `Back-end/Tempo_API`
- Если получаете ошибку `System.IO.FileNotFoundException: Could not load file or assembly 'System.Runtime, Version=10.0.0.0'`, установите правильную версию EF Core tools:
  ```bash
  dotnet tool uninstall --global dotnet-ef
  dotnet tool install --global dotnet-ef --version 8.0.0
  ```
- Убедитесь, что используете точку (`.`) в конце команды: `--startup-project .`

### Использование HTTPS вместо HTTP

**По умолчанию проект использует HTTP для упрощения разработки.** Если вам нужен HTTPS:

1. Сгенерируйте SSL сертификаты (см. скрипт `generate-cert.ps1` или используйте OpenSSL)
2. Откройте `webpack.config.js` в папке фронтенд-приложения и измените:

1. Откройте `webpack.config.js` в папке фронтенд-приложения
2. Найдите секцию `devServer` и измените:
   ```javascript
   // Измените с:
   server: {
     type: "http",
   },
   
   // На:
   server: {
     type: "https",
     options: {
       key: "./certs/cert.key",
       cert: "./certs/cert.crt",
     },
   },
   ```
3. Также измените `API_URL` в `.env` файле на HTTPS:
   ```
   API_URL=https://localhost:7027/api
   ```
4. И в бекенде измените `USER_FRONT` в `.env`:
   ```
   USER_FRONT=https://localhost:8081
   ```

**Примечание:** Для продакшена обязательно используйте HTTPS!

### Проблемы с портами
- Если порты заняты, измените их в `launchSettings.json` (бекенд) или `webpack.config.js` (фронтенд)

### Проблемы с CORS
- Убедитесь, что `USER_FRONT` в `.env` бекенда соответствует URL фронтенд-приложения

## Дополнительная информация

- Swagger документация доступна по адресу `/swagger` при запуске бекенда в режиме разработки
- Миграции базы данных находятся в `Back-end/Tempo_API/Tempo_DAL/Migrations/`
- Для создания новых миграций используйте: `dotnet ef migrations add MigrationName --project ../Tempo_DAL/Tempo_DAL.csproj --startup-project .`

## Функциональность создания постов для Instagram

Проект включает функциональность создания постов для Instagram с использованием AI:
- **Mistral AI** для генерации текста постов (на сервере)
- **Puter.js** для генерации изображений блюд (бесплатно, без API ключей, работает на клиенте)
- Возможность загрузки собственных изображений
- Сохранение постов в формате JSON
- Поддержка множества моделей генерации: DALL-E 3, GPT Image, Gemini, Flux, Stable Diffusion и др.

Подробная инструкция по настройке: `Back-end/Tempo_API/SETUP_POSTS.md`

