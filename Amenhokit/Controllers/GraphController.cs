using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Amenhokit.Models;
using Amenhokit.Models.ViewModel;

namespace Amenhokit.Controllers
{
    public class GraphController : Controller
    {

        // private DataContext db = new DataContext();
        //
        // GET: /Graph/

        private static readonly long UnixEpochTicks = (new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).Ticks;

        public static long? ToJsonTicks(DateTime? value)
        {
            return value == null ? (long?)null : (value.Value.ToUniversalTime().Ticks - UnixEpochTicks) / 10000;
        }

        public static long ToJsonTicks(DateTime value)
        {
            return (value.ToUniversalTime().Ticks - UnixEpochTicks) / 10000;
        }


        public string PlayerScoreData(int ID)
        {
            using (var db = new DataContext())
            {
                var player = db.Player.FirstOrDefault(e => e.ID == ID);
                var games = db.Game.ToList();

                var viewmodel = new List<PlayerScore>();

                var scores = db.PlayerGame.Where(e => e.PlayerID == player.ID);

                foreach (var s in scores)
                {
                    var game = games.FirstOrDefault(e => e.ID == s.GameID);

                    if (game != null)
                    {
                        var pscore = new PlayerScore
                        {
                            Date = game.Date,
                            DateString = game.Date.ToString(),
                            Player = player,
                            GameID = s.GameID,
                            TotalScore = s.TotalScore
                        };

                        viewmodel.Add(pscore);
                    }


                }

                JavaScriptSerializer js = new JavaScriptSerializer();

                var c = js.Serialize(viewmodel);

                return c;
            }

        }

        public ActionResult Index()
        {
            using (var db = new DataContext())
            {

                var players = db.Player.Where(e => e.ID == 1).ToList();


                var games = db.Game.ToList();

                var viewmodel = new List<PlayerScore>();

                foreach (var p in players)
                {
                    var scores = db.PlayerGame.Where(e => e.PlayerID == p.ID);

                    foreach (var s in scores)
                    {
                        var game = games.FirstOrDefault(e => e.ID == s.GameID);

                        if (game != null)
                        {
                            var pscore = new PlayerScore
                            {
                                Date = game.Date,
                                DateString = game.Date.ToString(),
                                Player = p,
                                GameID = s.GameID,
                                TotalScore = s.TotalScore
                            };

                            viewmodel.Add(pscore);
                        }
                    }

                }


                return View(viewmodel);
            }
        }

    }
}
