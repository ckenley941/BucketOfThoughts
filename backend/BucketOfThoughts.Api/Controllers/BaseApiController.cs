using BucketOfThoughts.Api.Extensions;
using BucketOfThoughts.Api.Objects;
using BucketOfThoughts.Services;
using BucketOfThoughts.Services.Objects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace BucketOfThoughts.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    [ProducesResponseType<ErrorResponse>((int)HttpStatusCode.Unauthorized)]
    [ProducesResponseType<ErrorResponse>((int)HttpStatusCode.InternalServerError)]
    public abstract class BaseApiController : ControllerBase
    {
        protected CurrentUserSession CurrentUser => HttpContext.GetCurrentUser();
        protected readonly IUserSessionProvider userSessionProvider;
        protected BaseApiController(IUserSessionProvider userSessionProvider)
        {
            this.userSessionProvider = userSessionProvider;
        }

        protected async Task SetUserSession()
        {
            userSessionProvider.SetCurrentUser(CurrentUser);
        }

    }
}
