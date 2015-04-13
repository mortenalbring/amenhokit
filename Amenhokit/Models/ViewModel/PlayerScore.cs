using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Amenhokit.Models.ViewModel
{
    public class PlayerScore
    {
        public DateTime Date { get; set; }
        public Player Player { get; set; }
        public int GameID { get; set; }
        public int TotalScore { get; set; }
    }
}