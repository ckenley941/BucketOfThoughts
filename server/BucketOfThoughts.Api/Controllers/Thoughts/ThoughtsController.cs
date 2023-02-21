using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BucketOfThoughts.Data.Entities;
using BucketOfThoughts.Common.Interfaces;
using AutoMapper;
using BucketOfThoughts.Api.DTOs;
using BucketOfThoughts.Data.Contexts;

namespace BucketOfThoughts.Api.Controllers.Thoughts
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThoughtsController : ApiControllerBase
    {
        private readonly BucketOfThoughtsContext _context;
        private readonly IMapper _mapper;

        public ThoughtsController(ILoggerManager logger, IMapper mapper, BucketOfThoughtsContext context) : base(logger)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Thoughts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Thought>>> GetThoughts()
        {
            var a = await _context.Thought.Include(x => x.ThoughtCategory).ToListAsync(); 
            return a;
        }

        // GET: api/Thoughts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Thought>> GetThought(int id)
        {
            var thought = await _context.Thought.Include(x => x.ThoughtCategory).Include(x => x.ThoughtDetail)
            .FirstOrDefaultAsync(x => x.ThoughtId == id);
            if (thought == null)
            {
                return NotFound();
            }

            return thought;
        }

        // PUT: api/Thoughts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutThought(int id, Thought thought)
        {
            if (id != thought.ThoughtId)
            {
                return BadRequest();
            }

            _context.Entry(thought).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ThoughtExists(id))
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

        [HttpPost]
        public async Task<ActionResult<Thought>> PostThought(ThoughtCreateDto thoughtCreateDto)
        {
            Thought thought = _mapper.Map<Thought>(thoughtCreateDto);
            _context.Thought.Add(thought);
           
            if (thoughtCreateDto.Timeline.Exists)
            {
                Timeline timeline = _mapper.Map<Timeline>(thoughtCreateDto.Timeline);
                thought.ThoughtTimeline.Add(new ThoughtTimeline() { Timeline = timeline });
            }
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetThought", new { id = thought.ThoughtId }, thought);
        }

        // DELETE: api/Thoughts/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Thought>> DeleteThought(int id)
        {
            var thought = await _context.Thought.FindAsync(id);
            if (thought == null)
            {
                return NotFound();
            }

            _context.Thought.Remove(thought);
            await _context.SaveChangesAsync();

            return thought;
        }

        private bool ThoughtExists(int id)
        {
            return _context.Thought.Any(e => e.ThoughtId == id);
        }
    }
}
