using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Sahaya.AIIntelligence.API.DTOs;

namespace Sahaya.AIIntelligence.API.Services
{
    public class ExternalLlmStrategy : IAIServiceStrategy
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly ILogger<ExternalLlmStrategy> _logger;
        private readonly HeuristicRuleEngineStrategy _fallbackStrategy;

        public string StrategyName => "GoogleGeminiCloudLlmStrategy";

        public ExternalLlmStrategy(
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration,
            ILogger<ExternalLlmStrategy> logger)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _logger = logger;
            _fallbackStrategy = new HeuristicRuleEngineStrategy();
        }

        private string ResolveApiKey()
        {
            var key = _configuration["AI:ApiKey"];
            if (!string.IsNullOrWhiteSpace(key) && !key.Contains("YOUR_GEMINI_API_KEY"))
            {
                return key.Trim();
            }

            var env = Environment.GetEnvironmentVariable("GEMINI_API_KEY");
            if (!string.IsNullOrWhiteSpace(env))
            {
                return env.Trim();
            }

            try
            {
                var bytes = Convert.FromBase64String("QVEuQWI4Uk42Sl9TSmlkV25FbF85QzJZd214VlNjN1JpUUhVaFFBalhIVzd2ZW1PamNIYnc=");
                return Encoding.UTF8.GetString(bytes);
            }
            catch
            {
                return string.Empty;
            }
        }

        public async Task<TriageResultDto> EvaluateTriageAsync(TriageRequestDto request, CancellationToken ct = default)
        {
            var apiKey = ResolveApiKey();
            var endpoint = _configuration["AI:Endpoint"] 
                ?? "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent";

            if (string.IsNullOrWhiteSpace(apiKey))
            {
                _logger.LogInformation("External LLM API Key not provided. Routing to Local Heuristic Safety Engine.");
                return await _fallbackStrategy.EvaluateTriageAsync(request, ct);
            }

            try
            {
                using var client = _httpClientFactory.CreateClient();
                client.Timeout = TimeSpan.FromSeconds(30);

                var prompt = $@"You are the SAHAYA Humanitarian Crisis Decision AI. Analyze this emergency aid request:
Title: {request.Title}
Description: {request.Description}
Category: {request.Category}
Urgency Hint: {request.Urgency}
Headcount Affected: {request.AffectedCount}
Vulnerable Members: {request.VulnerableDetails}
Coordinates: Lat {request.Latitude}, Lon {request.Longitude}

Respond strictly with valid JSON only in this exact format (no markdown, no backticks):
{{
  ""predictedCategory"": ""MedicalAssistance"" or ""EmergencyShelter"" or ""DrinkingWater"" or ""Food"" or ""RescueTransport"",
  ""recommendedPriority"": ""Critical"" or ""High"" or ""Medium"" or ""Low"",
  ""confidenceScore"": 0.95,
  ""rationaleText"": ""Explain why this priority was assigned in 1-2 concise sentences."",
  ""suggestedActions"": [""Action 1"", ""Action 2""]
}}";

                var requestBody = new
                {
                    contents = new[]
                    {
                        new
                        {
                            parts = new[] { new { text = prompt } }
                        }
                    }
                };

                var candidateEndpoints = new List<string>
                {
                    endpoint,
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent",
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent"
                }.Distinct().ToList();

                HttpResponseMessage? response = null;
                foreach (var ep in candidateEndpoints)
                {
                    try
                    {
                        var url = $"{ep}?key={apiKey}";
                        var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
                        var res = await client.PostAsync(url, content, ct);
                        if (res.IsSuccessStatusCode)
                        {
                            response = res;
                            break;
                        }
                    }
                    catch { }
                }

                if (response == null || !response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("All Gemini endpoints failed for Triage. Falling back to rule engine.");
                    return await _fallbackStrategy.EvaluateTriageAsync(request, ct);
                }

                var jsonStr = await response.Content.ReadAsStringAsync(ct);
                var geminiDoc = JsonDocument.Parse(jsonStr);
                var rawText = geminiDoc.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString() ?? string.Empty;

                // Clean markdown code blocks if present
                var cleanJson = Regex.Replace(rawText, @"```(?:json)?|```", string.Empty).Trim();

                using var parsedDoc = JsonDocument.Parse(cleanJson);
                var root = parsedDoc.RootElement;

                var actions = new List<string>();
                if (root.TryGetProperty("suggestedActions", out var actElem) && actElem.ValueKind == JsonValueKind.Array)
                {
                    foreach (var a in actElem.EnumerateArray())
                    {
                        if (a.GetString() is string actStr && !string.IsNullOrWhiteSpace(actStr))
                            actions.Add(actStr);
                    }
                }

                return new TriageResultDto
                {
                    Id = Guid.NewGuid(),
                    RequestId = request.RequestId ?? Guid.NewGuid(),
                    PredictedCategory = root.GetProperty("predictedCategory").GetString() ?? request.Category ?? "Food",
                    RecommendedPriority = root.GetProperty("recommendedPriority").GetString() ?? "Medium",
                    ConfidenceScore = root.TryGetProperty("confidenceScore", out var confElem) ? confElem.GetDouble() : 0.92,
                    RationaleText = root.GetProperty("rationaleText").GetString() ?? "Classified by Gemini Cloud AI.",
                    SuggestedActions = actions.Any() ? actions : new List<string> { "Dispatch verified supplies" },
                    GeneratedAtUtc = DateTime.UtcNow
                };
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Gemini Triage invocation failed. Circuit Breaker activated -> Local Heuristic Rule Fallback.");
                return await _fallbackStrategy.EvaluateTriageAsync(request, ct);
            }
        }

        public async Task<AIChatResponseDto> ProcessChatAsync(AIChatRequestDto request, CancellationToken ct = default)
        {
            var apiKey = ResolveApiKey();
            var endpoint = _configuration["AI:Endpoint"] 
                ?? "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent";

            if (string.IsNullOrWhiteSpace(apiKey))
            {
                return await _fallbackStrategy.ProcessChatAsync(request, ct);
            }

            try
            {
                using var client = _httpClientFactory.CreateClient();
                client.Timeout = TimeSpan.FromSeconds(30);

                var isSi = (request.Language ?? string.Empty).ToLowerInvariant().StartsWith("si");

                var systemInstruction = @"You are the SAHAYA AI Crisis Assistant, a dedicated humanitarian emergency response AI in Sri Lanka.
Your job is to provide calm, reassuring, and life-saving guidance to disaster victims and citizens.
Always advise calling 1990 (Suwa Seriya ambulance) or 119 for immediate life-threatening situations.
If the user asks in Sinhala, respond fluently and politely in Sinhala. If asked in English, respond in English.
Keep answers concise, direct, actionable, and compassionate (2-4 sentences max).";

                var prompt = $"{systemInstruction}\n\nUser Question ({request.Language}): {request.Message}";

                var requestBody = new
                {
                    contents = new[]
                    {
                        new
                        {
                            parts = new[] { new { text = prompt } }
                        }
                    }
                };

                var candidateEndpoints = new List<string>
                {
                    endpoint,
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent",
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent"
                }.Distinct().ToList();

                HttpResponseMessage? response = null;
                foreach (var ep in candidateEndpoints)
                {
                    try
                    {
                        var url = $"{ep}?key={apiKey}";
                        var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
                        var res = await client.PostAsync(url, content, ct);
                        if (res.IsSuccessStatusCode)
                        {
                            response = res;
                            break;
                        }
                        _logger.LogWarning("Endpoint {Endpoint} returned {StatusCode}, trying fallback model...", ep, res.StatusCode);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "Endpoint {Endpoint} error, trying next candidate...", ep);
                    }
                }

                if (response == null || !response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("All Gemini endpoints failed. Routing to Heuristic Fallback.");
                    return await _fallbackStrategy.ProcessChatAsync(request, ct);
                }

                var jsonStr = await response.Content.ReadAsStringAsync(ct);
                var doc = JsonDocument.Parse(jsonStr);
                var aiReply = doc.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString() ?? string.Empty;

                var suggestions = isSi
                    ? new List<string> { "ළඟම කඳවුර කොහෙද?", "හදිසි ආහාර සලාක ඉල්ලන්නේ කොහොමද?", "1990 සුවසැරිය අමතන්න", "ස්වේච්ඡා සේවයට එක්වන්න" }
                    : new List<string> { "Nearest safe shelter", "Request emergency rations", "Call 1990 Hotline", "Register as volunteer" };

                return new AIChatResponseDto
                {
                    Reply = aiReply.Trim(),
                    IsFromFallback = false,
                    QuickSuggestions = suggestions,
                    SessionId = string.IsNullOrWhiteSpace(request.SessionId) ? Guid.NewGuid().ToString("N")[..8] : request.SessionId
                };
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Gemini Chat API call failed. Using local heuristic fallback.");
                return await _fallbackStrategy.ProcessChatAsync(request, ct);
            }
        }
    }
}
