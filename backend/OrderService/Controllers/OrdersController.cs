using Microsoft.AspNetCore.Mvc;
using OrderService.Dtos;
using OrderService.Models;
using OrderService.Services;
using OrderService.RabbitMq;

namespace OrderService.Controllers
{
    [ApiController]
    [Route("order")]
    public class OrdersController : ControllerBase
    {
        private readonly MongoDbService _mongoService;
        private readonly OrderPublisher _orderPublisher;

        public OrdersController(MongoDbService mongoService, OrderPublisher orderPublisher)
        {
            _mongoService = mongoService;
            _orderPublisher = orderPublisher;
        }


        [HttpPost("createOrder")]
        public async Task<IActionResult> createOrder([FromBody] Order order)
        {
            Console.WriteLine($"--> received data ");
            try
            {

                await _mongoService.CreateAsync(order);
                var message = new RabbitMqDto
                {
                    OrderId = order.Id,
                    UserId = order.UserId,
                    StoreId = order.items.First().StoreId,
                    Message = "A new Order has been sent"
                };
                _orderPublisher.PublishOrderCreated(message);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error in server during placing order", error = ex.Message });
            }
        }


        [HttpGet("getById/{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var orders = await _mongoService.GetByIdAsync(id);
                return Ok(orders);

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error in server during getting orders by id", ex.Message });
            }

        }

        [HttpGet("getOrdersByStoreId/{id}")]
        public async Task<IActionResult> GetOrdersByStoreId(string id)
        {
            Console.WriteLine("--> got data to getting by storeid");
            try
            {
                var orders = await _mongoService.GetOrdersByStoreID(id);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error in server during getting order by store id", ex.Message });
            }
        }
    }
}