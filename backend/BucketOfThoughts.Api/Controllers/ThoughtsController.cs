using BucketOfThoughts.Api.Extensions;
using BucketOfThoughts.Services;
using BucketOfThoughts.Services.Mappings;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace BucketOfThoughts.Api.Controllers;

/// <summary>
/// Thoughts API controller
/// </summary>
public class ThoughtsController(IThoughtService thoughtService) : BaseApiController
{
    /// <summary>
    /// Gets list of thoughts
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    [ProducesResponseType<IEnumerable<ThoughtDto>>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<IEnumerable<ThoughtDto>>> Get()
    {
        thoughtService.LoginProfileId = HttpContext.GetCurrentUser().LoginProfileId;
        var thoughts = await thoughtService.GetThoughts();
        return Ok(thoughts.Results);
    }

    /// <summary>
    /// Gets thought by Id
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet("{id}")]
    [ProducesResponseType<ThoughtDto>((int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.NotFound)]
    public async Task<ActionResult<ThoughtDto>> GetById(long id)
    {
        var user = HttpContext.GetCurrentUser();
        var result = await thoughtService.GetThoughtById(id);
        return Ok(result.Results.First());
    }

    /// <summary>
    /// Inserts new thought
    /// </summary>
    /// <param name="thought"></param>
    /// <returns></returns>
    [HttpPost]
    [ProducesResponseType<ThoughtDto>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<ThoughtDto>> Post(ThoughtDto thought)
    {
        var user = HttpContext.GetCurrentUser();
        var newThought = await thoughtService.AddThought(thought);
        return Ok(newThought.Results.First());
    }

    /// <summary>
    /// Updates existing thought
    /// </summary>
    /// <param name="thought"></param>
    /// <returns></returns>
    [HttpPut]
    [ProducesResponseType<ThoughtDto>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<ThoughtDto>> Put(ThoughtDto thought)
    {
        var user = HttpContext.GetCurrentUser();
        var newThought = await thoughtService.UpdateThought(thought);
        return Ok(newThought.Results.First());
    }

    /// <summary>
    /// Soft deletes existing thought
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpDelete]
    [ProducesResponseType<bool>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<bool>> Delete(long id)
    {
        var success = await thoughtService.DeleteThought(id);
        return Ok(success);
    }
}
