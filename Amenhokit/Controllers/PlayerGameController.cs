using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Amenhokit.Models;

namespace Amenhokit.Controllers
{
    public class PlayerGameController : Controller
    {
        private DataContext db = new DataContext();



        //
        // GET: /PlayerGame/

        public ActionResult Index()
        {
            return View(db.PlayerGame.ToList());
        }

        //
        // GET: /PlayerGame/Details/5

        public ActionResult Details(int id = 0)
        {
            PlayerGame playergame = db.PlayerGame.Find(id);
            if (playergame == null)
            {
                return HttpNotFound();
            }
            return View(playergame);
        }

        //
        // GET: /PlayerGame/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /PlayerGame/Create

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(PlayerGame playergame)
        {
            if (ModelState.IsValid)
            {
                db.PlayerGame.Add(playergame);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(playergame);
        }

        //
        // GET: /PlayerGame/Edit/5

        public ActionResult Edit(int id = 0)
        {
            PlayerGame playergame = db.PlayerGame.Find(id);
            if (playergame == null)
            {
                return HttpNotFound();
            }
            return View(playergame);
        }

        //
        // POST: /PlayerGame/Edit/5

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(PlayerGame playergame)
        {
            if (ModelState.IsValid)
            {
                db.Entry(playergame).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(playergame);
        }

        //
        // GET: /PlayerGame/Delete/5

        public ActionResult Delete(int id = 0)
        {
            PlayerGame playergame = db.PlayerGame.Find(id);
            if (playergame == null)
            {
                return HttpNotFound();
            }
            return View(playergame);
        }

        //
        // POST: /PlayerGame/Delete/5

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            PlayerGame playergame = db.PlayerGame.Find(id);
            db.PlayerGame.Remove(playergame);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}