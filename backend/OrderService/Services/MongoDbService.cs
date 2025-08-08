
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using OrderService.Models;

namespace OrderService.Services
{
    public class MongoDbService
    {
        private readonly IMongoCollection<Order> _orderCollection;

        public MongoDbService(IOptions<MongoDbSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _orderCollection = database.GetCollection<Order>(settings.Value.OrderCollectionName);
        }

        public async Task<List<Order>> GetAllAsync() =>
            await _orderCollection.Find(p => true).ToListAsync();

        public async Task<List<Order>> GetByIdAsync(string id) =>
            await _orderCollection.Find(o => o.UserId == id).ToListAsync();

        public async Task CreateAsync(Order order) =>
            await _orderCollection.InsertOneAsync(order);

        public async Task<List<Order>> GetOrdersByStoreID(string id) =>
            await _orderCollection.Find(p => p.items.Any( i => i.StoreId == id) ).ToListAsync();
    }
}