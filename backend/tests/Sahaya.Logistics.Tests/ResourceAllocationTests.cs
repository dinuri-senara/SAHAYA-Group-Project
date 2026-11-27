using Microsoft.AspNetCore.Mvc;
using Sahaya.Common.Models;
using Sahaya.Logistics.API.DTOs;
using Sahaya.Logistics.API.Models;
using Xunit;

namespace Sahaya.Logistics.Tests
{
    public class ResourceAllocationTests
    {
        [Fact]
        public async Task AllocateStock_ExceedingAvailableQuantity_ReturnsBadRequestInsufficientStock()
        {
            // Arrange
            var (controller, db) = TestDbContextFactory.CreateResourcesController(nameof(AllocateStock_ExceedingAvailableQuantity_ReturnsBadRequestInsufficientStock));
            var resource = new ResourceItem
            {
                Id = Guid.NewGuid(),
                Name = "Bottled Drinking Water (5L)",
                Category = ResourceCategory.DrinkingWater,
                TotalQuantity = 500,
                AvailableQuantity = 100, // Only 100 available
                AllocatedQuantity = 400,
                LowStockThreshold = 50,
                Unit = "Bottles",
                WarehouseLocation = "Central Depot",
                Status = ResourceStatus.Available,
                CreatedAtUtc = DateTime.UtcNow
            };
            db.Resources.Add(resource);
            await db.SaveChangesAsync();

            var allocateRequest = new CreateAllocationDto
            {
                ResourceId = resource.Id,
                QuantityAllocated = 150, // Requesting 150 when only 100 available
                DestinationLocation = "Ratnapura Relief Camp",
                RecipientName = "Disaster Management Center",
                TrackingNotes = "Urgent water distribution"
            };

            // Act
            var actionResult = await controller.AllocateStock(allocateRequest);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var result = Assert.IsType<Result<ResourceAllocation>>(badRequestResult.Value);
            Assert.False(result.IsSuccess);
            Assert.NotNull(result.ErrorMessage);
            Assert.Contains("Insufficient", result.ErrorMessage, StringComparison.OrdinalIgnoreCase);
        }

        [Fact]
        public async Task AllocateStock_ValidQuantity_DeductsAvailableAndIncrementsAllocated()
        {
            // Arrange
            var (controller, db) = TestDbContextFactory.CreateResourcesController(nameof(AllocateStock_ValidQuantity_DeductsAvailableAndIncrementsAllocated));
            var resource = new ResourceItem
            {
                Id = Guid.NewGuid(),
                Name = "Trauma First Aid Kits",
                Category = ResourceCategory.MedicalSupplies,
                TotalQuantity = 1000,
                AvailableQuantity = 600,
                AllocatedQuantity = 400,
                LowStockThreshold = 100,
                Unit = "Kits",
                WarehouseLocation = "Central Depot",
                Status = ResourceStatus.Available,
                CreatedAtUtc = DateTime.UtcNow
            };
            db.Resources.Add(resource);
            await db.SaveChangesAsync();

            var allocateRequest = new CreateAllocationDto
            {
                ResourceId = resource.Id,
                QuantityAllocated = 200,
                DestinationLocation = "Matara General Hospital Shelter",
                RecipientName = "Matara Relief Team",
                TrackingNotes = "Medical supplies for flood victims"
            };

            // Act
            var actionResult = await controller.AllocateStock(allocateRequest);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var result = Assert.IsType<Result<ResourceAllocation>>(okResult.Value);
            Assert.True(result.IsSuccess);
            Assert.NotNull(result.Data);
            Assert.Equal(200, result.Data.QuantityAllocated);

            // Verify database update
            var updatedResource = await db.Resources.FindAsync(resource.Id);
            Assert.NotNull(updatedResource);
            Assert.Equal(400, updatedResource.AvailableQuantity);
            Assert.Equal(600, updatedResource.AllocatedQuantity);
        }

        [Fact]
        public async Task ReplenishStock_ValidAdditionalQuantity_IncrementsStockCorrectly()
        {
            // Arrange
            var (controller, db) = TestDbContextFactory.CreateResourcesController(nameof(ReplenishStock_ValidAdditionalQuantity_IncrementsStockCorrectly));
            var resource = new ResourceItem
            {
                Id = Guid.NewGuid(),
                Name = "Emergency Dry Ration Packs",
                Category = ResourceCategory.Food,
                TotalQuantity = 2000,
                AvailableQuantity = 500,
                AllocatedQuantity = 1500,
                LowStockThreshold = 400,
                Unit = "Packs",
                WarehouseLocation = "Central Depot",
                Status = ResourceStatus.Available,
                CreatedAtUtc = DateTime.UtcNow
            };
            db.Resources.Add(resource);
            await db.SaveChangesAsync();

            var replenishDto = new ReplenishStockDto
            {
                AdditionalQuantity = 1000,
                SupplierOrDonor = "World Food Programme (WFP)"
            };

            // Act
            var actionResult = await controller.ReplenishStock(resource.Id, replenishDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var result = Assert.IsType<Result<ResourceResponseDto>>(okResult.Value);
            Assert.True(result.IsSuccess);
            Assert.NotNull(result.Data);
            Assert.Equal(3000, result.Data.TotalQuantity);
            Assert.Equal(1500, result.Data.AvailableQuantity);
        }
    }
}
