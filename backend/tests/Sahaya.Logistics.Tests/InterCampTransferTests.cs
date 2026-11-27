using Microsoft.AspNetCore.Mvc;
using Sahaya.Common.Models;
using Sahaya.Logistics.API.DTOs;
using Sahaya.Logistics.API.Models;
using Xunit;

namespace Sahaya.Logistics.Tests
{
    public class InterCampTransferTests
    {
        [Fact]
        public async Task TransferSupplies_WithSufficientStock_AtomicallyTransfersBetweenCamps()
        {
            // Arrange
            var (controller, db) = TestDbContextFactory.CreateSheltersController(nameof(TransferSupplies_WithSufficientStock_AtomicallyTransfersBetweenCamps));
            var sourceShelter = new Shelter
            {
                Id = Guid.NewGuid(),
                Name = "Matara Surplus Camp",
                District = "Matara",
                Address = "Beach Rd",
                Latitude = 5.9496,
                Longitude = 80.5469,
                TotalCapacity = 500,
                CurrentOccupancy = 100,
                WaterStockLiters = 5000,
                FoodRationBoxes = 800,
                Status = ShelterStatus.Active,
                CreatedAtUtc = DateTime.UtcNow
            };
            var targetShelter = new Shelter
            {
                Id = Guid.NewGuid(),
                Name = "Ratnapura Depleted Camp",
                District = "Ratnapura",
                Address = "Hill Rd",
                Latitude = 6.6828,
                Longitude = 80.4034,
                TotalCapacity = 300,
                CurrentOccupancy = 250,
                WaterStockLiters = 200,
                FoodRationBoxes = 50,
                Status = ShelterStatus.Active,
                CreatedAtUtc = DateTime.UtcNow
            };
            db.Shelters.AddRange(sourceShelter, targetShelter);
            await db.SaveChangesAsync();

            var transferDto = new InterCampTransferRequestDto
            {
                TargetShelterId = targetShelter.Id,
                WaterLiters = 1500,
                FoodBoxes = 300,
                Notes = "Convoy redistribution to critical camp"
            };

            // Act
            var actionResult = await controller.TransferSupplies(sourceShelter.Id, transferDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var result = Assert.IsType<Result<InterCampTransfer>>(okResult.Value);
            Assert.True(result.IsSuccess);
            Assert.NotNull(result.Data);
            Assert.Equal(1500, result.Data.WaterLiters);
            Assert.Equal(300, result.Data.FoodBoxes);

            // Verify Atomic Database Balances
            var updatedSource = await db.Shelters.FindAsync(sourceShelter.Id);
            var updatedTarget = await db.Shelters.FindAsync(targetShelter.Id);

            Assert.NotNull(updatedSource);
            Assert.NotNull(updatedTarget);
            Assert.Equal(3500, updatedSource.WaterStockLiters); // 5000 - 1500
            Assert.Equal(500, updatedSource.FoodRationBoxes);   // 800 - 300

            Assert.Equal(1700, updatedTarget.WaterStockLiters); // 200 + 1500
            Assert.Equal(350, updatedTarget.FoodRationBoxes);   // 50 + 300
        }
    }
}
