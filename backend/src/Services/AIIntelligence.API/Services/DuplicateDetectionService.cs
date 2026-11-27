using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Sahaya.AIIntelligence.API.Data;
using Sahaya.AIIntelligence.API.DTOs;
using Sahaya.AIIntelligence.API.Models;

namespace Sahaya.AIIntelligence.API.Services
{
    public interface IDuplicateDetectionService
    {
        Task<DuplicateCheckResultDto> DetectDuplicatesAsync(DuplicateCheckRequestDto request, CancellationToken ct = default);
        double CalculateHaversineDistanceMeters(double lat1, double lon1, double lat2, double lon2);
        double CalculateLevenshteinSimilarity(string s1, string s2);
    }

    public class DuplicateDetectionService : IDuplicateDetectionService
    {
        private readonly AIIntelligenceDbContext _context;

        public DuplicateDetectionService(AIIntelligenceDbContext context)
        {
            _context = context;
        }

        public async Task<DuplicateCheckResultDto> DetectDuplicatesAsync(DuplicateCheckRequestDto request, CancellationToken ct = default)
        {
            var result = new DuplicateCheckResultDto();

            // Retrieve existing recommendations
            var existing = await _context.AIRecommendations
                .OrderByDescending(r => r.GeneratedAtUtc)
                .Take(50)
                .ToListAsync(ct);

            foreach (var item in existing)
            {
                if (request.RequestId.HasValue && item.RequestId == request.RequestId.Value)
                    continue;

                // 1. Text Similarity using Levenshtein distance
                var textSimilarity = CalculateLevenshteinSimilarity(request.Description, item.RationaleText);

                // 2. Haversine distance simulation (using sample request coords or defaults)
                // Default test latitude/longitude if not specified
                var lat2 = 6.9271; // Colombo/Kelaniya baseline
                var lon2 = 79.8612;
                var distMeters = CalculateHaversineDistanceMeters(request.Latitude, request.Longitude, lat2, lon2);

                bool isGeoMatch = distMeters <= request.ThresholdDistanceMeters;
                bool isTextMatch = textSimilarity >= request.ThresholdSimilarity;

                if (isGeoMatch || isTextMatch)
                {
                    var matchDto = new DuplicateMatchDetailDto
                    {
                        ExistingRequestId = item.RequestId,
                        ExistingTitle = $"Previous Request ({item.PredictedCategory})",
                        DistanceMeters = Math.Round(distMeters, 1),
                        SimilarityScore = Math.Round(textSimilarity, 3),
                        Rationale = isGeoMatch && isTextMatch
                            ? $"High probability duplicate: Location within {distMeters:F0}m and text similarity {textSimilarity * 100:F1}%."
                            : isGeoMatch
                                ? $"Geographic cluster duplicate: Same distress zone within {distMeters:F0}m."
                                : $"Content match duplicate: Description similarity is {textSimilarity * 100:F1}%."
                    };

                    result.Matches.Add(matchDto);

                    // Persist record into DuplicateMatches table
                    if (request.RequestId.HasValue)
                    {
                        _context.DuplicateMatches.Add(new DuplicateMatch
                        {
                            Id = Guid.NewGuid(),
                            PrimaryRequestId = item.RequestId,
                            DuplicateRequestId = request.RequestId.Value,
                            SimilarityScore = textSimilarity,
                            Reason = matchDto.Rationale,
                            MatchedAtUtc = DateTime.UtcNow
                        });
                    }
                }
            }

            if (result.Matches.Any())
            {
                result.IsDuplicate = true;
                result.MatchCount = result.Matches.Count;
                await _context.SaveChangesAsync(ct);
            }

            return result;
        }

        public double CalculateHaversineDistanceMeters(double lat1, double lon1, double lat2, double lon2)
        {
            const double EarthRadiusMeters = 6371000; // Earth's mean radius in meters

            double dLat = ToRadians(lat2 - lat1);
            double dLon = ToRadians(lon2 - lon1);

            double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                       Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                       Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

            return EarthRadiusMeters * c;
        }

        public double CalculateLevenshteinSimilarity(string s1, string s2)
        {
            if (string.IsNullOrWhiteSpace(s1) && string.IsNullOrWhiteSpace(s2)) return 1.0;
            if (string.IsNullOrWhiteSpace(s1) || string.IsNullOrWhiteSpace(s2)) return 0.0;

            s1 = s1.Trim().ToLowerInvariant();
            s2 = s2.Trim().ToLowerInvariant();

            int n = s1.Length;
            int m = s2.Length;

            int[,] d = new int[n + 1, m + 1];

            for (int i = 0; i <= n; i++) d[i, 0] = i;
            for (int j = 0; j <= m; j++) d[0, j] = j;

            for (int i = 1; i <= n; i++)
            {
                for (int j = 1; j <= m; j++)
                {
                    int cost = (s2[j - 1] == s1[i - 1]) ? 0 : 1;
                    d[i, j] = Math.Min(
                        Math.Min(d[i - 1, j] + 1, d[i, j - 1] + 1),
                        d[i - 1, j - 1] + cost);
                }
            }

            int distance = d[n, m];
            int maxLength = Math.Max(n, m);
            return 1.0 - ((double)distance / maxLength);
        }

        private static double ToRadians(double degrees) => degrees * (Math.PI / 180.0);
    }
}
