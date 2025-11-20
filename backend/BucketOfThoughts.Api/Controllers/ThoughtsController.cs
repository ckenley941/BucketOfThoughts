using BucketOfThoughts.Services;
using BucketOfThoughts.Services.Models;
using Microsoft.AspNetCore.Mvc;

namespace BucketOfThoughts.Api.Controllers
{
    public class ThoughtsController
    {
        private readonly ILogger<ThoughtsController> _logger;
        private readonly IThoughtService _thoughtService;

        public ThoughtsController(ILogger<ThoughtsController> logger, IThoughtService thoughtService)
        {
            _logger = logger;
            _thoughtService  = thoughtService;
        }

        [HttpGet]
        public async Task<ServiceResponse<ThoughtModel>> Get()
        {
            var apiResponse = new ServiceResponse<ThoughtModel>
            {
                Results = [await _thoughtService.GetByIdAsync(1)]
            };
            return apiResponse;
        }
    }
}
