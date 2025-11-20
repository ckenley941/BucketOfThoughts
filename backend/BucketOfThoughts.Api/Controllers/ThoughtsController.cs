using BucketOfThoughts.Api.Extensions;
using BucketOfThoughts.Api.Objects;
using BucketOfThoughts.Services;
using BucketOfThoughts.Services.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace BucketOfThoughts.Api.Controllers;

/// <summary>
/// Thoughts API controller
/// </summary>
[Route("api/[controller]")]
public class ThoughtsController(IThoughtService thoughtService) : BaseApiController
{
    [HttpGet]
    [ProducesResponseType<IEnumerable<ThoughtDto>>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<IEnumerable<ThoughtDto>>> Get()
    {
        var user = HttpContext.GetCurrentUser();
        var thoughts = await thoughtService.GetThoughts();
        return Ok(thoughts.Results);
    }

    [HttpPost]
    [ProducesResponseType<ThoughtDto>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<ThoughtDto>> Post(ThoughtDto thought)
    {
        var user = HttpContext.GetCurrentUser();
        var newThought = await thoughtService.AddThought(thought);
        return Ok(newThought.Results.First());
    }

    [HttpPut]
    [ProducesResponseType<ThoughtDto>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<ThoughtDto>> Put(ThoughtDto thought)
    {
        var user = HttpContext.GetCurrentUser();
        var newThought = await thoughtService.UpdateThought(thought);
        return Ok(newThought.Results.First());
    }

    [HttpDelete]
    [ProducesResponseType<bool>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<bool>> Delete(long id)
    {
        var success = await thoughtService.DeleteThought(id);
        return Ok(success);
    }
}
