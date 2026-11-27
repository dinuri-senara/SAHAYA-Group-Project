using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Sahaya.AIIntelligence.API.DTOs;
using Sahaya.AIIntelligence.API.Models;
using Sahaya.AIIntelligence.API.Services;

namespace Sahaya.AIIntelligence.API.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class AIController : ControllerBase
    {
        private readonly IAIService _aiService;
        private readonly IDuplicateDetectionService _duplicateService;

        public AIController(IAIService aiService, IDuplicateDetectionService duplicateService)
        {
            _aiService = aiService;
            _duplicateService = duplicateService;
        }

        /// <summary>
        /// 1. POST /api/v1/ai/triage
        /// Automated triage classification and explainable confidence scoring.
        /// </summary>
        [HttpPost("triage")]
        public async Task<ActionResult<TriageResultDto>> TriageRequest([FromBody] TriageRequestDto dto, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(dto.Description) && string.IsNullOrWhiteSpace(dto.Title))
            {
                return BadRequest(new { message = "Request Title and Description are required for AI analysis." });
            }

            var result = await _aiService.TriageRequestAsync(dto, ct);
            return Ok(result);
        }

        /// <summary>
        /// 2. POST /api/v1/ai/duplicates/detect
        /// High-speed duplicate SOS detection via Haversine GPS distance (< 200m) and Levenshtein similarity.
        /// </summary>
        [HttpPost("duplicates/detect")]
        public async Task<ActionResult<DuplicateCheckResultDto>> DetectDuplicates([FromBody] DuplicateCheckRequestDto dto, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(dto.Description))
            {
                return BadRequest(new { message = "Description is required for text similarity matching." });
            }

            var result = await _duplicateService.DetectDuplicatesAsync(dto, ct);
            return Ok(result);
        }

        /// <summary>
        /// 3. POST /api/v1/ai/override
        /// Mandatory Human-in-the-Loop Governance: Accept, Override, or Reject AI advice with non-repudiation audit logging.
        /// </summary>
        [HttpPost("override")]
        public async Task<ActionResult<HumanOverrideResultDto>> RecordHumanOverride([FromBody] HumanOverrideRequestDto dto, CancellationToken ct)
        {
            if (dto.RequestId == Guid.Empty || dto.CoordinatorUserId == Guid.Empty)
            {
                return BadRequest(new { message = "RequestId and CoordinatorUserId are mandatory for governance compliance." });
            }

            if (string.IsNullOrWhiteSpace(dto.Justification))
            {
                return BadRequest(new { message = "Justification must be stated for all human override actions." });
            }

            var result = await _aiService.RecordHumanOverrideAsync(dto, ct);
            return Ok(result);
        }

        /// <summary>
        /// 4. POST /api/v1/ai/chat
        /// Real-time conversational AI crisis assistant supporting Sinhala and English.
        /// </summary>
        [HttpPost("chat")]
        public async Task<ActionResult<AIChatResponseDto>> ProcessChat([FromBody] AIChatRequestDto dto, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(dto.Message))
            {
                return BadRequest(new { message = "Message query cannot be empty." });
            }

            var result = await _aiService.ProcessChatAsync(dto, ct);
            return Ok(result);
        }

        /// <summary>
        /// GET /api/v1/ai/recommendations
        /// Retrieves all generated AI triage recommendations.
        /// </summary>
        [HttpGet("recommendations")]
        public async Task<ActionResult<List<AIRecommendation>>> GetRecommendations(CancellationToken ct)
        {
            var list = await _aiService.GetRecommendationsAsync(ct);
            return Ok(list);
        }

        /// <summary>
        /// GET /api/v1/ai/recommendations/{requestId}
        /// Retrieves the AI recommendation for a specific assistance request.
        /// </summary>
        [HttpGet("recommendations/{requestId:guid}")]
        public async Task<ActionResult<AIRecommendation>> GetRecommendationByRequestId(Guid requestId, CancellationToken ct)
        {
            var rec = await _aiService.GetRecommendationByRequestIdAsync(requestId, ct);
            if (rec == null)
            {
                return NotFound(new { message = $"No AI recommendation found for request id: {requestId}" });
            }
            return Ok(rec);
        }

        /// <summary>
        /// GET /api/v1/ai/audits
        /// Immutable audit ledger for coordinator actions on AI recommendations.
        /// </summary>
        [HttpGet("audits")]
        public async Task<ActionResult<List<HumanOverrideAudit>>> GetAuditLogs(CancellationToken ct)
        {
            var audits = await _aiService.GetAuditLogsAsync(ct);
            return Ok(audits);
        }
    }
}
