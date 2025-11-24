using BucketOfThoughts.Api.Extensions;
using BucketOfThoughts.Api.Objects;
using BucketOfThoughts.Services;
using BucketOfThoughts.Services.Mappings;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace BucketOfThoughts.Api.Controllers;

/// <summary>
/// ThoughtWebsiteLinks API controller
/// </summary>
public class ThoughtWebsiteLinksController(IThoughtWebsiteLinkService thoughtWebsiteLinkService, IUserSessionProvider userSessionProvider) : BaseApiController(userSessionProvider)
{
    /// <summary>
    /// Gets list of thought website links
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    [ProducesResponseType<IEnumerable<ThoughtWebsiteLinkDto>>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<IEnumerable<ThoughtWebsiteLinkDto>>> Get()
    {
        userSessionProvider.SetCurrentUser(HttpContext.GetCurrentUser());
        var serviceResult = await thoughtWebsiteLinkService.GetThoughtWebsiteLinks();
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
    /// Gets thought website links by thought Id
    /// </summary>
    /// <param name="thoughtId"></param>
    /// <returns></returns>
    [HttpGet("thought/{thoughtId}")]
    [ProducesResponseType<IEnumerable<ThoughtWebsiteLinkDto>>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<IEnumerable<ThoughtWebsiteLinkDto>>> GetByThoughtId(long thoughtId)
    {
        userSessionProvider.SetCurrentUser(HttpContext.GetCurrentUser());
        var serviceResult = await thoughtWebsiteLinkService.GetThoughtWebsiteLinksByThoughtId(thoughtId);
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
    /// Gets thought website link by thought Id and website link Id
    /// </summary>
    /// <param name="thoughtId"></param>
    /// <param name="websiteLinkId"></param>
    /// <returns></returns>
    [HttpGet("thought/{thoughtId}/websiteLink/{websiteLinkId}")]
    [ProducesResponseType<ThoughtWebsiteLinkDto>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<ThoughtWebsiteLinkDto>> GetByThoughtAndWebsiteLink(long thoughtId, long websiteLinkId)
    {
        userSessionProvider.SetCurrentUser(HttpContext.GetCurrentUser());
        var serviceResult = await thoughtWebsiteLinkService.GetThoughtWebsiteLink(thoughtId, websiteLinkId);
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
    /// Inserts new thought website link
    /// </summary>
    /// <param name="thoughtWebsiteLink"></param>
    /// <returns></returns>
    [HttpPost]
    [ProducesResponseType<ThoughtWebsiteLinkDto>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<ThoughtWebsiteLinkDto>> Post(ThoughtWebsiteLinkDto thoughtWebsiteLink)
    {
        userSessionProvider.SetCurrentUser(HttpContext.GetCurrentUser());
        var serviceResult = await thoughtWebsiteLinkService.AddThoughtWebsiteLink(thoughtWebsiteLink);
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
    /// Updates existing thought website link
    /// </summary>
    /// <param name="thoughtWebsiteLink"></param>
    /// <returns></returns>
    [HttpPut]
    [ProducesResponseType<ThoughtWebsiteLinkDto>((int)HttpStatusCode.OK)]
    public async Task<ActionResult<ThoughtWebsiteLinkDto>> Put(ThoughtWebsiteLinkDto thoughtWebsiteLink)
    {
        userSessionProvider.SetCurrentUser(HttpContext.GetCurrentUser());
        var serviceResult = await thoughtWebsiteLinkService.UpdateThoughtWebsiteLink(thoughtWebsiteLink);
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
    /// Soft deletes existing thought website link
    /// </summary>
    /// <param name="thoughtId"></param>
    /// <param name="websiteLinkId"></param>
    /// <returns></returns>
    [HttpDelete("thought/{thoughtId}/websiteLink/{websiteLinkId}")]
    [ProducesResponseType((int)HttpStatusCode.OK)]
    public async Task<ActionResult> Delete(long thoughtId, long websiteLinkId)
    {
        userSessionProvider.SetCurrentUser(HttpContext.GetCurrentUser());
        var serviceResult = await thoughtWebsiteLinkService.DeleteThoughtWebsiteLink(thoughtId, websiteLinkId);
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

