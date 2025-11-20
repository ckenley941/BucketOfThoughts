using BucketOfThoughts.Api.Objects;
using BucketOfThoughts.Services;
using BucketOfThoughts.Services.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BucketOfThoughts.Api.Controllers;

/// <summary>
/// Thoughts API controller
/// </summary>
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ThoughtsController(IThoughtService thoughtService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<ThoughtDto>>> Get()
    {
        var user = new CurrentUser(User);
        var auth0Id = User.Auth0Id();
        var apiResponse = new ApiResponse<ThoughtDto>
        {
            Results = await thoughtService.GetThoughts()
        };
        return Ok(apiResponse);
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ThoughtDto>>> Post(ThoughtDto thought)
    {
        var user = new CurrentUser(User);
        var auth0Id = User.Auth0Id();
        var newThought = await thoughtService.AddThought(thought);

        var apiResponse = new ApiResponse<ThoughtDto>
        {
            Results = new List<ThoughtDto> { newThought }
        };
        return Ok(apiResponse);
    }
}
