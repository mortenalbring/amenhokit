using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Amenhokit.Models;
using Amenhokit.Models.ViewModel;

namespace Amenhokit.Controllers
{
    public class GraphController : Controller
    {

        private DataContext db = new DataContext();
        //
        // GET: /Graph/

        public ActionResult Index()
        {
            var players = db.Player.ToList();

            var viewmodel = new List<PlayerScore>();

            foreach (var p in players)
            {
                var scores = db.PlayerGame.Where(e => e.PlayerID == p.ID);

                foreach (var s in scores)
                {
                    var pscore = new PlayerScore {Player = p, GameID = s.GameID, TotalScore = s.TotalScore};

                    viewmodel.Add(pscore);
                }

            }


            return View(viewmodel);
        }

    }
}
