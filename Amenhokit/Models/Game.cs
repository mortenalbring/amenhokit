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

        public DateTime ShiftedDate(int gameNumber=0)
        {
            var output = Date;

            if (Date.DayOfWeek == DayOfWeek.Tuesday)
            {
                output = new DateTime(Date.Year, Date.Month, Date.Day, 20, 0, 0);
            }
            else
            {                
                int daysSinceTuesday = ((int)DayOfWeek.Tuesday - (int)Date.DayOfWeek - 7) % 7;
                var dateOnTuesday = Date.AddDays(daysSinceTuesday);
                output = new DateTime(dateOnTuesday.Year, dateOnTuesday.Month, dateOnTuesday.Day, 20, 0, 0);                
            }

            if (gameNumber == 0) return output;
            var shiftedMinutes = 30*(gameNumber-1);
            output = output.AddMinutes(shiftedMinutes);


            return output;
        }
    }
}