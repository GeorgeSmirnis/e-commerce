using Grpc.Core;
using Microsoft.AspNetCore.Identity;
using UserService.Data;
using User;
using UserService.Models;
using Azure.Identity;


namespace UserService.Services
{
    public class UserSerciveImpl : User.UserService.UserServiceBase
    {
        private readonly UserManager<Users> _userManager;

        public UserSerciveImpl(UserManager<Users> userManager)
        {
            _userManager = userManager;
        }

        public override async Task<CreateUserResponse> CreateUser(CreateUserRequest request, ServerCallContext context)
        {

            Console.WriteLine($"--> Received gRPC CreateUser for {request.Email}");
            var user = new Users {UserName = request.Email, Email = request.Email, Role = request.Role, StoreName = request.StoreName };
            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                throw new RpcException(new Status(StatusCode.InvalidArgument, string.Join(", ", result.Errors.Select(e => e.Description))));
            }

            return new CreateUserResponse { Id = user.Id, Email = user.Email, UserName = user.UserName, StoreName = user.StoreName };
        }

        public override async Task<UserResponse> GetUserByEmail(UserRequest request, ServerCallContext context)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                throw new RpcException(new Status(StatusCode.NotFound, "User not Found"));
            }

            return new UserResponse
            {
                Id = user.Id,
                Email = user.Email,
                UserName = user.UserName,
                Role = user.Role,
                StoreName = user.StoreName
            };  
        }
    }
}