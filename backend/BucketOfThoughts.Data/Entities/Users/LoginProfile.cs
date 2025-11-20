using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BucketOfThoughts.Data.Entities;

[Table("LoginProfile")]
public partial class LoginProfile : BaseModifiableDbTable
{
    /// <summary>
    /// The Auth0 identifier for the user used to lookup roles and Auth0 profile data.
    /// </summary>
    [MaxLength(255)]
    public string Auth0Id { get; set; } = null!;
    /// <summary>
    /// The Display Name of the user.
    /// </summary>
    [MaxLength(100)]
    public string DisplayName { get; set; } = null!;
    /// <summary>
    /// The thoughts associated with the login profile.
    /// </summary>
    public IEnumerable<Thought> Thoughts { get; set; } = null!;
    /// <summary>
    /// The thoughts associated with the login profile.
    /// </summary>
    public IEnumerable<ThoughtBucket> ThoughtBuckets { get; set; } = null!;
}
