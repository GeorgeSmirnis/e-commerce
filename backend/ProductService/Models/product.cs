

using System.ComponentModel.DataAnnotations;

namespace ProductService.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public int price { get; set; }
        public string image { get; set; }
        public string category { get; set; }
        public string StoreId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string? StoreName { get; set; }
        public ICollection<Comments> Comment { get; set; }
    }
}