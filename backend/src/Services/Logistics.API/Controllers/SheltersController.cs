using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sahaya.Common.Models;
using Sahaya.Logistics.API.Data;
using Sahaya.Logistics.API.DTOs;
using Sahaya.Logistics.API.Models;

namespace Sahaya.Logistics.API.Controllers
{
    [ApiController]
    [Route("api/v1/shelters")]
    public class SheltersController : ControllerBase
    {
        private readonly LogisticsDbContext _db;

        public SheltersController(LogisticsDbContext db)
        {
            _db = db;
        }

        /// <summary>
        /// Retrieves all verified emergency shelters with live occupancy percentage and SPHERE satiety metrics
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<Result<List<ShelterResponseDto>>>> GetAllShelters(
            [FromQuery] string? district = null, 
            [FromQuery] bool? activeOnly = false)
        {
            var query = _db.Shelters.Where(s => !s.IsDeleted).AsQueryable();

            if (!string.IsNullOrWhiteSpace(district))
            {
                query = query.Where(s => s.District.ToLower() == district.ToLower());
            }

            if (activeOnly == true)
            {
                query = query.Where(s => s.Status == ShelterStatus.Active);
            }

            var shelters = await query.OrderByDescending(s => s.CreatedAtUtc).ToListAsync();
            var dtos = shelters.Select(MapToResponseDto).ToList();

            return Ok(Result<List<ShelterResponseDto>>.Success(dtos));
        }

        /// <summary>
        /// Retrieves detailed operational information for a specific evacuation shelter
        /// </summary>
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<Result<ShelterResponseDto>>> GetShelterById(Guid id)
        {
            var shelter = await _db.Shelters.FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);
            if (shelter == null)
            {
                return NotFound(Result<ShelterResponseDto>.Failure($"Shelter with ID '{id}' was not found."));
            }

            return Ok(Result<ShelterResponseDto>.Success(MapToResponseDto(shelter)));
        }

        /// <summary>
        /// Registers a new verified safe shelter zone with GPS coordinates &amp; accessibility validation
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<Result<ShelterResponseDto>>> CreateShelter([FromBody] CreateShelterDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.District))
            {
                return BadRequest(Result<ShelterResponseDto>.Failure("Shelter Name and District are mandatory fields."));
            }

            if (request.TotalCapacity <= 0)
            {
                return BadRequest(Result<ShelterResponseDto>.Failure("Total Capacity must be greater than zero."));
            }

            // Geographic boundary validation for Sri Lanka (Lat: 5.8 to 9.9, Lon: 79.5 to 82.0)
            if (request.Latitude < 5.8 || request.Latitude > 9.9 || request.Longitude < 79.5 || request.Longitude > 82.0)
            {
                return BadRequest(Result<ShelterResponseDto>.Failure(
                    $"GPS coordinates ({request.Latitude}, {request.Longitude}) fall outside Sri Lankan territorial boundaries."));
            }

            var facilitiesJson = request.Facilities != null && request.Facilities.Any()
                ? JsonSerializer.Serialize(request.Facilities)
                : "[\"Clean Water\",\"First Aid\"]";

            var shelter = new Shelter
            {
                Name = request.Name.Trim(),
                Address = request.Address.Trim(),
                District = request.District.Trim(),
                Latitude = Math.Round(request.Latitude, 5),
                Longitude = Math.Round(request.Longitude, 5),
                TotalCapacity = request.TotalCapacity,
                CurrentOccupancy = 0,
                Status = ShelterStatus.Active,
                ContactPerson = request.ContactPerson,
                ContactPhone = request.ContactPhone,
                FacilitiesJson = facilitiesJson,
                AccessibilityInfo = request.AccessibilityInfo,
                IsWheelchairAccessible = request.IsWheelchairAccessible,
                WaterStockLiters = 2000, // Standard initial buffer
                FoodRationBoxes = 150,
                MedicalKitPacks = 20,
                LastStockAuditAtUtc = DateTime.UtcNow
            };

            _db.Shelters.Add(shelter);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetShelterById), new { id = shelter.Id }, 
                Result<ShelterResponseDto>.Success(MapToResponseDto(shelter)));
        }

        /// <summary>
        /// Updates shelter operational capacity, status, or facilities
        /// </summary>
        [HttpPut("{id:guid}")]
        public async Task<ActionResult<Result<ShelterResponseDto>>> UpdateShelter(Guid id, [FromBody] UpdateShelterDto request)
        {
            var shelter = await _db.Shelters.FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);
            if (shelter == null)
            {
                return NotFound(Result<ShelterResponseDto>.Failure($"Shelter with ID '{id}' was not found."));
            }

            if (request.TotalCapacity.HasValue && request.TotalCapacity.Value > 0)
            {
                shelter.TotalCapacity = request.TotalCapacity.Value;
            }

            if (request.CurrentOccupancy.HasValue && request.CurrentOccupancy.Value >= 0)
            {
                shelter.CurrentOccupancy = request.CurrentOccupancy.Value;
            }

            // Auto-update status to Full if capacity is reached
            if (shelter.CurrentOccupancy >= shelter.TotalCapacity)
            {
                shelter.Status = ShelterStatus.Full;
            }
            else if (request.Status.HasValue)
            {
                shelter.Status = request.Status.Value;
            }

            if (!string.IsNullOrWhiteSpace(request.ContactPhone))
            {
                shelter.ContactPhone = request.ContactPhone;
            }

            if (request.Facilities != null)
            {
                shelter.FacilitiesJson = JsonSerializer.Serialize(request.Facilities);
            }

            if (!string.IsNullOrWhiteSpace(request.AccessibilityInfo))
            {
                shelter.AccessibilityInfo = request.AccessibilityInfo;
            }

            shelter.UpdatedAtUtc = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return Ok(Result<ShelterResponseDto>.Success(MapToResponseDto(shelter)));
        }

        /// <summary>
        /// Assigns displaced persons to a shelter with automated Overcapacity Protection
        /// </summary>
        [HttpPost("{id:guid}/assign-evacuees")]
        public async Task<ActionResult<Result<ShelterResponseDto>>> AssignEvacuees(Guid id, [FromBody] AssignEvacueesDto request)
        {
            if (request.NumberOfPeople <= 0)
            {
                return BadRequest(Result<ShelterResponseDto>.Failure("Number of evacuees must be at least 1."));
            }

            var shelter = await _db.Shelters.FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);
            if (shelter == null)
            {
                return NotFound(Result<ShelterResponseDto>.Failure($"Shelter with ID '{id}' was not found."));
            }

            // Over-capacity Prevention (Coursework Requirement)
            if (shelter.AvailableCapacity < request.NumberOfPeople)
            {
                return BadRequest(Result<ShelterResponseDto>.Failure(
                    $"Cannot assign {request.NumberOfPeople} evacuees. Shelter '{shelter.Name}' only has {shelter.AvailableCapacity} available beds remaining. Overcapacity prevented."));
            }

            // Atomically increase occupancy
            shelter.CurrentOccupancy += request.NumberOfPeople;
            if (shelter.CurrentOccupancy >= shelter.TotalCapacity)
            {
                shelter.Status = ShelterStatus.Full;
            }
            shelter.UpdatedAtUtc = DateTime.UtcNow;

            // Log placement record
            var placement = new ShelterEvacueePlacement
            {
                ShelterId = shelter.Id,
                AssistanceRequestId = request.AssistanceRequestId,
                HeadOfFamilyName = string.IsNullOrWhiteSpace(request.HeadOfFamilyName) ? "Displaced Family" : request.HeadOfFamilyName,
                NumberOfPeople = request.NumberOfPeople,
                AssignedAtUtc = DateTime.UtcNow,
                Status = "Sheltered"
            };
            _db.ShelterEvacueePlacements.Add(placement);

            await _db.SaveChangesAsync();

            return Ok(Result<ShelterResponseDto>.Success(MapToResponseDto(shelter)));
        }

        /// <summary>
        /// Calculates camp satiety burn-rate analytics according to SPHERE Humanitarian Standards (3L water/person/day)
        /// </summary>
        [HttpGet("burn-rate")]
        public async Task<ActionResult<Result<List<CampSatietyBurnRateDto>>>> GetCampSatietyBurnRate()
        {
            var shelters = await _db.Shelters.Where(s => !s.IsDeleted).ToListAsync();
            var burnRateReports = new List<CampSatietyBurnRateDto>();

            foreach (var s in shelters)
            {
                int effectiveOccupancy = Math.Max(1, s.CurrentOccupancy);
                
                // SPHERE Humanitarian Standard: 3 Litres of clean drinking water per person per day
                double dailyWaterBurn = effectiveOccupancy * 3.0;
                double waterDaysRemaining = Math.Round(s.WaterStockLiters / dailyWaterBurn, 1);

                // Daily food consumption estimate: 0.5 ration boxes per person per day (or 2 meals/box)
                double dailyFoodBurn = Math.Max(1, effectiveOccupancy * 0.4);
                double foodDaysRemaining = Math.Round(s.FoodRationBoxes / dailyFoodBurn, 1);

                string urgency;
                string recommendation;

                if (waterDaysRemaining <= 2.0 || foodDaysRemaining <= 2.0)
                {
                    urgency = "Critical";
                    recommendation = $"Critical Depletion in < 48 hours! Immediate emergency convoy or inter-camp redistribution required.";
                }
                else if (waterDaysRemaining <= 5.0 || foodDaysRemaining <= 5.0)
                {
                    urgency = "Warning";
                    recommendation = $"Moderate Depletion in {waterDaysRemaining} days. Schedule depot replenishment within 48h.";
                }
                else if (waterDaysRemaining > 7.0 && foodDaysRemaining > 7.0)
                {
                    urgency = "Surplus";
                    recommendation = $"Surplus Stock Detected ({waterDaysRemaining} days buffer). Recommended donor source for inter-camp redistribution.";
                }
                else
                {
                    urgency = "Stable";
                    recommendation = "Stock consumption within safe operational parameters.";
                }

                burnRateReports.Add(new CampSatietyBurnRateDto
                {
                    ShelterId = s.Id,
                    ShelterName = s.Name,
                    District = s.District,
                    CurrentOccupancy = s.CurrentOccupancy,
                    WaterStockLiters = s.WaterStockLiters,
                    DailyWaterBurnRateLiters = dailyWaterBurn,
                    WaterDaysRemaining = waterDaysRemaining,
                    FoodRationBoxes = s.FoodRationBoxes,
                    FoodDaysRemaining = foodDaysRemaining,
                    DepletionUrgency = urgency,
                    Recommendation = recommendation
                });
            }

            return Ok(Result<List<CampSatietyBurnRateDto>>.Success(burnRateReports));
        }

        /// <summary>
        /// Executes an Atomic Inter-Camp Stock Redistribution from a surplus shelter to a depleted shelter
        /// </summary>
        [HttpPost("{id:guid}/transfer-supplies")]
        public async Task<ActionResult<Result<InterCampTransfer>>> TransferSupplies(Guid id, [FromBody] InterCampTransferRequestDto request)
        {
            if (request.WaterLiters <= 0 && request.FoodBoxes <= 0 && request.MedicalPacks <= 0)
            {
                return BadRequest(Result<InterCampTransfer>.Failure("Transfer must contain at least water, food, or medical kits."));
            }

            if (id == request.TargetShelterId)
            {
                return BadRequest(Result<InterCampTransfer>.Failure("Source shelter and target shelter cannot be identical."));
            }

            using var transaction = _db.Database.ProviderName == "Microsoft.EntityFrameworkCore.InMemory"
                ? null
                : await _db.Database.BeginTransactionAsync();
            try
            {
                var sourceShelter = await _db.Shelters.FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);
                if (sourceShelter == null)
                {
                    return NotFound(Result<InterCampTransfer>.Failure("Source shelter was not found."));
                }

                var targetShelter = await _db.Shelters.FirstOrDefaultAsync(s => s.Id == request.TargetShelterId && !s.IsDeleted);
                if (targetShelter == null)
                {
                    return NotFound(Result<InterCampTransfer>.Failure("Target shelter was not found."));
                }

                // Verify source shelter has adequate buffer
                if (sourceShelter.WaterStockLiters < request.WaterLiters)
                {
                    return BadRequest(Result<InterCampTransfer>.Failure(
                        $"Source shelter only has {sourceShelter.WaterStockLiters}L of water. Cannot transfer {request.WaterLiters}L."));
                }

                if (sourceShelter.FoodRationBoxes < request.FoodBoxes)
                {
                    return BadRequest(Result<InterCampTransfer>.Failure(
                        $"Source shelter only has {sourceShelter.FoodRationBoxes} food boxes. Cannot transfer {request.FoodBoxes}."));
                }

                // Atomic deduction and crediting
                sourceShelter.WaterStockLiters -= request.WaterLiters;
                sourceShelter.FoodRationBoxes -= request.FoodBoxes;
                sourceShelter.MedicalKitPacks -= request.MedicalPacks;
                sourceShelter.UpdatedAtUtc = DateTime.UtcNow;

                targetShelter.WaterStockLiters += request.WaterLiters;
                targetShelter.FoodRationBoxes += request.FoodBoxes;
                targetShelter.MedicalKitPacks += request.MedicalPacks;
                targetShelter.UpdatedAtUtc = DateTime.UtcNow;

                var transferRecord = new InterCampTransfer
                {
                    SourceShelterId = sourceShelter.Id,
                    SourceShelterName = sourceShelter.Name,
                    TargetShelterId = targetShelter.Id,
                    TargetShelterName = targetShelter.Name,
                    WaterLiters = request.WaterLiters,
                    FoodBoxes = request.FoodBoxes,
                    MedicalPacks = request.MedicalPacks,
                    ApprovedBy = "National Logistics Commander",
                    Notes = string.IsNullOrWhiteSpace(request.Notes) 
                        ? "AI-recommended emergency inter-camp convoy transfer" 
                        : request.Notes,
                    Status = TransferStatus.Completed,
                    TransferredAtUtc = DateTime.UtcNow
                };

                _db.InterCampTransfers.Add(transferRecord);
                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync();

                return Ok(Result<InterCampTransfer>.Success(transferRecord));
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                return StatusCode(500, Result<InterCampTransfer>.Failure($"Inter-camp transfer failed: {ex.Message}"));
            }
        }

        // ==========================================
        // Private Helper Mapper
        // ==========================================
        private static ShelterResponseDto MapToResponseDto(Shelter s)
        {
            List<string> facilitiesList;
            try
            {
                facilitiesList = JsonSerializer.Deserialize<List<string>>(s.FacilitiesJson) ?? new List<string>();
            }
            catch
            {
                facilitiesList = new List<string> { "Drinking Water", "First Aid" };
            }

            int effectiveOccupancy = Math.Max(1, s.CurrentOccupancy);
            double dailyWater = effectiveOccupancy * 3.0; // SPHERE standard
            double waterDays = Math.Round(s.WaterStockLiters / dailyWater, 1);

            string satietyStatus = waterDays <= 2.0 ? "Critical" : (waterDays <= 5.0 ? "Warning" : "Adequate");

            return new ShelterResponseDto
            {
                Id = s.Id,
                Name = s.Name,
                Address = s.Address,
                District = s.District,
                Latitude = s.Latitude,
                Longitude = s.Longitude,
                TotalCapacity = s.TotalCapacity,
                CurrentOccupancy = s.CurrentOccupancy,
                AvailableCapacity = s.AvailableCapacity,
                OccupancyPercentage = s.OccupancyPercentage,
                Status = s.Status,
                ContactPerson = s.ContactPerson,
                ContactPhone = s.ContactPhone,
                Facilities = facilitiesList,
                AccessibilityInfo = s.AccessibilityInfo,
                IsWheelchairAccessible = s.IsWheelchairAccessible,
                WaterStockLiters = s.WaterStockLiters,
                FoodRationBoxes = s.FoodRationBoxes,
                MedicalKitPacks = s.MedicalKitPacks,
                LastStockAuditAtUtc = s.LastStockAuditAtUtc,
                DailyWaterConsumptionLiters = dailyWater,
                WaterDaysRemaining = waterDays,
                WaterSatietyStatus = satietyStatus
            };
        }
    }
}
