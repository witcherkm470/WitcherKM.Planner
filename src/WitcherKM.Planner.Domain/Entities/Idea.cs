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

    public void Update(string essence)
    {
        if (IdeaStatus == IdeaStatus.Realized)
            throw new DomainException("Realized idea cannot be updated");

        Essence = essence;
    }

    public void SetRealized()
    {
        if (IdeaStatus != IdeaStatus.NotRealized)
            throw new DomainException("Only not realized idea can be realized");

        IdeaStatus = IdeaStatus.Realized;
    }

    public void SetCanceled()
    {
        if (IdeaStatus != IdeaStatus.NotRealized)
            throw new DomainException("Only not realized idea can be canceled");

        IdeaStatus = IdeaStatus.Canceled;
    }

    public void SetNotRealized()
    {
        if (IdeaStatus != IdeaStatus.Canceled)
            throw new DomainException("Only canceled idea can be restored");

        IdeaStatus = IdeaStatus.NotRealized;
    }
}
