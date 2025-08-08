
using AutoMapper;
using Azure;
using ProductService.Controllers;
using ProductService.Dtos;
using ProductService.Models;


namespace ProductService.Mapper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Product, ResponseProductDto>()
                .ForMember(dest => dest.Comment, opt => opt.MapFrom(src => src.Comment));
            CreateMap<Comments, ResponseCommentDto>();
        }
    }
}