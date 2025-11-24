using BucketOfThoughts.Api.Extensions;
using BucketOfThoughts.Services;
using BucketOfThoughts.Services.Mappings;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace BucketOfThoughts.Api.Controllers;

/// <summary>
/// ThoughtBuckets API controller
/// </summary>
public class ThoughtBucketsController(IThoughtBucketService thoughtBucketService, IUserSessionProvider userSessionProvider) : BaseApiController(userSessionProvider)
{
    /// <summary>
    /// Gets list of thought buckets
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    [ProducesResponseType<IEnumerable<ThoughtBucketDto>>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<IEnumerable<ThoughtBucketDto>>> Get()
    {
        var user = HttpContext.GetCurrentUser();
        var thoughtBuckets = await thoughtBucketService.GetThoughtBuckets();
        return Ok(thoughtBuckets.Results);
    }

    /// <summary>
    /// Gets thought bucket by id
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet("{id}")]
    [ProducesResponseType<ThoughtBucketDto>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<ThoughtBucketDto>> GetById(long id)
    {
        var user = HttpContext.GetCurrentUser();
        var result = await thoughtBucketService.GetThoughtBucketById(id);
        return Ok(result.SingleResult);
    }

    /// <summary>
    /// Adds new thought bucket
    /// </summary>
    /// <param name="thoughtBucket"></param>
    /// <returns></returns>
    [HttpPost]
    [ProducesResponseType<ThoughtBucketDto>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<ThoughtBucketDto>> Post(ThoughtBucketDto thoughtBucket)
    {
        var user = HttpContext.GetCurrentUser();
        var result = await thoughtBucketService.AddThoughtBucket(thoughtBucket);
        return Ok(result.SingleResult);
    }

    /// <summary>
    /// Updates thought bucket
    /// </summary>
    /// <param name="thoughtBucket"></param>
    /// <returns></returns>
    [HttpPut]
    [ProducesResponseType<ThoughtBucketDto>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<ThoughtBucketDto>> Put(ThoughtBucketDto thoughtBucket)
    {
        var user = HttpContext.GetCurrentUser();
        var result = await thoughtBucketService.UpdateThoughtBucket(thoughtBucket);
        return Ok(result.SingleResult);
    }

    /// <summary>
    /// Soft deletes thought bucket
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpDelete("{id}")]
    [ProducesResponseType<bool>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<bool>> Delete(long id)
    {
        var success = await thoughtBucketService.DeleteThoughtBucket(id);
        return Ok(success);
    }
}




