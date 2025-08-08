
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.SignalR;
using NotificationService.SignalRcomm;
using OrderService.Dtos;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace NotificationService.RabbitMq
{
    public class OrderConsumer
    {
        private readonly IHubContext<NotificationServiceHub> _hubContext;

        public OrderConsumer(IHubContext<NotificationServiceHub> hubContext)
        {
            _hubContext = hubContext;
        }
        public void Start()
        {
            var factory = new ConnectionFactory() { HostName = "rabbitmq", Port = 5672, UserName = "guest", Password = "guest" };
            var connection = factory.CreateConnection();
            var channel = connection.CreateModel();


            channel.QueueDeclare(queue: "order_created",
                                 durable: true,
                                 exclusive: false,
                                 autoDelete: false,
                                 arguments: null);

            var consumer = new EventingBasicConsumer(channel);
            consumer.Received += async (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var json = Encoding.UTF8.GetString(body);
                var orderEvent = JsonSerializer.Deserialize<RabbitMqDto>(json);

                Console.WriteLine($"--> Received Order ID: {orderEvent.OrderId} for user {orderEvent.UserId}");

                await _hubContext.Clients.All.SendAsync("ReceiveMessage", json);
            };

            channel.BasicConsume(queue: "order_created",
                                 autoAck: true,
                                 consumer: consumer);

            Console.WriteLine("--> Waiting for messages...");
           
        }
    }
}