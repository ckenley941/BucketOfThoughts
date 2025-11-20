using System.Net;

namespace BucketOfThoughts.Api.Objects
{
    public class ErrorResponse
    {
        public ErrorResponse(HttpStatusCode statusCode, string errorMessage)
        {
            Status = (int)statusCode;
            ErrorMessage = errorMessage;
        }

        public int Status { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
    }
}
