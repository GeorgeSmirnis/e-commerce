
namespace OrderService.Dtos
{
    public class createOrderDto
    {
        public string email { get; set; }
        public string username { get; set; }
        public string StoreId { get; set; }

        public List<itemDto> items { get; set; }
    }
}