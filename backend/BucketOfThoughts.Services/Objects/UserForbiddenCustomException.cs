using BucketOfThoughts.Services.Constants;

namespace BucketOfThoughts.Services.Objects;

public class UserForbiddenCustomException : Exception
{
    public UserForbiddenCustomException() : base(ApplicationServiceMessages.UserForbidden) { }
    public UserForbiddenCustomException(string message, Exception innerException) : base(message, innerException) { }
}
