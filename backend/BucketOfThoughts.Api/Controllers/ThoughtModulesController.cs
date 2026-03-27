using BucketOfThoughts.Api.Extensions;
using BucketOfThoughts.Services;
using BucketOfThoughts.Services.Mappings;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace BucketOfThoughts.Api.Controllers;

/// <summary>
/// Thought modules API (lookup list for buckets, etc.)
/// </summary>
public class ThoughtModulesController(IThoughtModuleService thoughtModuleService, IUserSessionProvider userSessionProvider)
    : BaseApiController(userSessionProvider)
{
    /// <summary>
    /// Gets all thought modules
    /// </summary>
    [HttpGet]
    [ProducesResponseType<IEnumerable<ThoughtModuleDto>>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<IEnumerable<ThoughtModuleDto>>> Get()
    {
        var user = HttpContext.GetCurrentUser();
        var result = await thoughtModuleService.GetThoughtModules();
        return Ok(result.Results);
    }
}
