
using Microsoft.AspNetCore.Identity;

namespace UserService.Models;

public class Users : IdentityUser
{
   public string Role { get; set; }
   public string? StoreName { get; set; }
      
}
