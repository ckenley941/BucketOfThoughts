using BucketOfThoughts.Common.Interfaces;
using BucketOfThoughts.Common.Logging;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BucketOfThoughts.Api.Controllers
{
    [ApiController]
    public class ApiControllerBase : ControllerBase
    {
        private readonly ILoggerManager _logger;
        public ApiControllerBase(ILoggerManager logger)
        {
            _logger = logger;
            _logger.LogDebug("Here is debug message from the controller.");
        }
    }
}
