using WitcherKM.Common.Core.Exceptions;
using WitcherKM.Common.Domain.Entities.Abstractions;
using WitcherKM.Planner.Domain.Enums;

namespace WitcherKM.Planner.Domain.Entities;

public class Idea : IEntity
{
    public Idea(string essence)
    {
        Essence = essence;
        IdeaStatus = IdeaStatus.NotRealized;
    }

    public long Id { get; private set; }

    public string Essence
    {
        get;
        private set
        {
            if(string.IsNullOrWhiteSpace(value))
                throw new DomainException("Idea essence cannot be empty");
            
            field = value;
        }
    }
    
    public IdeaStatus IdeaStatus { get; private set; }
}