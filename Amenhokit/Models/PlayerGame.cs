using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Amenhokit.Models
{
    public class PlayerGame
    {
        public int ID { get; set; }
        public int PlayerID { get; set; }
        public int GameID { get; set; }
        public int GameNumber { get; set; }
        public int TotalScore { get; set; }
    }
}