using NotificationService.RabbitMq;

namespace NotificationService.background
{
    public class OrderConsumerService : BackgroundService
    {
        private readonly OrderConsumer _orderConsumer;
        public OrderConsumerService(OrderConsumer orderConsumer)
        {
            _orderConsumer = orderConsumer;
        }
        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            return Task.Run(() => _orderConsumer.Start(), stoppingToken);
        }
    }
}