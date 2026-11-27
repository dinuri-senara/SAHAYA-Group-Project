using System.Collections.Generic;

namespace Sahaya.Assistance.API.DTOs
{
    public class CreateAssistanceRequestDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int CategoryId { get; set; } = 1;
        public int UrgencyId { get; set; } = 2;
        public int AffectedCount { get; set; } = 1;
        public string Address { get; set; } = string.Empty;
        public double Latitude { get; set; } = 6.9271;
        public double Longitude { get; set; } = 79.8612;
        public string? ContactPhone { get; set; }
        public string? SpecialNeeds { get; set; }
        public List<string>? EvidenceImages { get; set; }
        public string? CrisisEventId { get; set; }
    }

    public class GuestEmergencyRequestDto
    {
        public string FullName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string LocationName { get; set; } = string.Empty;
        public string DetailedAddress { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public int PeopleCount { get; set; } = 1;
        public string SituationNotes { get; set; } = string.Empty;
        public string PrimaryEmergencyNeed { get; set; } = "Rescue & Evacuation";
        public string UrgencyLevel { get; set; } = "High";
        public string? SafeContactNumber { get; set; }
    }

    public class SubmitFeedbackDto
    {
        public int Rating { get; set; } = 5;
        public List<string> Tags { get; set; } = new();
        public string? Comments { get; set; }
    }
}
