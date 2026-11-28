var builder = WebApplication.CreateBuilder(args);

// 1. Add YARP Reverse Proxy
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

// 2. STRIDE Denial of Service (DoS) Mitigation: Token Bucket Rate Limiter
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    
    options.AddPolicy("PublicApiLimiter", httpContext =>
        System.Threading.RateLimiting.RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
            factory: partition => new System.Threading.RateLimiting.FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 60,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 5
            }));
});

// 3. Add CORS for Frontend Client
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

var app = builder.Build();

// STRIDE Information Disclosure Mitigation: Security Headers
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-Frame-Options", "DENY");
    context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
    context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
    await next();
});

app.UseCors("AllowFrontend");
app.UseRateLimiter();

app.MapGet("/", () => Results.Ok(new
{
    service = "SAHAYA National Command API Gateway",
    status = "Online",
    version = "1.0.0",
    security = "STRIDE Hardened",
    docs = "http://localhost:5001/swagger"
}));

// In-Memory Real-time Broadcast Notifications Hub on Gateway
var notifications = new List<object>
{
    new {
        id = "notif-system-online",
        title = "National Disaster Grid Connected",
        message = "All SAHAYA microservices wired to Neon Serverless Cloud Postgres.",
        type = "SystemUpdate",
        isRead = false,
        createdAt = DateTime.UtcNow
    }
};

app.MapGet("/api/v1/notifications", () => Results.Ok(notifications));
app.MapPost("/api/v1/notifications/{id}/read", (string id) => Results.Ok());
app.MapPost("/api/v1/notifications/read-all", () => Results.Ok());
app.MapDelete("/api/v1/notifications/{id}", (string id) => Results.Ok());
app.MapDelete("/api/v1/notifications", () => Results.Ok());
app.MapPost("/api/v1/notifications/broadcast", (object payload) => {
    notifications.Insert(0, payload);
    return Results.Ok();
});

app.MapReverseProxy();

app.Run();
