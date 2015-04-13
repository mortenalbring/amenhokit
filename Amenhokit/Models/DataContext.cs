using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace Amenhokit.Models
{
    public class DataContext : DbContext
    {
              public DataContext()
            : base("DefaultConnection")
        {
        }
        public DbSet<Player> Player { get; set; }
        public DbSet<Game> Game { get; set; }
    }
}