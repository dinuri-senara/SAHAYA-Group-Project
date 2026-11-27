using Microsoft.EntityFrameworkCore;
using Sahaya.Logistics.API.Controllers;
using Sahaya.Logistics.API.Data;

namespace Sahaya.Logistics.Tests
{
    public static class TestDbContextFactory
    {
        public static LogisticsDbContext Create(string dbName)
        {
            var options = new DbContextOptionsBuilder<LogisticsDbContext>()
                .UseInMemoryDatabase(databaseName: dbName)
                .Options;

            var db = new LogisticsDbContext(options);
            return db;
        }

        public static (SheltersController controller, LogisticsDbContext db) CreateSheltersController(string dbName)
        {
            var db = Create(dbName);
            var controller = new SheltersController(db);
            return (controller, db);
        }

        public static (ResourcesController controller, LogisticsDbContext db) CreateResourcesController(string dbName)
        {
            var db = Create(dbName);
            var controller = new ResourcesController(db);
            return (controller, db);
        }
    }
}
