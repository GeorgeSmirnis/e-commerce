using RabbitMQ.Client;
using OrderService.Dtos;
using System.Text;
using System.Text.Json;

namespace OrderService.RabbitMq
{
    public class OrderPublisher
    {
        public void PublishOrderCreated(RabbitMqDto dto)
        {
            try
            {
                var factory = new ConnectionFactory() { HostName = "localhost", Port = 30072, UserName = "admin", Password = "admin123" };
                var connection = factory.CreateConnection();
                var channel = connection.CreateModel();


                channel.QueueDeclare(queue: "order_created",
                                    durable: true,
                                    exclusive: false,
                                    autoDelete: false,
                                    arguments: null);

                string message = JsonSerializer.Serialize(dto);
                var body = Encoding.UTF8.GetBytes(message);
                Console.WriteLine("--> Published in the channel");

                var properties = channel.CreateBasicProperties();
                properties.Persistent = true;

                channel.BasicPublish(exchange: "",
                                    routingKey: "order_created",
                                    basicProperties: properties,
                                    body: body);

                Console.WriteLine("--> Message published to queue 'order_created'");
                
                
            }
            catch (Exception ex)
            {
                Console.WriteLine($"--> Failed to publish message: {ex.Message}");
            }
            
        }
    }
}