
namespace OrderService.Services
{
    public class MongoDbSettings
    {
        public string ConnectionString { get; set; } = null!;
        public string DatabaseName { get; set; } = null!;
        public string OrderCollectionName { get; set; } = null!;
    }
}