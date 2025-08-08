
using System.ComponentModel.DataAnnotations;


namespace OrderService.Models
{
    public class Item
    {

        public int productId { get; set; }
        public decimal price { get; set; }
        public int quantity { get; set; }
        public string StoreId { get; set; }

        
    }
}