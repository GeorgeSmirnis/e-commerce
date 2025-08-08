



namespace ProductService.Dtos
{
    public class ResponseProductDto
    {
        public int id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public int price { get; set; }
        public string image { get; set; }
        public string category { get; set; }
        public string StoreId { get; set; }
        
        public string StoreName { get; set; }
        public List<ResponseCommentDto> Comment { get; set; }
    }
}