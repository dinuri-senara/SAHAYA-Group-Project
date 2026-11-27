using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Sahaya.Operations.API.Data;
using Sahaya.Operations.API.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Database Connection (SQL Server)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Server=(localdb)\\mssqllocaldb;Database=SahayaOperationsDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True";

builder.Services.AddDbContext<OperationsDbContext>(options =>
    options.UseSqlServer(connectionString));

// 2. Dependency Injection for Services
builder.Services.AddScoped<IVolunteerService, VolunteerService>();
builder.Services.AddScoped<IDonationService, DonationService>();

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

// 5. Swagger with Bearer Token Auth
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SAHAYA Operations API — Volunteers, GIS & Donations",
        Version = "v1",
        Description = "Volunteer Rosters, Mission Dispatch, OpenStreetMap GIS Overlays & Humanitarian Donations — Member 6"
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
    // Fix Swagger UI schema version compatibility with .NET 10 / Swashbuckle
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
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Sahaya Operations API v1");
        c.RoutePrefix = string.Empty; // Swagger UI at http://localhost:5006/
    });
}

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Auto-create database schema and seed initial volunteer & donation records
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<OperationsDbContext>();
    try
    {
        db.Database.EnsureCreated();
        await OperationsDataSeeder.SeedAsync(db);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Operations database initialization notice: {ex.Message}");
    }
}

app.Run();
