using Microsoft.AspNetCore.Mvc;
using Sahaya.Common.Models;
using Sahaya.Logistics.API.DTOs;
using Sahaya.Logistics.API.Models;
using Xunit;

namespace Sahaya.Logistics.Tests
{
    public class ShelterValidationTests
    {
        [Fact]
        public async Task AssignEvacuees_ExceedingAvailableCapacity_ReturnsBadRequestOvercapacityError()
        {
            // Arrange
            var (controller, db) = TestDbContextFactory.CreateSheltersController(nameof(AssignEvacuees_ExceedingAvailableCapacity_ReturnsBadRequestOvercapacityError));
            var shelter = new Shelter
            {
                Id = Guid.NewGuid(),
                Name = "Matale Community Shelter",
                District = "Matale",
                Address = "Kandy Rd",
                Latitude = 7.4675,
                Longitude = 80.6234,
                TotalCapacity = 100,
                CurrentOccupancy = 90, // Only 10 spaces available
                Status = ShelterStatus.Active,
                CreatedAtUtc = DateTime.UtcNow
            };
            db.Shelters.Add(shelter);
            await db.SaveChangesAsync();

            var requestDto = new AssignEvacueesDto
            {
                HeadOfFamilyName = "Perera Family",
                NumberOfPeople = 15 // Attempting to assign 15 when only 10 available
            };

            // Act
            var actionResult = await controller.AssignEvacuees(shelter.Id, requestDto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var result = Assert.IsType<Result<ShelterResponseDto>>(badRequestResult.Value);
            Assert.False(result.IsSuccess);
            Assert.NotNull(result.ErrorMessage);
            Assert.Contains("Cannot assign", result.ErrorMessage, StringComparison.OrdinalIgnoreCase);
        }

        [Fact]
        public async Task AssignEvacuees_WithinCapacity_SuccessfullyIncrementsOccupancy()
        {
            // Arrange
            var (controller, db) = TestDbContextFactory.CreateSheltersController(nameof(AssignEvacuees_WithinCapacity_SuccessfullyIncrementsOccupancy));
            var shelter = new Shelter
            {
                Id = Guid.NewGuid(),
                Name = "Galle Fort Safe Camp",
                District = "Galle",
                Address = "Rampart St",
                Latitude = 6.0535,
                Longitude = 80.2210,
                TotalCapacity = 200,
                CurrentOccupancy = 50,
                Status = ShelterStatus.Active,
                CreatedAtUtc = DateTime.UtcNow
            };
            db.Shelters.Add(shelter);
            await db.SaveChangesAsync();

            var requestDto = new AssignEvacueesDto
            {
                HeadOfFamilyName = "Silva Family",
                NumberOfPeople = 25
            };

            // Act
            var actionResult = await controller.AssignEvacuees(shelter.Id, requestDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var result = Assert.IsType<Result<ShelterResponseDto>>(okResult.Value);
            Assert.True(result.IsSuccess);
            Assert.NotNull(result.Data);
            Assert.Equal(75, result.Data.CurrentOccupancy);
            Assert.Equal(125, result.Data.AvailableCapacity);
        }

        [Fact]
        public async Task CreateShelter_OutsideSriLankanGpsBoundary_ReturnsBadRequest()
        {
            // Arrange
            var (controller, _) = TestDbContextFactory.CreateSheltersController(nameof(CreateShelter_OutsideSriLankanGpsBoundary_ReturnsBadRequest));
            var foreignShelterDto = new CreateShelterDto
            {
                Name = "London Emergency Hall",
                District = "Foreign",
                Address = "Trafalgar Square",
                Latitude = 51.5074,  // Foreign Latitude (Valid Sri Lanka is 5.8 - 9.9)
                Longitude = -0.1278, // Foreign Longitude (Valid Sri Lanka is 79.5 - 82.0)
                TotalCapacity = 500,
                ContactPerson = "John Doe",
                ContactPhone = "+44 20 7946 0958"
            };

            // Act
            var actionResult = await controller.CreateShelter(foreignShelterDto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var result = Assert.IsType<Result<ShelterResponseDto>>(badRequestResult.Value);
            Assert.False(result.IsSuccess);
            Assert.NotNull(result.ErrorMessage);
            Assert.Contains("Sri Lanka", result.ErrorMessage, StringComparison.OrdinalIgnoreCase);
        }
    }
}
