namespace OrderService.Dtos
{
    public class RabbitMqDto
    {
        public string OrderId { get; set; }
        public string UserId { get; set; }
        public string StoreId { get; set; }
        public string Message { get; set; }
    }
}