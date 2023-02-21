using System;
using System.Collections.Generic;

namespace BucketOfThoughts.Data.Entities
{
    public partial class State
    {
        public State()
        {
            StateFunFact = new HashSet<StateFunFact>();
            StateMountain = new HashSet<StateMountain>();
        }

        public int StateId { get; set; }
        public Guid StateGuid { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public DateTime RecordDateTime { get; set; }
        public string Name { get; set; }
        public string Abbreviation { get; set; }
        public string Capital { get; set; }
        public DateTime? DateOfStatehood { get; set; }
        public int? Size { get; set; }
        public int? Population { get; set; }
        public string LargestCities { get; set; }
        public string Nickname { get; set; }
        public string Tree { get; set; }
        public string Flower { get; set; }
        public string Bird { get; set; }
        public string Geography { get; set; }
        public string Economy { get; set; }
        public string PlantAndAnimal { get; set; }
        public string Tourism { get; set; }
        public string FamousFor { get; set; }
        public string PrimaryHighways { get; set; }
        public string NationalParks { get; set; }
        public string StateParks { get; set; }

        public virtual ICollection<StateFunFact> StateFunFact { get; set; }
        public virtual ICollection<StateMountain> StateMountain { get; set; }
    }
}
