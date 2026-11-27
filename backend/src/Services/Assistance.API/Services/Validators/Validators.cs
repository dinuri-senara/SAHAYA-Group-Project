using FluentValidation;
using Sahaya.Assistance.API.DTOs;

namespace Sahaya.Assistance.API.Services.Validators
{
    public static class SriLankaGeoValidator
    {
        // Sri Lanka mainland and maritime disaster intervention bounding box
        public const double MinLatitude = 5.80;
        public const double MaxLatitude = 10.00;
        public const double MinLongitude = 79.40;
        public const double MaxLongitude = 82.00;

        public static bool IsWithinSriLanka(double latitude, double longitude)
        {
            return latitude >= MinLatitude && latitude <= MaxLatitude &&
                   longitude >= MinLongitude && longitude <= MaxLongitude;
        }
    }

    public class CreateAssistanceRequestValidator : AbstractValidator<CreateAssistanceRequestDto>
    {
        public CreateAssistanceRequestValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Request title is required.")
                .MaximumLength(200).WithMessage("Title cannot exceed 200 characters.");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Situation description is required.")
                .MinimumLength(5).WithMessage("Please describe the situation in at least 5 characters.");

            RuleFor(x => x.AffectedCount)
                .GreaterThanOrEqualTo(1).WithMessage("Number of affected people must be at least 1.");

            RuleFor(x => x.Address)
                .NotEmpty().WithMessage("Street address or known landmark is required.");

            RuleFor(x => x)
                .Must(x => SriLankaGeoValidator.IsWithinSriLanka(x.Latitude, x.Longitude))
                .WithMessage("Coordinates must be within the territory of Sri Lanka (Lat: 5.8-10.0°N, Lon: 79.4-82.0°E).");
        }
    }

    public class GuestEmergencyRequestValidator : AbstractValidator<GuestEmergencyRequestDto>
    {
        public GuestEmergencyRequestValidator()
        {
            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Your name is required for rescue identification.");

            RuleFor(x => x.PhoneNumber)
                .NotEmpty().WithMessage("Contact phone number is required.");

            RuleFor(x => x.LocationName)
                .NotEmpty().WithMessage("Location or landmark is required.");

            RuleFor(x => x.PeopleCount)
                .GreaterThanOrEqualTo(1).WithMessage("At least 1 individual must be reported.");

            RuleFor(x => x)
                .Must(x => SriLankaGeoValidator.IsWithinSriLanka(x.Latitude, x.Longitude))
                .WithMessage("Pinned location must be within Sri Lanka boundaries.");
        }
    }

    public class HouseholdProfileValidator : AbstractValidator<HouseholdProfileDto>
    {
        public HouseholdProfileValidator()
        {
            RuleFor(x => x.TotalMembers)
                .GreaterThanOrEqualTo(1).WithMessage("Total household members must be at least 1.");

            RuleFor(x => x.District)
                .NotEmpty().WithMessage("Sri Lankan district must be selected.");
        }
    }
}
