using Sahaya.Operations.API.Entities;
using Sahaya.Operations.API.Enums;

namespace Sahaya.Operations.API.Data;

public static class OperationsDataSeeder
{
    public static async Task SeedAsync(OperationsDbContext db)
    {
        if (!db.DonationCampaigns.Any())
        {
            var nationalFloodCampaign = new DonationCampaign
            {
                Title = "National Monsoon Flood Relief Fund 2026",
                Description = "Emergency relief fundraising for flood-affected families in Kalutara, Ratnapura, and Galle districts.",
                TargetAmount = 5000000m,
                RaisedAmount = 2150000m,
                StartDate = DateTime.UtcNow.AddDays(-10),
                EndDate = DateTime.UtcNow.AddDays(20),
                IsActive = true
            };

            var medicalCampaign = new DonationCampaign
            {
                Title = "Disaster Medical Supplies & Sanitation Drive",
                Description = "Immediate acquisition of first-aid kits, clean drinking water purifying tablets, and baby food packets.",
                TargetAmount = 2500000m,
                RaisedAmount = 1420000m,
                StartDate = DateTime.UtcNow.AddDays(-5),
                EndDate = DateTime.UtcNow.AddDays(25),
                IsActive = true
            };

            var shelterKitCampaign = new DonationCampaign
            {
                Title = "Temporary Emergency Shelter Bedding & Tarpaulins",
                Description = "Providing waterproof tents, sleeping mats, and warm blankets for community center evacuation hubs.",
                TargetAmount = 1500000m,
                RaisedAmount = 890000m,
                StartDate = DateTime.UtcNow.AddDays(-3),
                EndDate = DateTime.UtcNow.AddDays(30),
                IsActive = true
            };

            db.DonationCampaigns.AddRange(nationalFloodCampaign, medicalCampaign, shelterKitCampaign);
            await db.SaveChangesAsync();

            db.Donations.AddRange(
                new Donation
                {
                    DonorUserId = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                    DonorName = "Commercial Bank Aid Initiative",
                    CampaignId = nationalFloodCampaign.Id,
                    DonationType = DonationType.Monetary,
                    Amount = 1000000m,
                    Currency = "LKR",
                    PaymentReference = "TXN-RELIEF-2026-001",
                    Status = DonationStatus.Completed,
                    Notes = "Corporate social responsibility emergency grant."
                },
                new Donation
                {
                    DonorUserId = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                    DonorName = "Dilmah Tea Foundation",
                    CampaignId = medicalCampaign.Id,
                    DonationType = DonationType.InKind,
                    ItemName = "Water Purification Kits",
                    ItemCategory = "Sanitation",
                    ItemQuantity = 500,
                    ItemUnit = "Packs",
                    EstimatedValue = 250000m,
                    Status = DonationStatus.Completed,
                    Notes = "Delivered to Colombo central depot."
                }
            );
            await db.SaveChangesAsync();
        }

        if (!db.VolunteerProfiles.Any())
        {
            var volunteer1 = new VolunteerProfile
            {
                UserId = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                FullName = "Nuwan Bandara (Lead Volunteer)",
                Email = "volunteer@sahaya.org",
                Phone = "+94 77 123 4567",
                SkillsJson = "[\"Search and Rescue\", \"First Aid\", \"Heavy Vehicle Driving\", \"Water Rescue\"]",
                AvailabilityStatus = VolunteerAvailability.Available,
                ServiceArea = "Kalutara & Western Province",
                IsVerified = true,
                Latitude = 6.5854,
                Longitude = 79.9607
            };

            var volunteer2 = new VolunteerProfile
            {
                UserId = Guid.NewGuid(),
                FullName = "Dr. Anoma Wijesekara",
                Email = "anoma.w@gmail.com",
                Phone = "+94 71 889 2233",
                SkillsJson = "[\"Medical Triage\", \"Trauma Care\", \"Pediatrics\"]",
                AvailabilityStatus = VolunteerAvailability.Busy,
                ServiceArea = "Ratnapura",
                IsVerified = true,
                Latitude = 6.6828,
                Longitude = 80.4036
            };

            db.VolunteerProfiles.AddRange(volunteer1, volunteer2);
            await db.SaveChangesAsync();

            db.VolunteerTasks.AddRange(
                new VolunteerTask
                {
                    VolunteerProfileId = volunteer1.Id,
                    Title = "Distribute Clean Water Cans at Millaniya Community Center",
                    Description = "Transport 200 water cans from Horana depot to Millaniya temporary evacuation camp.",
                    Priority = RequestUrgency.High,
                    Status = VolunteerTaskStatus.InProgress,
                    Deadline = DateTime.UtcNow.AddHours(12),
                    AssignedById = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    AssignedAt = DateTime.UtcNow.AddHours(-2),
                    Notes = "Coordinate with Grama Niladhari upon arrival."
                },
                new VolunteerTask
                {
                    VolunteerProfileId = volunteer1.Id,
                    Title = "Medical Evacuation Support - Agalawatta",
                    Description = "Assist ambulance staff with elderly patient transport through waterlogged road section.",
                    Priority = RequestUrgency.Critical,
                    Status = VolunteerTaskStatus.Completed,
                    Deadline = DateTime.UtcNow.AddDays(-1),
                    AssignedById = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    AssignedAt = DateTime.UtcNow.AddDays(-1).AddHours(-4),
                    CompletedAt = DateTime.UtcNow.AddDays(-1),
                    Notes = "Mission safely accomplished."
                }
            );
            await db.SaveChangesAsync();
        }
    }
}
