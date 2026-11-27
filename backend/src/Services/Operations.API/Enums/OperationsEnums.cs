namespace Sahaya.Operations.API.Enums;

public enum VolunteerAvailability
{
    Available = 1,
    Busy = 2,
    OffDuty = 3
}

public enum VolunteerTaskStatus
{
    Assigned = 1,
    Accepted = 2,
    InProgress = 3,
    Completed = 4,
    Declined = 5
}

public enum DonationType
{
    Monetary = 1,
    InKind = 2
}

public enum DonationStatus
{
    Pending = 1,
    Completed = 2,
    Failed = 3
}

public enum RequestUrgency
{
    Low = 1,
    Medium = 2,
    High = 3,
    Critical = 4
}
