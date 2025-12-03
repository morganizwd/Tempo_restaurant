using dotenv.net;
using Microsoft.AspNetCore.Http.Features;
using Newtonsoft.Json;
using Tempo_API.DI;
using Tempo_API.Mapper;
using Tempo_API.Middleware;
using Tempo_BLL.DI;
using Tempo_BLL.Mapper;
using Tempo_DAL.DI;
using Tempo_Shared.DI;

namespace Tempo_API;

static class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        DotEnv.Load(options: new DotEnvOptions(envFilePaths: new[] { @".env" }));

        builder.Configuration.AddEnvironmentVariables();

        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy.WithOrigins(builder.Configuration.GetValue<string>("USER_FRONT")!)
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .SetPreflightMaxAge(TimeSpan.FromSeconds(86400));
            });
        });

        builder.Services.AddControllers().AddNewtonsoftJson(
          options =>
          {
              options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
          });

        // Настройка для загрузки файлов
        builder.Services.Configure<FormOptions>(options =>
        {
            options.MultipartBodyLengthLimit = 10485760; // 10 MB
            options.ValueLengthLimit = int.MaxValue;
            options.MultipartHeadersLengthLimit = int.MaxValue;
        });

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        builder.RegisterApiDependencies();
        builder.Services.RegisterSharedDependencies();
        builder.Services.RegisterDALDependencies(builder.Configuration);
        builder.Services.RegisterBllDependencies();

        builder.Services.AddAutoMapper(typeof(BllMapperProfile).Assembly, typeof(ApiMapperProfile).Assembly);

        var app = builder.Build();

        app.UseMiddleware<ExeptionHandlerMiddleware>();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();

        app.UseCors(builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());

        // Поддержка статических файлов для постов и загруженных изображений
        app.UseStaticFiles();
        
        // Настройка для обслуживания статических файлов из wwwroot
        if (!Directory.Exists(Path.Combine(builder.Environment.ContentRootPath, "wwwroot")))
        {
            Directory.CreateDirectory(Path.Combine(builder.Environment.ContentRootPath, "wwwroot"));
        }

        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}