using Sahaya.Common.Entities;
using Sahaya.Operations.API.Enums;

namespace Sahaya.Operations.API.Entities;

public class Donation : BaseEntity
{
    public Guid DonorUserId { get; set; }
    public string DonorName { get; set; } = string.Empty;

    public Guid? CampaignId { get; set; }
    public DonationCampaign? Campaign { get; set; }

    public DonationType DonationType { get; set; } = DonationType.Monetary;

    // Monetary
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "LKR";
    public string? PaymentReference { get; set; }

    // In-Kind
    public string? ItemName { get; set; }
    public string? ItemCategory { get; set; }
    public int ItemQuantity { get; set; }
    public string? ItemUnit { get; set; }
    public decimal? EstimatedValue { get; set; }

    public DonationStatus Status { get; set; } = DonationStatus.Completed;
    public string? Notes { get; set; }
}
