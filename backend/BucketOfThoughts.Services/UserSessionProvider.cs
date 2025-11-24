using BucketOfThoughts.Services.Objects;

namespace BucketOfThoughts.Services;
public interface IUserSessionProvider
{
    public long LoginProfileId { get; }
    public void SetCurrentUser(CurrentUserSession userSession);
    public CurrentUserSession GetCurrentUser();
}
public class UserSessionProvider : IUserSessionProvider
{
    private static CurrentUserSession CurrentUser { get; set; } = null!;
    public long LoginProfileId { get { return CurrentUser.LoginProfileId; } }
    public void SetCurrentUser(CurrentUserSession userSession)
    {
        CurrentUser = userSession;
    }

    public CurrentUserSession GetCurrentUser()
    {
        return CurrentUser;
    }
}
