using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Sahaya.Assistance.API.Data;
using Sahaya.Assistance.API.DTOs;
using Sahaya.Assistance.API.Models;
using Sahaya.Common.Models;

namespace Sahaya.Assistance.API.Services
{
    public class AssistanceService : IAssistanceService
    {
        private readonly AssistanceDbContext _db;

        public AssistanceService(AssistanceDbContext db)
        {
            _db = db;
        }

        public static string GenerateReferenceCode()
        {
            var randomBytes = new byte[3];
            RandomNumberGenerator.Fill(randomBytes);
            int number = BitConverter.ToUInt16(randomBytes, 0) % 90000 + 10000;
            return $"EMG-{number}";
        }

        private static string GetCategoryName(int categoryId) => categoryId switch
        {
            1 => "Food Rations",
            2 => "Clean Water",
            3 => "Emergency Medicine",
            4 => "Temporary Shelter",
            5 => "Rescue & Evacuation",
            6 => "Disaster Transport",
            7 => "Medical Supplies",
            _ => "General Assistance"
        };

        private static string GetUrgencyName(int urgencyId) => urgencyId switch
        {
            1 => "Low",
            2 => "Medium",
            3 => "High",
            4 => "Immediate",
            _ => "Medium"
        };

        public async Task<Result<AssistanceRequestResponseDto>> CreateRequestAsync(
            string citizenId, string citizenName, string citizenPhone, CreateAssistanceRequestDto dto)
        {
            var entity = new AssistanceRequest
            {
                ReferenceCode = GenerateReferenceCode(),
                CitizenId = citizenId,
                CitizenName = citizenName,
                CitizenPhone = dto.ContactPhone ?? citizenPhone,
                Title = dto.Title,
                Description = dto.Description,
                CategoryId = dto.CategoryId,
                CategoryName = GetCategoryName(dto.CategoryId),
                UrgencyId = dto.UrgencyId,
                UrgencyName = GetUrgencyName(dto.UrgencyId),
                AffectedCount = dto.AffectedCount,
                Address = dto.Address,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                SpecialNeeds = dto.SpecialNeeds,
                EvidenceImagesJson = dto.EvidenceImages != null && dto.EvidenceImages.Any()
                    ? JsonSerializer.Serialize(dto.EvidenceImages)
                    : null,
                Status = "Submitted",
                CreatedAtUtc = DateTime.UtcNow
            };

            entity.StatusHistories.Add(new RequestStatusHistory
            {
                Status = "Submitted",
                Title = "Distress Call Registered",
                Notes = "Assistance request logged by citizen. Queued for AI urgency assessment and coordinator review.",
                UpdatedByUserId = citizenId,
                UpdatedByName = citizenName,
                TimestampUtc = DateTime.UtcNow
            });

            _db.AssistanceRequests.Add(entity);
            await _db.SaveChangesAsync();

            return Result<AssistanceRequestResponseDto>.Success(MapToDto(entity));
        }

        public async Task<Result<RequestTrackingDto>> CreateGuestEmergencyRequestAsync(GuestEmergencyRequestDto dto)
        {
            var refCode = GenerateReferenceCode();
            var entity = new AssistanceRequest
            {
                ReferenceCode = refCode,
                CitizenId = $"GUEST-{Guid.NewGuid().ToString("N")[..8]}",
                CitizenName = dto.FullName,
                CitizenPhone = dto.PhoneNumber,
                Title = $"Emergency SOS: {dto.PrimaryEmergencyNeed} ({dto.LocationName})",
                Description = dto.SituationNotes,
                CategoryId = 5, // Rescue
                CategoryName = dto.PrimaryEmergencyNeed,
                UrgencyId = dto.UrgencyLevel == "Critical" ? 4 : 3,
                UrgencyName = dto.UrgencyLevel,
                AffectedCount = dto.PeopleCount,
                Address = string.IsNullOrWhiteSpace(dto.DetailedAddress) ? dto.LocationName : $"{dto.LocationName}, {dto.DetailedAddress}",
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                Status = "Submitted",
                CreatedAtUtc = DateTime.UtcNow
            };

            entity.StatusHistories.Add(new RequestStatusHistory
            {
                Status = "Submitted",
                Title = "Guest SOS Logged",
                Notes = $"Emergency distress call received from {dto.FullName}. Contact line: {dto.PhoneNumber}.",
                UpdatedByName = dto.FullName,
                TimestampUtc = DateTime.UtcNow
            });

            _db.AssistanceRequests.Add(entity);
            await _db.SaveChangesAsync();

            var tracking = new RequestTrackingDto
            {
                ReferenceCode = refCode,
                Status = entity.Status,
                Title = entity.Title,
                Location = entity.Address,
                PeopleCount = entity.AffectedCount,
                LoggedAtUtc = entity.CreatedAtUtc,
                Milestones = entity.StatusHistories.Select(h => new StatusHistoryItemDto
                {
                    Id = h.Id,
                    Status = h.Status,
                    Title = h.Title,
                    Notes = h.Notes,
                    UpdatedByName = h.UpdatedByName,
                    TimestampUtc = h.TimestampUtc
                }).ToList()
            };

            return Result<RequestTrackingDto>.Success(tracking);
        }

        public async Task<Result<RequestTrackingDto>> TrackRequestByCodeAsync(string referenceCode)
        {
            var cleanCode = referenceCode.Trim().ToUpperInvariant();
            var entity = await _db.AssistanceRequests
                .Include(r => r.StatusHistories)
                .FirstOrDefaultAsync(r => r.ReferenceCode == cleanCode);

            if (entity == null)
            {
                return Result<RequestTrackingDto>.Failure($"No emergency request found matching reference tracking code '{cleanCode}'.");
            }

            var tracking = new RequestTrackingDto
            {
                ReferenceCode = entity.ReferenceCode,
                Status = entity.Status,
                Title = entity.Title,
                Location = entity.Address,
                PeopleCount = entity.AffectedCount,
                LoggedAtUtc = entity.CreatedAtUtc,
                Milestones = entity.StatusHistories
                    .OrderBy(h => h.TimestampUtc)
                    .Select(h => new StatusHistoryItemDto
                    {
                        Id = h.Id,
                        Status = h.Status,
                        Title = h.Title,
                        Notes = h.Notes,
                        UpdatedByName = h.UpdatedByName,
                        TimestampUtc = h.TimestampUtc
                    }).ToList()
            };

            return Result<RequestTrackingDto>.Success(tracking);
        }

        public async Task<Result<List<AssistanceRequestResponseDto>>> GetAllRequestsAsync(string? category = null, string? status = null)
        {
            var query = _db.AssistanceRequests.Include(r => r.StatusHistories).AsQueryable();
            if (!string.IsNullOrWhiteSpace(category))
            {
                query = query.Where(r => r.CategoryName.ToLower() == category.ToLower() || r.CategoryId.ToString() == category);
            }
            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(r => r.Status.ToLower() == status.ToLower());
            }
            var list = await query.OrderByDescending(r => r.CreatedAtUtc).ToListAsync();
            return Result<List<AssistanceRequestResponseDto>>.Success(list.Select(MapToDto).ToList());
        }

        public async Task<Result<List<AssistanceRequestResponseDto>>> GetCitizenRequestsAsync(string citizenId)
        {
            var list = await _db.AssistanceRequests
                .Include(r => r.StatusHistories)
                .Where(r => r.CitizenId == citizenId)
                .OrderByDescending(r => r.CreatedAtUtc)
                .ToListAsync();

            return Result<List<AssistanceRequestResponseDto>>.Success(list.Select(MapToDto).ToList());
        }

        public async Task<Result<AssistanceRequestResponseDto>> GetRequestByIdAsync(Guid id)
        {
            var entity = await _db.AssistanceRequests
                .Include(r => r.StatusHistories)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (entity == null)
            {
                return Result<AssistanceRequestResponseDto>.Failure("Assistance request not found.");
            }

            return Result<AssistanceRequestResponseDto>.Success(MapToDto(entity));
        }

        public async Task<Result> SubmitFeedbackAsync(Guid id, SubmitFeedbackDto dto)
        {
            var entity = await _db.AssistanceRequests.FindAsync(id);
            if (entity == null)
            {
                return Result.Failure("Assistance request not found.");
            }

            entity.FeedbackRating = Math.Clamp(dto.Rating, 1, 5);
            entity.FeedbackTagsJson = dto.Tags != null ? JsonSerializer.Serialize(dto.Tags) : null;
            entity.FeedbackComments = dto.Comments;
            entity.FeedbackSubmittedAtUtc = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return Result.Success();
        }

        private static AssistanceRequestResponseDto MapToDto(AssistanceRequest entity)
        {
            var images = new List<string>();
            if (!string.IsNullOrWhiteSpace(entity.EvidenceImagesJson))
            {
                try { images = JsonSerializer.Deserialize<List<string>>(entity.EvidenceImagesJson) ?? new(); } catch { }
            }

            var tags = new List<string>();
            if (!string.IsNullOrWhiteSpace(entity.FeedbackTagsJson))
            {
                try { tags = JsonSerializer.Deserialize<List<string>>(entity.FeedbackTagsJson) ?? new(); } catch { }
            }

            return new AssistanceRequestResponseDto
            {
                Id = entity.Id,
                ReferenceCode = entity.ReferenceCode,
                CitizenId = entity.CitizenId,
                CitizenName = entity.CitizenName,
                CitizenPhone = entity.CitizenPhone,
                Title = entity.Title,
                Description = entity.Description,
                CategoryId = entity.CategoryId,
                CategoryName = entity.CategoryName,
                UrgencyId = entity.UrgencyId,
                UrgencyName = entity.UrgencyName,
                AffectedCount = entity.AffectedCount,
                Address = entity.Address,
                Latitude = entity.Latitude,
                Longitude = entity.Longitude,
                SpecialNeeds = entity.SpecialNeeds,
                EvidenceImages = images,
                Status = entity.Status,
                CreatedAtUtc = entity.CreatedAtUtc,
                FeedbackRating = entity.FeedbackRating,
                FeedbackTags = tags,
                FeedbackComments = entity.FeedbackComments,
                StatusTimeline = entity.StatusHistories
                    .OrderBy(h => h.TimestampUtc)
                    .Select(h => new StatusHistoryItemDto
                    {
                        Id = h.Id,
                        Status = h.Status,
                        Title = h.Title,
                        Notes = h.Notes,
                        UpdatedByName = h.UpdatedByName,
                        TimestampUtc = h.TimestampUtc
                    }).ToList()
            };
        }
    }
}

