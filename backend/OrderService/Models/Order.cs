
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace OrderService.Models
{
    public class Order
    {
        [BsonId]
        public string? Id { get; set; }= Guid.NewGuid().ToString();
        
    
        public string UserId { get; set; }
        public string email { get; set; }
        public string username { get; set; }
        public decimal totalPrice { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public List<Item> items { get; set; }

    }
}