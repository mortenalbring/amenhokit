﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Amenhokit.Models;

namespace Amenhokit.Controllers
{
    public class PlayerController : Controller
    {
        private DataContext db = new DataContext();

        public ActionResult GetPlayerList()
        {
            var allPlayers = db.Player.ToList();

            return PartialView("PlayerList", allPlayers);

        }

        //
        // GET: /Player/

        public ActionResult Index()
        {
            return View(db.Player.ToList());
        }

        //
        // GET: /Player/Details/5

        public ActionResult Details(int id = 0)
        {
            Player player = db.Player.Find(id);
            if (player == null)
            {
                return HttpNotFound();
            }
            return View(player);
        }

        //
        // GET: /Player/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /Player/Create

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(Player player)
        {
            if (ModelState.IsValid)
            {
                db.Player.Add(player);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(player);
        }

        //
        // GET: /Player/Edit/5

        public ActionResult Edit(int id = 0)
        {
            Player player = db.Player.Find(id);
            if (player == null)
            {
                return HttpNotFound();
            }
            return View(player);
        }

        //
        // POST: /Player/Edit/5

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(Player player)
        {
            if (ModelState.IsValid)
            {
                db.Entry(player).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(player);
        }

        //
        // GET: /Player/Delete/5

        public ActionResult Delete(int id = 0)
        {
            Player player = db.Player.Find(id);
            if (player == null)
            {
                return HttpNotFound();
            }
            return View(player);
        }

        //
        // POST: /Player/Delete/5

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Player player = db.Player.Find(id);
            db.Player.Remove(player);
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