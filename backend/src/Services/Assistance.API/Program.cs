using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Sahaya.Assistance.API.Data;
using Sahaya.Assistance.API.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Database Connection (SQL Server)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Server=(localdb)\\mssqllocaldb;Database=SahayaAssistanceDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True";

builder.Services.AddDbContext<AssistanceDbContext>(options =>
    options.UseSqlServer(connectionString));

// 2. Dependency Injection for Services
builder.Services.AddScoped<IAssistanceService, AssistanceService>();
builder.Services.AddScoped<IHouseholdService, HouseholdService>();

// 3. JWT Authentication & Authorization
var jwtSecret = builder.Configuration["Jwt:Secret"] ?? "SAHAYA_NATIONAL_COMMAND_AUTHORITY_SUPER_SECRET_KEY_2026";
var key = Encoding.UTF8.GetBytes(jwtSecret);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "Sahaya.Identity",
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"] ?? "Sahaya.Platform",
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// 4. CORS Policy for React Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// 5. Swagger with Bearer Token Auth Input
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SAHAYA Citizen Assistance & Household SOS API",
        Version = "v1",
        Description = "Emergency SOS Request Wizard, Vulnerable Household Profiles, and Public Guest Distress Calls — Member 2"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using Bearer scheme. Enter 'Bearer' [space] and your token.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// 6. HTTP Pipeline
if (app.Environment.IsDevelopment())
{
    // Fix Swagger UI schema version compatibility with .NET 10 / Swashbuckle (replace 3.0.4 with 3.0.1 for Swagger UI regex)
    app.Use(async (context, next) =>
    {
        if (context.Request.Path.Value?.EndsWith("swagger.json", StringComparison.OrdinalIgnoreCase) == true)
        {
            var originalBody = context.Response.Body;
            using var memStream = new MemoryStream();
            context.Response.Body = memStream;

            await next();

            context.Response.Body = originalBody;
            memStream.Seek(0, SeekOrigin.Begin);
            var json = await new StreamReader(memStream).ReadToEndAsync();
            json = json.Replace("\"openapi\": \"3.0.4\"", "\"openapi\": \"3.0.1\"");
            context.Response.Headers.ContentLength = Encoding.UTF8.GetByteCount(json);
            await context.Response.WriteAsync(json);
            return;
        }

        await next();
    });

    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Sahaya Assistance API v1");
        c.RoutePrefix = string.Empty; // Swagger UI at http://localhost:5002/
    });
}

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Auto-create database schema and seed initial distress records
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AssistanceDbContext>();
    try
    {
        db.Database.EnsureCreated();
        await AssistanceDataSeeder.SeedAsync(db);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Assistance database initialization notice: {ex.Message}");
    }
}

app.Run();
