using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Sahaya.AIIntelligence.API.Data;
using Sahaya.AIIntelligence.API.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Database Connection (SQL Server with In-Memory dev fallback)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Server=(localdb)\\mssqllocaldb;Database=SahayaAIDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True";

var useInMemory = builder.Configuration.GetValue<bool>("UseInMemoryDatabase", false);

if (useInMemory)
{
    builder.Services.AddDbContext<AIIntelligenceDbContext>(options =>
        options.UseInMemoryDatabase("SahayaAIDb"));
}
else
{
    builder.Services.AddDbContext<AIIntelligenceDbContext>(options =>
    {
        try
        {
            options.UseSqlServer(connectionString);
        }
        catch
        {
            options.UseInMemoryDatabase("SahayaAIDb");
        }
    });
}

// 2. Dependency Injection
builder.Services.AddHttpClient();
builder.Services.AddScoped<IAIServiceStrategy, ExternalLlmStrategy>();
builder.Services.AddScoped<IDuplicateDetectionService, DuplicateDetectionService>();
builder.Services.AddScoped<IAIService, AIService>();

// 3. CORS Policy for React Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// 4. Swagger OpenAPI Documentation
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SAHAYA AI Decision Engine & Governance API",
        Version = "v1",
        Description = "Automated Triage, NLP Confidence Scoring, Duplicate SOS Detection & Human Override Audits — Member 5"
    });
});

var app = builder.Build();

// 5. HTTP Pipeline
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Sahaya AI Intelligence API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowFrontend");

app.MapControllers();

// Auto-seed initial data
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AIIntelligenceDbContext>();
    try
    {
        if (!useInMemory && db.Database.IsRelational())
        {
            db.Database.EnsureCreated();
        }
    }
    catch
    {
        // Fallback for non-relational or offline localdb
    }
    db.SeedInitialData();
}

app.Run();
