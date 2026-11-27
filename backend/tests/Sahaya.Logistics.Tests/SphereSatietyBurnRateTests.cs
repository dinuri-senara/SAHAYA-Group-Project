using Microsoft.AspNetCore.Mvc;
using Sahaya.Common.Models;
using Sahaya.Logistics.API.DTOs;
using Sahaya.Logistics.API.Models;
using Xunit;

namespace Sahaya.Logistics.Tests
{
    public class SphereSatietyBurnRateTests
    {
        [Fact]
        public async Task BurnRate_CalculatesSPHEREWaterConsumption_At3LitersPerPersonPerDay()
        {
            // Arrange
            var (controller, db) = TestDbContextFactory.CreateSheltersController(nameof(BurnRate_CalculatesSPHEREWaterConsumption_At3LitersPerPersonPerDay));
            var shelter = new Shelter
            {
                Id = Guid.NewGuid(),
                Name = "Test Haven Rahula",
                District = "Matara",
                Address = "Matara Beach Rd",
                Latitude = 5.9496,
                Longitude = 80.5469,
                TotalCapacity = 300,
                CurrentOccupancy = 100, // 100 evacuees
                WaterStockLiters = 1500, // 1500 Liters
                FoodRationBoxes = 500,
                Status = ShelterStatus.Active,
                CreatedAtUtc = DateTime.UtcNow
            };
            db.Shelters.Add(shelter);
            await db.SaveChangesAsync();

            // Act
            var actionResult = await controller.GetCampSatietyBurnRate();
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var result = Assert.IsType<Result<List<CampSatietyBurnRateDto>>>(okResult.Value);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.NotNull(result.Data);
            Assert.NotEmpty(result.Data);

            var burnRate = result.Data.First(b => b.ShelterId == shelter.Id);
            // SPHERE Standard: 100 people * 3 Liters/day = 300 Liters/day
            Assert.Equal(300, burnRate.DailyWaterBurnRateLiters);
            // Days remaining: 1500 / 300 = 5.0 days
            Assert.Equal(5.0, burnRate.WaterDaysRemaining);
        }

        [Fact]
        public async Task BurnRate_WithStockUnderTwoDays_ReturnsCriticalAlert()
        {
            // Arrange
            var (controller, db) = TestDbContextFactory.CreateSheltersController(nameof(BurnRate_WithStockUnderTwoDays_ReturnsCriticalAlert));
            var shelter = new Shelter
            {
                Id = Guid.NewGuid(),
                Name = "Critical Drought Shelter",
                District = "Ratnapura",
                Address = "Main St",
                Latitude = 6.6828,
                Longitude = 80.4034,
                TotalCapacity = 200,
                CurrentOccupancy = 100, // Consumes 300L/day
                WaterStockLiters = 200,  // Only 200L left (< 1 day remaining)
                FoodRationBoxes = 20,
                Status = ShelterStatus.Active,
                CreatedAtUtc = DateTime.UtcNow
            };
            db.Shelters.Add(shelter);
            await db.SaveChangesAsync();

            // Act
            var actionResult = await controller.GetCampSatietyBurnRate();
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var result = Assert.IsType<Result<List<CampSatietyBurnRateDto>>>(okResult.Value);

            // Assert
            Assert.NotNull(result.Data);
            var burnRate = result.Data.First(b => b.ShelterId == shelter.Id);
            Assert.Equal("Critical", burnRate.DepletionUrgency);
            Assert.True(burnRate.WaterDaysRemaining < 2.0);
        }

        [Fact]
        public async Task BurnRate_WithStockOverFiveDays_ReturnsSurplusOrStableAlert()
        {
            // Arrange
            var (controller, db) = TestDbContextFactory.CreateSheltersController(nameof(BurnRate_WithStockOverFiveDays_ReturnsSurplusOrStableAlert));
            var shelter = new Shelter
            {
                Id = Guid.NewGuid(),
                Name = "Well Stocked Shelter",
                District = "Colombo",
                Address = "Colombo Hall",
                Latitude = 6.9271,
                Longitude = 79.8612,
                TotalCapacity = 100,
                CurrentOccupancy = 50, // Consumes 150L/day
                WaterStockLiters = 3000, // 3000 / 150 = 20 days
                FoodRationBoxes = 500,
                Status = ShelterStatus.Active,
                CreatedAtUtc = DateTime.UtcNow
            };
            db.Shelters.Add(shelter);
            await db.SaveChangesAsync();

            // Act
            var actionResult = await controller.GetCampSatietyBurnRate();
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var result = Assert.IsType<Result<List<CampSatietyBurnRateDto>>>(okResult.Value);

            // Assert
            Assert.NotNull(result.Data);
            var burnRate = result.Data.First(b => b.ShelterId == shelter.Id);
            Assert.True(burnRate.WaterDaysRemaining >= 5.0);
            Assert.Contains(burnRate.DepletionUrgency, new[] { "Surplus", "Stable" });
        }
    }
}
