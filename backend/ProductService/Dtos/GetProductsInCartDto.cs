using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductService.Dtos
{
    public class GetProductsInCartDto
    {
        public List<int> Ids { get; set; }
    }
}