using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BucketOfThoughts.Api.DTOs;
using BucketOfThoughts.Common.Enums;
using BucketOfThoughts.Common.Interfaces;
using BucketOfThoughts.Data.Contexts;
using BucketOfThoughts.Data.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace BucketOfThoughts.Api.Controllers.Shared
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardsController : ApiControllerBase
    {
        private readonly IMemoryCache _cache;
        private readonly BucketOfThoughtsContext _context;
        public DashboardsController(ILoggerManager logger, IMemoryCache cache, BucketOfThoughtsContext context) : base(logger)
        {
            _context = context;
            _cache = cache;
        }

        [HttpGet, Route("GetRandomThought")]
        public async Task<ActionResult<Thought>> GetRandomThought()
        {
            //Eventually cache whats been done
            var thoughts = _context.Thought
                .Include(x => x.ThoughtDetail)
                .Include(x => x.ThoughtCategory)
                .Include(x => x.ThoughtFile)
                .ToList();
            if (thoughts?.Count <= 0)
            {
                return Content("No thoughts found.");
            }
            var rand = new Random();
            return thoughts[rand.Next(thoughts.Count)];
        }

        [HttpGet, Route("GetStateFact")]
        public async Task<ActionResult<StateFactDto>> GetStateFact()
        {
            var states = _context.State.ToList();
            if (states?.Count <= 0)
            {
                return Content("No states found.");
            }
            var rand = new Random();
            var state = states[rand.Next(states.Count)];
            string randomDashboardColumn = GetRandomDashboardColumn(DashboardPanels.StateFact);

            var stateFact = new StateFactDto()
            {
                StateId = state.StateId,
                FactTitle = $"{state.Name} Population",
                FactDetails = state.Population?.ToString()
            };

            if (!string.IsNullOrEmpty(randomDashboardColumn))
            {
                stateFact.FactTitle = $"{state.Name} {randomDashboardColumn}";
                stateFact.FactDetails = state.GetType().GetProperty(randomDashboardColumn).GetValue(state)?.ToString();
            }

            return Ok(stateFact);
        }

        [HttpGet, Route("GetRandomShow")]
        public async Task<ActionResult<Show>> GetRandomShow()
        {
            var shows = _context.Show
                .Include(x => x.Band)
                .Include(x => x.MusicVenue)
                .ToList();
            if (shows?.Count <= 0)
            {
                return Content("No shows found.");
            }
            var rand = new Random();
            return shows[rand.Next(shows.Count)];
        }

        //Eventually move to service or helper and cache whats been done
        private string GetRandomDashboardColumn(DashboardPanels dashboardPanel)
        {
            var availableColumns = new List<string>();
            switch (dashboardPanel)
            {
                case DashboardPanels.StateFact:
                    availableColumns = new List<string>()
                    {
                        nameof(State.Bird),
                        nameof(State.Capital),
                        nameof(State.DateOfStatehood),
                        nameof(State.Economy),
                        nameof(State.FamousFor),
                        nameof(State.Flower),
                        nameof(State.Geography),
                        nameof(State.LargestCities),
                        nameof(State.NationalParks),
                        nameof(State.Nickname),
                        nameof(State.PlantAndAnimal),
                        nameof(State.Population),
                        nameof(State.PrimaryHighways),
                        nameof(State.Size),
                        nameof(State.StateParks),
                        nameof(State.Tourism),
                        nameof(State.Tree)
                    };
                    break;
                default:
                    break;
            }
            string dashboardColumn = null;
            if (availableColumns.Count > 0)
            {
                Random rand = new Random();
                dashboardColumn = availableColumns[rand.Next(availableColumns.Count)];
            }
            return dashboardColumn;
        }
    }
}