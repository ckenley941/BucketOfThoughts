using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BucketOfThoughts.Data.Entities;
using BucketOfThoughts.Data.Contexts;

namespace BucketOfThoughts.Api.Controllers.Shared
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimelinesController : ControllerBase
    {
        private readonly BucketOfThoughtsContext _context;

        public TimelinesController(BucketOfThoughtsContext context)
        {
            _context = context;
        }

        // GET: api/Timelines
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Timeline>>> GetTimeline()
        {
            return await _context.Timeline.ToListAsync();
        }

        // GET: api/Timelines/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Timeline>> GetTimeline(int id)
        {
            var timeline = await _context.Timeline.FindAsync(id);

            if (timeline == null)
            {
                return NotFound();
            }

            return timeline;
        }

        // PUT: api/Timelines/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTimeline(int id, Timeline timeline)
        {
            if (id != timeline.TimelineId)
            {
                return BadRequest();
            }

            _context.Entry(timeline).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TimelineExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Timelines
        [HttpPost]
        public async Task<ActionResult<Timeline>> PostTimeline(Timeline timeline)
        {
            _context.Timeline.Add(timeline);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTimeline", new { id = timeline.TimelineId }, timeline);
        }

        // DELETE: api/Timelines/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Timeline>> DeleteTimeline(int id)
        {
            var timeline = await _context.Timeline.FindAsync(id);
            if (timeline == null)
            {
                return NotFound();
            }

            _context.Timeline.Remove(timeline);
            await _context.SaveChangesAsync();

            return timeline;
        }

        private bool TimelineExists(int id)
        {
            return _context.Timeline.Any(e => e.TimelineId == id);
        }
    }
}
