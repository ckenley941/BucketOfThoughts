using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BucketOfThoughts.Data.Entities;
using BucketOfThoughts.Data.Contexts;

namespace BucketOfThoughts.Api.Controllers.Thoughts
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThoughtCategoriesController : ControllerBase
    {
        private readonly BucketOfThoughtsContext _context;

        public ThoughtCategoriesController(BucketOfThoughtsContext context)
        {
            _context = context;
        }

        // GET: api/ThoughtCategories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ThoughtCategory>>> GetThoughtCategories()
        {
            return await _context.ThoughtCategory.ToListAsync();
        }

        // GET: api/ThoughtCategories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ThoughtCategory>> GetThoughtCategory(int id)
        {
            var thoughtCategory = await _context.ThoughtCategory.FindAsync(id);

            if (thoughtCategory == null)
            {
                return NotFound();
            }

            return thoughtCategory;
        }

        // PUT: api/ThoughtCategories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutThoughtCategory(int id, ThoughtCategory thoughtCategory)
        {
            if (id != thoughtCategory.ThoughtCategoryId)
            {
                return BadRequest();
            }

            _context.Entry(thoughtCategory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ThoughtCategoryExists(id))
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

        // POST: api/ThoughtCategories
        [HttpPost]
        public async Task<ActionResult<ThoughtCategory>> PostThoughtCategory(ThoughtCategory thoughtCategory)
        {
            _context.ThoughtCategory.Add(thoughtCategory);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetThoughtCategory", new { id = thoughtCategory.ThoughtCategoryId }, thoughtCategory);
        }

        // DELETE: api/ThoughtCategories/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ThoughtCategory>> DeleteThoughtCategory(int id)
        {
            var thoughtCategory = await _context.ThoughtCategory.FindAsync(id);
            if (thoughtCategory == null)
            {
                return NotFound();
            }

            _context.ThoughtCategory.Remove(thoughtCategory);
            await _context.SaveChangesAsync();

            return thoughtCategory;
        }

        private bool ThoughtCategoryExists(int id)
        {
            return _context.ThoughtCategory.Any(e => e.ThoughtCategoryId == id);
        }
    }
}
