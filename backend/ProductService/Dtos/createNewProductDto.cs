

namespace ProductService.Dtos
{
    public class createNewProductDto
    {
        public string name { get; set; }
        public string description { get; set; }
        public int price { get; set; }
        public string image { get; set; }
        public string category { get; set; }
        public string StoreId { get; set; }
    }
}