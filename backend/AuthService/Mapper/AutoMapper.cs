

using AuthService.Dtos;
using AutoMapper;
using User;

namespace AuthService.Mapper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<UserResponse, LoginResponseDto>()
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.UserName))
                .ForMember(dest => dest.Token, opt => opt.Ignore());
            CreateMap<CreateUserResponse, RegisterResponseDto>()
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.UserName))
                .ForMember(dest => dest.Token, opt => opt.Ignore());
        }
    }
}