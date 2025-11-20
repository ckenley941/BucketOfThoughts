namespace BucketOfThoughts.Services.Objects;

public class NotFoundException : Exception
{
    public NotFoundException() : base("Record not found.") { }
    public NotFoundException(string? recordType) : base($"{recordType} not found.") { }
    public NotFoundException(string message, Exception innerException) : base(message, innerException) { }
}
