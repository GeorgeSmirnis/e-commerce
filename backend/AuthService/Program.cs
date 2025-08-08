using AuthService.Mapper;
using AuthService.Services;
using User;

var builder = WebApplication.CreateBuilder(args);

// Grpc Url for User Service
builder.Services.AddGrpcClient<UserService.UserServiceClient>(o =>
{
    o.Address = new Uri("http://userservice:8080");
});

builder.Services.AddControllers();

builder.Services.AddScoped<JwtTokenGenerator>();

builder.Services.AddAutoMapper(typeof(AutoMapperProfile).Assembly);





// Add cors Policy
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}



//app.UseHttpsRedirection();
app.UseCors();
app.MapControllers();


app.Run();

