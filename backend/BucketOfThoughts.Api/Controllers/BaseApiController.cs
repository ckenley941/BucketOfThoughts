using BucketOfThoughts.Api.Objects;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace BucketOfThoughts.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [ProducesResponseType<ErrorResponse>((int)HttpStatusCode.Unauthorized)]
    [ProducesResponseType<ErrorResponse>((int)HttpStatusCode.InternalServerError)]
    public class BaseApiController : ControllerBase
    {
    }
}
