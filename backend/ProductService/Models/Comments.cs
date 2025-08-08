
using System.ComponentModel.DataAnnotations;

namespace ProductService.Models
{
    public class Comments
    {
        [Key]
        public int Id { get; set; }
        public string comment { get; set; }
        public string username { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public int ProductId { get; set; }
        public Product Product { get; set; }
    }
}