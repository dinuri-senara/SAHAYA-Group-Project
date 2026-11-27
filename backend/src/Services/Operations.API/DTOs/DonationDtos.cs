using Sahaya.Operations.API.Enums;

namespace Sahaya.Operations.API.DTOs;

public record DonationCampaignDto(
    Guid Id,
    string Title,
    string Description,
    decimal TargetAmount,
    decimal RaisedAmount,
    double ProgressPercentage,
    DateTime StartDate,
    DateTime? EndDate,
    bool IsActive,
    int TotalDonationsCount,
    DateTime CreatedAtUtc
);

public record CreateCampaignDto(
    string Title,
    string Description,
    decimal TargetAmount,
    DateTime? EndDate
);

public record DonationDto(
    Guid Id,
    Guid DonorUserId,
    string DonorName,
    Guid? CampaignId,
    string? CampaignTitle,
    DonationType DonationType,
    decimal Amount,
    string Currency,
    string? PaymentReference,
    string? ItemName,
    string? ItemCategory,
    int ItemQuantity,
    string? ItemUnit,
    decimal? EstimatedValue,
    DonationStatus Status,
    string? Notes,
    DateTime CreatedAtUtc
);

public record CreateMonetaryDonationDto(
    Guid? CampaignId,
    decimal Amount,
    string Currency,
    string? PaymentReference,
    string? Notes
);

public record CreateInKindDonationDto(
    Guid? CampaignId,
    string ItemName,
    string ItemCategory,
    int ItemQuantity,
    string ItemUnit,
    decimal? EstimatedValue,
    string? Notes
);
