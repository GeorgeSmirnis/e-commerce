
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;


namespace ApiGateaway.Controller
{
    [ApiController]
    [Route("{service}/{*path}")]
    public class ApiGateawayController : ControllerBase
    {

        private readonly IHttpClientFactory _httpClientFactory;
        private readonly Dictionary<string, (string url, bool requireAuth)> _routes = new()
        {
            ["auth"] = ("http://authservice:8080", false),
            ["product"] = ("http://productservice:8080", true),
            ["order"] = ("http://orderservice:8080", true)
        };

        public ApiGateawayController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [HttpGet, HttpPost, HttpDelete, HttpPatch, HttpPut]
        public async Task<IActionResult> Gateaway(string service, string path)
        {
            if (!_routes.TryGetValue(service, out var config))
            {
                return NotFound("Unknown service");
            }

            var (baseUrl, requiresAuth) = config;
            Console.WriteLine($"--> baseurl is {baseUrl}");

            if (requiresAuth)
            {
                var token = Request.Headers["Authorization"].ToString();

                if (string.IsNullOrWhiteSpace(token))
                {
                    return Unauthorized("Missing token");
                }

                var authClient = _httpClientFactory.CreateClient();
                var authRequest = new HttpRequestMessage(HttpMethod.Get, "http://authservice:8080/auth/validate");
                authRequest.Headers.Add("Authorization", token);
                Console.WriteLine($"--> this is the authrequest {authRequest}");

                var authResponse = await authClient.SendAsync(authRequest);
                if (!authResponse.IsSuccessStatusCode)
                {
                    return Unauthorized("Invalid token");
                }
            }

            var targetUrl = $"{baseUrl}/{service}/{path}";
            Console.WriteLine($"--> Targeturl is {targetUrl}");
            Console.WriteLine($"--> the method is {Request.Method}");
            var forwardClient = _httpClientFactory.CreateClient();
            var forwardRequest = new HttpRequestMessage(new HttpMethod(Request.Method), targetUrl);

            foreach (var header in Request.Headers)
            {
                forwardRequest.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray());
            }

            if (Request.ContentLength > 0)
            {
                forwardRequest.Content = new StreamContent(Request.Body);
                forwardRequest.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            }

            var response = await forwardClient.SendAsync(forwardRequest);
            var content = await response.Content.ReadAsStringAsync();
            var ContentType = response.Content.Headers.ContentType?.ToString() ?? "application/json";
            Console.WriteLine($"--> the response is {response}");
            Console.WriteLine($"--> the content is {content}");
            Console.WriteLine($"--> the contenttype is {ContentType}");
            return Content(content, ContentType);
        }
    }
}