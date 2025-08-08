using NotificationService.background;
using NotificationService.RabbitMq;
using NotificationService.SignalRcomm;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

builder.Services.AddControllers();

builder.Services.AddSignalR();
builder.Services.AddHostedService<OrderConsumerService>();


builder.Services.AddSingleton<OrderConsumer>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .SetIsOriginAllowed(origin => true); // Allow React dev server
    });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{

}

app.UseRouting();

app.UseCors();
app.MapHub<NotificationServiceHub>("/notifications");


app.UseHttpsRedirection();

app.Run();
