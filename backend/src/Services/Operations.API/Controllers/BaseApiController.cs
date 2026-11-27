using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace Sahaya.Operations.API.Controllers;

[ApiController]
public abstract class BaseApiController : ControllerBase
{
    protected Guid CurrentUserId
    {
        get
        {
            var idStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                     ?? User.FindFirst("sub")?.Value;
            if (Guid.TryParse(idStr, out var id))
                return id;

            return Guid.Parse("33333333-3333-3333-3333-333333333333");
        }
    }

    protected string CurrentUserName => User.FindFirst(ClaimTypes.Name)?.Value
                                     ?? User.FindFirst("name")?.Value
                                     ?? "Nuwan Bandara";

    protected string CurrentUserEmail => User.FindFirst(ClaimTypes.Email)?.Value
                                      ?? User.FindFirst("email")?.Value
                                      ?? "volunteer@sahaya.org";
}
