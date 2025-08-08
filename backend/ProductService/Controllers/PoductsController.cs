using System.ComponentModel;
using System.Threading.Tasks;
using AutoMapper;
using Azure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductService.Data;
using ProductService.Dtos;
using ProductService.Models;

namespace ProductService.Controllers
{

    [ApiController]
    [Route("product")]
    public class ProductsController : ControllerBase
    {

        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ProductsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;

        }

        [HttpPost("createNewProduct")]
        public async Task<IActionResult> createNewProduct([FromBody] createNewProductDto dto)
        {
            try
            {
                var product = new Product
                {
                    name = dto.name,
                    description = dto.description,
                    price = dto.price,
                    image = dto.image,
                    category = dto.category,
                    StoreId = dto.StoreId
                };
                _context.Products.Add(product);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occured",
                    error = ex.Message
                });
            }

            return Ok();
        }


        [HttpGet("getAllProducts")]
        public async Task<IActionResult> GetAllProducts()
        {
            try
            {
                var allProducts = await _context.Products.ToListAsync();
                var product = _mapper.Map<List<ResponseProductDto>>(allProducts);
                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error in server during getting all products", error = ex.Message });
            }

        }

        [HttpGet("getProductsByCategory/{category}")]
        public async Task<IActionResult> GetProductsByCategory(string category)
        {
            try
            {
                var allProductsByCategory = await _context.Products
                                        .Where(p => p.category.ToLower() == category.ToLower())
                                        .ToListAsync();

                var product = _mapper.Map<List<ResponseProductDto>>(allProductsByCategory);
                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error in server during getting products by category", error = ex.Message });
            }


        }

        [HttpGet("getProductById/{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            try
            {
                var getProductById = await _context.Products
                                    .Include(p => p.Comment)
                                    .FirstOrDefaultAsync(p => p.Id == id);

                if (getProductById == null)
                return NotFound();

                var product = _mapper.Map<ResponseProductDto>(getProductById);
                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error in server during getting product by id", error = ex.Message });
            }

        }

        [HttpPost("getProductsInCart")]
        public async Task<IActionResult> GetProductsInCart([FromBody] GetProductsInCartDto dto)
        {
            try
            {
                var getProductInCart = await _context.Products
                                        .Where(p => dto.Ids.Contains(p.Id))
                                        .ToListAsync();

                var product = _mapper.Map<List<ResponseProductDto>>(getProductInCart);
                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error in server during getting data for cart", ex.Message });
            }

        }

        [HttpGet("MyStoreProducts/{id}")]
        public async Task<IActionResult> GetMyStoreProducts(string id)
        {
            try
            {
                var getProductByMyStore = await _context.Products
                                          .Where(p => p.StoreId == id)
                                          .ToListAsync();

                var product = _mapper.Map<List<ResponseProductDto>>(getProductByMyStore);
                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error in server during getting data fot My store ", ex.Message });
            }
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] UpdateProductDto dto)
        {
            try
            {
                var ProductById = await _context.Products
                                        .FindAsync(id);

                if (ProductById == null)
                {
                    return NotFound(new { message = $"Product with id {id} not found." });
                }

                ProductById.name = dto.name;
                ProductById.description = dto.description;
                ProductById.price = dto.price;
                ProductById.image = dto.image;
                ProductById.category = dto.category;

                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error in server during updating the product data", ex.Message });
            }
        }


        [HttpPost("comments/{id}")]
        public async Task<IActionResult> AddComment(int id, [FromBody] CommentDto dto)
        {
            try
            {
                var comment = new Comments
                {
                    username = dto.username,
                    comment = dto.comment,
                    ProductId = id
                };

                _context.Comments.Add(comment);
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error in server during saving the comment", ex.Message });
            }
        }
    }
}

