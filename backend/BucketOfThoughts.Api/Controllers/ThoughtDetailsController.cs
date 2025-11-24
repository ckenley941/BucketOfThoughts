using BucketOfThoughts.Api.Extensions;
using BucketOfThoughts.Api.Objects;
using BucketOfThoughts.Services;
using BucketOfThoughts.Services.Mappings;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace BucketOfThoughts.Api.Controllers;

/// <summary>
/// ThoughtDetails API controller
/// </summary>
public class ThoughtDetailsController(IThoughtDetailService thoughtDetailService, IUserSessionProvider userSessionProvider) : BaseApiController(userSessionProvider)
{
    /// <summary>
    /// Gets list of thought details
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    [ProducesResponseType<IEnumerable<ThoughtDetailDto>>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<IEnumerable<ThoughtDetailDto>>> Get()
    {
        userSessionProvider.SetCurrentUser(HttpContext.GetCurrentUser());
        var serviceResult = await thoughtDetailService.GetThoughtDetails();
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
    /// Gets thought details by thought Id
    /// </summary>
    /// <param name="thoughtId"></param>
    /// <returns></returns>
    [HttpGet("thought/{thoughtId}")]
    [ProducesResponseType<IEnumerable<ThoughtDetailDto>>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<IEnumerable<ThoughtDetailDto>>> GetByThoughtId(long thoughtId)
    {
        userSessionProvider.SetCurrentUser(HttpContext.GetCurrentUser());
        var serviceResult = await thoughtDetailService.GetThoughtDetailsByThoughtId(thoughtId);
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
    /// Gets thought detail by Id
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet("{id}")]
    [ProducesResponseType<ThoughtDetailDto>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<ThoughtDetailDto>> GetById(long id)
    {
        userSessionProvider.SetCurrentUser(HttpContext.GetCurrentUser());
        var serviceResult = await thoughtDetailService.GetThoughtDetailById(id);
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
    /// Inserts new thought detail
    /// </summary>
    /// <param name="thoughtDetail"></param>
    /// <returns></returns>
    [HttpPost]
    [ProducesResponseType<ThoughtDetailDto>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<ThoughtDetailDto>> Post(ThoughtDetailDto thoughtDetail)
    {
        userSessionProvider.SetCurrentUser(HttpContext.GetCurrentUser());
        var serviceResult = await thoughtDetailService.AddThoughtDetail(thoughtDetail);
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
    /// Updates existing thought detail
    /// </summary>
    /// <param name="thoughtDetail"></param>
    /// <returns></returns>
    [HttpPut]
    [ProducesResponseType<ThoughtDetailDto>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<ThoughtDetailDto>> Put(ThoughtDetailDto thoughtDetail)
    {
        userSessionProvider.SetCurrentUser(HttpContext.GetCurrentUser());
        var serviceResult = await thoughtDetailService.UpdateThoughtDetail(thoughtDetail);
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
    /// Soft deletes existing thought detail
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpDelete("{id}")]
    [ProducesResponseType((int)HttpStatusCode.OK)]
    public async Task<ActionResult> Delete(long id)
    {
        userSessionProvider.SetCurrentUser(HttpContext.GetCurrentUser());
        var serviceResult = await thoughtDetailService.DeleteThoughtDetail(id);
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

