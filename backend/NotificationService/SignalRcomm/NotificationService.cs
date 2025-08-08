

using Microsoft.AspNetCore.SignalR;

namespace NotificationService.SignalRcomm
{
    public class NotificationServiceHub : Hub
    {
        public override Task OnConnectedAsync()
    {
        Console.WriteLine($"✅ Client connected: {Context.ConnectionId}");
        return base.OnConnectedAsync();
    }

    }
}