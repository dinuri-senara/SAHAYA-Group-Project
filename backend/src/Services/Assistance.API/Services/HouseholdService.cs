using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Sahaya.Assistance.API.Data;
using Sahaya.Assistance.API.DTOs;
using Sahaya.Assistance.API.Models;
using Sahaya.Common.Models;

namespace Sahaya.Assistance.API.Services
{
    public class HouseholdService : IHouseholdService
    {
        private readonly AssistanceDbContext _db;

        public HouseholdService(AssistanceDbContext db)
        {
            _db = db;
        }

        public async Task<Result<HouseholdProfileDto>> GetHouseholdProfileAsync(string citizenId)
        {
            var profile = await _db.HouseholdProfiles
                .Include(p => p.VulnerableMembers)
                .FirstOrDefaultAsync(p => p.CitizenId == citizenId);

            if (profile == null)
            {
                // Return clean default structure
                return Result<HouseholdProfileDto>.Success(new HouseholdProfileDto
                {
                    ResidenceType = "Family",
                    TotalMembers = 1,
                    Composition = new HouseholdCompositionDto { TotalMembers = 1, Adults = 1 },
                    District = "Colombo",
                    Province = "Western"
                });
            }

            var comp = new HouseholdCompositionDto();
            if (!string.IsNullOrWhiteSpace(profile.CompositionJson))
            {
                try { comp = JsonSerializer.Deserialize<HouseholdCompositionDto>(profile.CompositionJson) ?? new(); } catch { }
            }

            var vulns = new Dictionary<string, VulnerabilityCategoryDto>();
            foreach (var vm in profile.VulnerableMembers)
            {
                vulns[vm.Category] = new VulnerabilityCategoryDto
                {
                    Selected = true,
                    AffectedCount = vm.AffectedCount,
                    Details = vm.MedicalDetails,
                    RequiresSpecialMobility = vm.RequiresSpecialMobility
                };
            }

            var dto = new HouseholdProfileDto
            {
                ResidenceType = profile.ResidenceType,
                TotalMembers = profile.TotalMembers,
                Composition = comp,
                Address = profile.Address,
                District = profile.District,
                City = profile.City,
                Province = profile.Province,
                EmergencyContactName = profile.EmergencyContactName,
                EmergencyContactPhone = profile.EmergencyContactPhone,
                NoSpecialNeeds = profile.NoSpecialNeeds,
                PreferNotToDisclose = profile.PreferNotToDisclose,
                Vulnerabilities = vulns
            };

            return Result<HouseholdProfileDto>.Success(dto);
        }

        public async Task<Result<HouseholdProfileDto>> SaveHouseholdProfileAsync(string citizenId, HouseholdProfileDto dto)
        {
            var profile = await _db.HouseholdProfiles
                .Include(p => p.VulnerableMembers)
                .FirstOrDefaultAsync(p => p.CitizenId == citizenId);

            if (profile == null)
            {
                profile = new HouseholdProfile
                {
                    CitizenId = citizenId,
                    CreatedAtUtc = DateTime.UtcNow
                };
                _db.HouseholdProfiles.Add(profile);
            }

            profile.ResidenceType = dto.ResidenceType;
            profile.TotalMembers = dto.TotalMembers;
            profile.CompositionJson = JsonSerializer.Serialize(dto.Composition ?? new());
            profile.Address = dto.Address ?? string.Empty;
            profile.District = dto.District ?? string.Empty;
            profile.City = dto.City ?? string.Empty;
            profile.Province = dto.Province ?? string.Empty;
            profile.EmergencyContactName = dto.EmergencyContactName ?? string.Empty;
            profile.EmergencyContactPhone = dto.EmergencyContactPhone ?? string.Empty;
            profile.NoSpecialNeeds = dto.NoSpecialNeeds;
            profile.PreferNotToDisclose = dto.PreferNotToDisclose;
            profile.Status = "Completed";
            profile.UpdatedAtUtc = DateTime.UtcNow;

            // Clear existing vulnerable member links and re-seed
            profile.VulnerableMembers.Clear();

            if (!dto.NoSpecialNeeds && !dto.PreferNotToDisclose && dto.Vulnerabilities != null)
            {
                foreach (var (categoryKey, v) in dto.Vulnerabilities)
                {
                    if (v.Selected)
                    {
                        profile.VulnerableMembers.Add(new VulnerableMember
                        {
                            Category = categoryKey,
                            AffectedCount = Math.Max(1, v.AffectedCount),
                            MedicalDetails = v.Details,
                            RequiresSpecialMobility = v.RequiresSpecialMobility
                        });
                    }
                }
            }

            await _db.SaveChangesAsync();
            return await GetHouseholdProfileAsync(citizenId);
        }
    }
}
