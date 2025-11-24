using BucketOfThoughts.Api.Extensions;
using BucketOfThoughts.Api.Objects;
using BucketOfThoughts.Services;
using BucketOfThoughts.Services.Mappings;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace BucketOfThoughts.Api.Controllers;

/// <summary>
/// Thoughts API controller
/// </summary>
public class ThoughtsController(IThoughtService thoughtService, IUserSessionProvider userSessionProvider) : BaseApiController(userSessionProvider)
{
    /// <summary>
    /// Gets list of thoughts
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    [ProducesResponseType<IEnumerable<ThoughtDto>>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<IEnumerable<ThoughtDto>>> Get()
    {
        userSessionProvider.SetCurrentUser(HttpContext.GetCurrentUser());
        var serviceResult = await thoughtService.GetThoughts();
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
    /// Gets thought by Id
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet("{id}")]
    [ProducesResponseType<ThoughtDto>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<ThoughtDto>> GetById(long id)
    {
        userSessionProvider.SetCurrentUser(HttpContext.GetCurrentUser());
        var serviceResult = await thoughtService.GetThoughtById(id);
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
    /// Inserts new thought
    /// </summary>
    /// <param name="thought"></param>
    /// <returns></returns>
    [HttpPost]
    [ProducesResponseType<ThoughtDto>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<ThoughtDto>> Post(ThoughtDto thought)
    {
        userSessionProvider.SetCurrentUser(HttpContext.GetCurrentUser());
        var serviceResult = await thoughtService.AddThought(thought);
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
    /// Updates existing thought
    /// </summary>
    /// <param name="thought"></param>
    /// <returns></returns>
    [HttpPut]
    [ProducesResponseType<ThoughtDto>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<ThoughtDto>> Put(ThoughtDto thought)
    {
        userSessionProvider.SetCurrentUser(HttpContext.GetCurrentUser());
        var serviceResult = await thoughtService.UpdateThought(thought);
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
    /// Soft deletes existing thought
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpDelete]
    [ProducesResponseType((int)HttpStatusCode.OK)]
    public async Task<ActionResult> Delete(long id)
    {
        userSessionProvider.SetCurrentUser(HttpContext.GetCurrentUser());
        var serviceResult = await thoughtService.DeleteThought(id);
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
