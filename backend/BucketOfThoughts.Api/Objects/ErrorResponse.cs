using BucketOfThoughts.Services.Constants;

namespace BucketOfThoughts.Api.Objects
{
    public class ErrorResponse
    {
        public ErrorResponse(ServiceStatusCodes errorCode, string? errorMessage)
        {
            ErrorCode = errorCode;
            ErrorMessage = errorMessage ?? ApplicationServiceMessages.UnexpectedError;
        }

        public string? ErrorMessage { get; set; }
        public ServiceStatusCodes ErrorCode { get; set; }
    }
}
