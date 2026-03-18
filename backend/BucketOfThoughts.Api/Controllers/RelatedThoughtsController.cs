using BucketOfThoughts.Api.Extensions;
using BucketOfThoughts.Api.Objects;
using BucketOfThoughts.Services;
using BucketOfThoughts.Services.Mappings;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace BucketOfThoughts.Api.Controllers;

/// <summary>
/// RelatedThoughts API controller
/// </summary>
public class RelatedThoughtsController(IRelatedThoughtsService relatedThoughtsService, IUserSessionProvider userSessionProvider) : BaseApiController(userSessionProvider)
{
    /// <summary>
    /// Gets list of related thoughts for a parent thought
    /// </summary>
    /// <param name="parentThoughtId">The parent thought ID</param>
    /// <returns></returns>
    [HttpGet("thought/{parentThoughtId}")]
    [ProducesResponseType<IEnumerable<RelatedThoughtDto>>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<IEnumerable<RelatedThoughtDto>>> GetByParentThoughtId(long parentThoughtId)
    {
        userSessionProvider.SetCurrentUser(HttpContext.GetCurrentUser());
        var serviceResult = await relatedThoughtsService.GetRelatedThoughts(parentThoughtId);
        if (serviceResult.IsSuccess)
        {
            return Ok(serviceResult.Results);
        }
        else
        {
            await Response.WriteErrorResponse(new ErrorResponse(serviceResult.StatusCode, serviceResult.ErrorMessage));
            return new EmptyResult();
        }
    }

    /// <summary>
    /// Adds a new related thought
    /// </summary>
    /// <param name="relatedThought"></param>
    /// <returns></returns>
    [HttpPost]
    [ProducesResponseType<RelatedThoughtDto>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<RelatedThoughtDto>> Post(RelatedThoughtDto relatedThought)
    {
        userSessionProvider.SetCurrentUser(HttpContext.GetCurrentUser());
        var serviceResult = await relatedThoughtsService.AddRelatedThought(relatedThought);
        if (serviceResult.IsSuccess)
        {
            return Ok(serviceResult.SingleResult);
        }
        else
        {
            await Response.WriteErrorResponse(new ErrorResponse(serviceResult.StatusCode, serviceResult.ErrorMessage));
            return new EmptyResult();
        }
    }

    /// <summary>
    /// Deletes a related thought
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpDelete("{id}")]
    [ProducesResponseType((int)HttpStatusCode.OK)]
    public async Task<ActionResult> Delete(long id)
    {
        userSessionProvider.SetCurrentUser(HttpContext.GetCurrentUser());
        var serviceResult = await relatedThoughtsService.DeleteRelatedThought(id);
        if (serviceResult.IsSuccess)
        {
            return Ok();
        }
        else
        {
            await Response.WriteErrorResponse(new ErrorResponse(serviceResult.StatusCode, serviceResult.ErrorMessage));
            return new EmptyResult();
        }
    }
}
