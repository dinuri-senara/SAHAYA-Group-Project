using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Sahaya.Assistance.API.Models;

namespace Sahaya.Assistance.API.Data
{
    public static class AssistanceDataSeeder
    {
        public static async Task SeedAsync(AssistanceDbContext db)
        {
            if (!db.AssistanceRequests.Any())
            {
                var req1 = new AssistanceRequest
                {
                    Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    ReferenceCode = "EMG-74892",
                    CitizenId = "u-citizen-demo",
                    CitizenName = "Chaminda Silva",
                    CitizenPhone = "+94 77 123 4567",
                    Title = "5 people stranded on upper floor, floodwaters rising",
                    Description = "Flood level reached 4 feet. Two elderly family members require medication, 1 infant needs clean water and formula.",
                    CategoryId = 5, // Rescue
                    CategoryName = "Rescue & Evacuation",
                    UrgencyId = 4, // Immediate
                    UrgencyName = "Immediate",
                    AffectedCount = 5,
                    Address = "No. 42 Riverside Cross Road, Kelaniya (near Raja Maha Viharaya)",
                    Latitude = 6.9547,
                    Longitude = 79.9189,
                    SpecialNeeds = "1 infant formula, 1 insulin-dependent senior",
                    Status = "Submitted",
                    CreatedAtUtc = DateTime.UtcNow.AddHours(-3)
                };

                req1.StatusHistories.Add(new RequestStatusHistory
                {
                    Status = "Submitted",
                    Title = "SOS Logged",
                    Notes = "Assistance request logged via Citizen Assistance Portal. Geocoded to Kelaniya Basin.",
                    UpdatedByName = "Chaminda Silva",
                    TimestampUtc = DateTime.UtcNow.AddHours(-3)
                });

                var req2 = new AssistanceRequest
                {
                    Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    ReferenceCode = "EMG-10024",
                    CitizenId = "u-citizen-demo",
                    CitizenName = "Chaminda Silva",
                    CitizenPhone = "+94 77 123 4567",
                    Title = "Emergency Life Jackets & Flood Rescue Boat Evacuation",
                    Description = "Evacuation required from low-lying zone. Water level safe for inflatable boats.",
                    CategoryId = 5,
                    CategoryName = "Rescue & Evacuation",
                    UrgencyId = 4,
                    UrgencyName = "Immediate",
                    AffectedCount = 8,
                    Address = "Sedawatta Ferry Point, Kelani River Basin",
                    Latitude = 6.9460,
                    Longitude = 79.8820,
                    Status = "Resolved",
                    CreatedAtUtc = DateTime.UtcNow.AddDays(-2),
                    FeedbackRating = 5,
                    FeedbackTagsJson = JsonSerializer.Serialize(new List<string> { "Quick Delivery", "Adequate Supplies" }),
                    FeedbackComments = "Navy and volunteer rescue boat reached us within 45 minutes. Truly grateful!",
                    FeedbackSubmittedAtUtc = DateTime.UtcNow.AddDays(-1)
                };

                req2.StatusHistories.Add(new RequestStatusHistory
                {
                    Status = "Submitted",
                    Title = "Distress Call Registered",
                    Notes = "Citizen SOS submitted.",
                    UpdatedByName = "Chaminda Silva",
                    TimestampUtc = DateTime.UtcNow.AddDays(-2)
                });
                req2.StatusHistories.Add(new RequestStatusHistory
                {
                    Status = "Resolved",
                    Title = "Evacuation Completed",
                    Notes = "Navy rescue team safely evacuated 8 individuals to Kelaniya High School camp.",
                    UpdatedByName = "Navy Triage Unit #4",
                    TimestampUtc = DateTime.UtcNow.AddDays(-1)
                });

                db.AssistanceRequests.AddRange(req1, req2);
            }

            if (!db.HouseholdProfiles.Any())
            {
                var profile = new HouseholdProfile
                {
                    Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                    CitizenId = "u-citizen-demo",
                    ResidenceType = "Family",
                    TotalMembers = 3,
                    CompositionJson = JsonSerializer.Serialize(new
                    {
                        totalMembers = 3,
                        infants = 0,
                        children = 1,
                        adults = 1,
                        elderly = 1
                    }),
                    Address = "No. 18 Temple Road, Homagama",
                    District = "Colombo",
                    City = "Homagama",
                    Province = "Western",
                    EmergencyContactName = "Sunil Silva",
                    EmergencyContactPhone = "+94 71 274 9653",
                    Status = "Completed",
                    CreatedAtUtc = DateTime.UtcNow
                };

                profile.VulnerableMembers.Add(new VulnerableMember
                {
                    Category = "chronicMedicalConditions",
                    AffectedCount = 1,
                    MedicalDetails = "Diabetic prescription requirement",
                    RequiresSpecialMobility = false
                });

                db.HouseholdProfiles.Add(profile);
            }

            await db.SaveChangesAsync();
        }
    }
}
