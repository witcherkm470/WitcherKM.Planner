using WitcherKM.Planner.Domain.Enums;

namespace WitcherKM.Planner.Api.Models.Feature;

public class ChangeFeatureStatusRequest
{
    public FeatureStatus FeatureStatus { get; init; }
}
