using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Sahaya.AIIntelligence.API.Data;
using Sahaya.AIIntelligence.API.DTOs;
using Sahaya.AIIntelligence.API.Models;

namespace Sahaya.AIIntelligence.API.Services
{
    public interface IAIService
    {
        Task<TriageResultDto> TriageRequestAsync(TriageRequestDto request, CancellationToken ct = default);
        Task<HumanOverrideResultDto> RecordHumanOverrideAsync(HumanOverrideRequestDto request, CancellationToken ct = default);
        Task<AIChatResponseDto> ProcessChatAsync(AIChatRequestDto request, CancellationToken ct = default);
        Task<List<AIRecommendation>> GetRecommendationsAsync(CancellationToken ct = default);
        Task<AIRecommendation?> GetRecommendationByRequestIdAsync(Guid requestId, CancellationToken ct = default);
        Task<List<HumanOverrideAudit>> GetAuditLogsAsync(CancellationToken ct = default);
    }

    public class AIService : IAIService
    {
        private readonly AIIntelligenceDbContext _context;
        private readonly IAIServiceStrategy _strategy;
        private readonly ILogger<AIService> _logger;

        public AIService(
            AIIntelligenceDbContext context,
            IAIServiceStrategy strategy,
            ILogger<AIService> logger)
        {
            _context = context;
            _strategy = strategy;
            _logger = logger;
        }

        public async Task<TriageResultDto> TriageRequestAsync(TriageRequestDto request, CancellationToken ct = default)
        {
            var evaluation = await _strategy.EvaluateTriageAsync(request, ct);

            // Persist the recommendation
            var entity = new AIRecommendation
            {
                Id = evaluation.Id,
                RequestId = evaluation.RequestId,
                PredictedCategory = evaluation.PredictedCategory,
                RecommendedPriority = evaluation.RecommendedPriority,
                ConfidenceScore = evaluation.ConfidenceScore,
                RationaleText = evaluation.RationaleText,
                GeneratedAtUtc = evaluation.GeneratedAtUtc,
                ReviewStatus = "Pending"
            };

            _context.AIRecommendations.Add(entity);
            await _context.SaveChangesAsync(ct);

            _logger.LogInformation("AI Triage generated for Request {RequestId}: Priority={Priority}, Confidence={Confidence:P1}",
                entity.RequestId, entity.RecommendedPriority, entity.ConfidenceScore);

            return evaluation;
        }

        public async Task<HumanOverrideResultDto> RecordHumanOverrideAsync(HumanOverrideRequestDto request, CancellationToken ct = default)
        {
            // 1. Fetch matching recommendation if exists
            var existingRec = await _context.AIRecommendations
                .FirstOrDefaultAsync(r => r.RequestId == request.RequestId, ct);

            string originalJson = request.OriginalRecommendationJson ?? string.Empty;
            if (existingRec != null)
            {
                existingRec.ReviewStatus = request.HumanAction;
                if (string.IsNullOrWhiteSpace(originalJson))
                {
                    originalJson = JsonSerializer.Serialize(new
                    {
                        existingRec.RecommendedPriority,
                        existingRec.ConfidenceScore,
                        existingRec.PredictedCategory,
                        existingRec.RationaleText
                    });
                }
            }

            // 2. Non-repudiation audit logging
            var audit = new HumanOverrideAudit
            {
                Id = Guid.NewGuid(),
                RequestId = request.RequestId,
                CoordinatorUserId = request.CoordinatorUserId,
                OriginalRecommendationJson = originalJson,
                HumanAction = request.HumanAction,
                ModifiedPriority = request.ModifiedPriority,
                Justification = request.Justification,
                TimestampUtc = DateTime.UtcNow
            };

            _context.HumanOverrideAudits.Add(audit);
            await _context.SaveChangesAsync(ct);

            _logger.LogInformation("Human Governance Audit recorded: Request {RequestId} action {Action} by Coordinator {UserId}",
                audit.RequestId, audit.HumanAction, audit.CoordinatorUserId);

            return new HumanOverrideResultDto
            {
                Success = true,
                AuditId = audit.Id,
                Message = $"Governance decision '{request.HumanAction}' successfully registered in immutable audit ledger.",
                RecordedAtUtc = audit.TimestampUtc
            };
        }

        public async Task<AIChatResponseDto> ProcessChatAsync(AIChatRequestDto request, CancellationToken ct = default)
        {
            var response = await _strategy.ProcessChatAsync(request, ct);

            // Persist conversation telemetry
            _context.AIChatSessions.Add(new AIChatSession
            {
                Id = Guid.NewGuid(),
                SessionId = response.SessionId,
                UserQuery = request.Message,
                AIResponse = response.Reply,
                IsFallback = response.IsFromFallback,
                Language = request.Language,
                TimestampUtc = DateTime.UtcNow
            });

            await _context.SaveChangesAsync(ct);

            return response;
        }

        public async Task<List<AIRecommendation>> GetRecommendationsAsync(CancellationToken ct = default)
        {
            return await _context.AIRecommendations
                .OrderByDescending(r => r.GeneratedAtUtc)
                .Take(100)
                .ToListAsync(ct);
        }

        public async Task<AIRecommendation?> GetRecommendationByRequestIdAsync(Guid requestId, CancellationToken ct = default)
        {
            return await _context.AIRecommendations
                .FirstOrDefaultAsync(r => r.RequestId == requestId, ct);
        }

        public async Task<List<HumanOverrideAudit>> GetAuditLogsAsync(CancellationToken ct = default)
        {
            return await _context.HumanOverrideAudits
                .OrderByDescending(a => a.TimestampUtc)
                .Take(100)
                .ToListAsync(ct);
        }
    }
}
