using System.Threading;
using System.Threading.Tasks;
using Sahaya.AIIntelligence.API.DTOs;

namespace Sahaya.AIIntelligence.API.Services
{
    public interface IAIServiceStrategy
    {
        string StrategyName { get; }
        Task<TriageResultDto> EvaluateTriageAsync(TriageRequestDto request, CancellationToken ct = default);
        Task<AIChatResponseDto> ProcessChatAsync(AIChatRequestDto request, CancellationToken ct = default);
    }
}
