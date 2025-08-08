using System.IdentityModel.Tokens.Jwt;
using System.Runtime.CompilerServices;
using System.Text;
using AuthService.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using User;
using AuthService.Services;

using Grpc.Core;
using Microsoft.AspNetCore.Identity;
using AutoMapper;

namespace AuthService.Controllers
{

    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {

        private readonly IConfiguration _config;
        private readonly UserService.UserServiceClient _userClient;
        private readonly JwtTokenGenerator _TokenGenerator;
        private readonly IMapper _mapper;

        public AuthController(IConfiguration config, UserService.UserServiceClient userClient, JwtTokenGenerator TokenGenerator, IMapper mapper)
        {
            _config = config;
            _userClient = userClient;
            _TokenGenerator = TokenGenerator;
            _mapper = mapper;
        }


        [HttpGet("validate")]
        public IActionResult Validate()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer", "").Trim();

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = _config["Jwt:Issuer"],
                    ValidAudience = _config["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(_config["Jwt:Key"]))
                }, out _);

                return Ok(new { message = token});
            }
            catch (Exception ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            Console.WriteLine("--> Recieved the request for register in AuthService");
            try
            {
                var result = await _userClient.CreateUserAsync(new CreateUserRequest
                {
                   
                    Email = dto.Email,
                    Password = dto.Password,
                    Role = dto.Role,
                    StoreName = dto.StoreName,
                });

                var response = _mapper.Map<RegisterResponseDto>(result);
                response.Token = _TokenGenerator.GenerateToken(result.Email, dto.Role);

                return Ok(response);
            }

            catch (RpcException ex) when (ex.StatusCode == Grpc.Core.StatusCode.AlreadyExists)
            {
                return Conflict("User already exists");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            Console.WriteLine("--> Recieved request for Login in AuthService");
            try
            {
                var result = await _userClient.GetUserByEmailAsync(new UserRequest
                {
                    Email = dto.Email
                });

                var response = _mapper.Map<LoginResponseDto>(result);
                response.Token = _TokenGenerator.GenerateToken(result.Email, result.Role);
                return Ok(response);
            }
            catch(Exception ex)
            {
                return StatusCode(500, new {message = "Not able to send to UserService", detail = ex.Message});
            }
        }

    }

    


}