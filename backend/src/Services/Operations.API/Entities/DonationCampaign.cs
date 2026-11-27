using Sahaya.Common.Entities;

namespace Sahaya.Operations.API.Entities;

public class DonationCampaign : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal TargetAmount { get; set; }
    public decimal RaisedAmount { get; set; }
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    public DateTime? EndDate { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<Donation> Donations { get; set; } = new List<Donation>();
}
