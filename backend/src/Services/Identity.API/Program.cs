using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Sahaya.Common.Enums;
using Sahaya.Identity.API.Data;
using Sahaya.Identity.API.Models;
using Sahaya.Identity.API.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Database Connection (SQL Server)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Server=(localdb)\\mssqllocaldb;Database=SahayaIdentityDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True";

builder.Services.AddDbContext<IdentityDbContext>(options =>
    options.UseSqlServer(connectionString));

// 2. Dependency Injection
builder.Services.AddScoped<ITokenService, TokenService>();

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
        Title = "SAHAYA Identity & National Governance API",
        Version = "v1",
        Description = "Enterprise RBAC Authentication & Telemetry Service — Member 1 Lead Architecture"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and your token.",
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
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Sahaya Identity API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Auto-migrate database schema & seed initial active users with verified BCrypt hash
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<IdentityDbContext>();
    try
    {
        db.Database.EnsureCreated();

        // 1. Admin user
        var admin = db.Users.FirstOrDefault(u => u.Email == "admin@sahaya.org");
        if (admin == null)
        {
            db.Users.Add(new User
            {
                Id = Guid.NewGuid(),
                Email = "admin@sahaya.org",
                FullName = "National Operational Commander",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                PhoneNumber = "+94 11 267 0001",
                Role = UserRole.Admin,
                IsActive = true,
                CreatedAtUtc = DateTime.UtcNow
            });
        }
        else
        {
            admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123");
            admin.IsActive = true;
        }

        // 2. Coordinator user
        var coord = db.Users.FirstOrDefault(u => u.Email == "coordinator@sahaya.org");
        if (coord == null)
        {
            db.Users.Add(new User
            {
                Id = Guid.NewGuid(),
                Email = "coordinator@sahaya.org",
                FullName = "Western Province Coordinator",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                PhoneNumber = "+94 11 267 0002",
                Role = UserRole.Coordinator,
                IsActive = true,
                CreatedAtUtc = DateTime.UtcNow
            });
        }
        else
        {
            coord.PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123");
            coord.IsActive = true;
        }

        // 3. Citizen user
        var citizen = db.Users.FirstOrDefault(u => u.Email == "citizen@sahaya.org");
        if (citizen == null)
        {
            db.Users.Add(new User
            {
                Id = Guid.NewGuid(),
                Email = "citizen@sahaya.org",
                FullName = "Anura Bandara (Citizen)",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                PhoneNumber = "+94 77 123 4567",
                Role = UserRole.Citizen,
                IsActive = true,
                CreatedAtUtc = DateTime.UtcNow
            });
        }
        else
        {
            citizen.PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123");
            citizen.IsActive = true;
        }

        db.SaveChanges();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database initialization notice: {ex.Message}");
    }
}

app.Run();
