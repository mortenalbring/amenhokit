using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Amenhokit.Models
{
    public class Game
    {
        public int ID { get; set; }
        public int Lane { get; set; }

        private DateTime? dateCreated = null;

        [Column(TypeName = "DateTime2")]
        public DateTime Date
        {
            get
            {
                return dateCreated.HasValue
                   ? dateCreated.Value
                   : DateTime.Now;
            }

            set { dateCreated = value; }
        }
    }
}