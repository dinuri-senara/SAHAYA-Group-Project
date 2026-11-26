using System;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Sahaya.Coordination.API.Data;

var builder = WebApplication.CreateBuilder(args);

// Explicitly bind to Port 5003 for Coordination API
builder.WebHost.UseUrls("http://localhost:5003");

// 1. Database Connection (SQL Server with automatic fallback/ensure)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Server=(localdb)\\mssqllocaldb;Database=SahayaCoordinationDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True";

builder.Services.AddDbContext<CoordinationDbContext>(options =>
    options.UseSqlServer(connectionString));

// 2. JWT Authentication (Single sign-on using Sahaya Identity Authority)
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

// 3. CORS Policy for React Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// 4. Swagger Documentation & Interactive OpenAPI Explorer
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SAHAYA Crisis Coordination & Incidents API",
        Version = "v1",
        Description = "National Disaster Registry, Emergency Triage Pipeline & Operational KPIs — Member 3 Domain"
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

// 5. HTTP Pipeline - Always enable Swagger UI
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Sahaya Coordination API v1");
    c.RoutePrefix = string.Empty; // Swagger at root (http://localhost:5003/)
});

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// 6. Auto-create database schema and seed initial data on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<CoordinationDbContext>();
    try
    {
        db.Database.EnsureCreated();
        Console.WriteLine("[Sahaya.Coordination.API] Database schema verified and seeded successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[Sahaya.Coordination.API] Database initialization notice: {ex.Message}");
    }
}

app.Run();
