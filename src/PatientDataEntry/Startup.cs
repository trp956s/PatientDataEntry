using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using System.IO;
using System.Threading.Tasks;
using Microsoft.DotNet.InternalAbstractions;

namespace PatientDataEntry
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
        }

        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                ;

            builder.AddEnvironmentVariables();
            builder.Build();
        }


        /// <summary>
        /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        /// Thanks to http://benjii.me/2016/01/angular2-routing-with-asp-net-core-1/ I 1. customise the router 
        /// in the use method 2. support the file system by calling UseFileServer and 3. enable MVC for data requests
        /// </summary>
        /// <param name="build"></param>
        public void Configure(IApplicationBuilder build)
        {
            build.Use(this.RouteAllUnknownRequestsToAppRoot);
            build.UseFileServer();
            build.UseMvc();
        }


        /// <summary>
        /// This method customizes the router by forwarding all requests that cannot be served by MVC to default.html
        /// TODO: support an actual 404 page and require a login
        /// TODO: prevent file browsing by overriding the File Server Options also seen on the same link below
        /// Thanks to http://benjii.me/2016/01/angular2-routing-with-asp-net-core-1/ I added this method to Use
        /// I also changed the configure file.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="next"></param>
        /// <returns></returns>
        private async Task RouteAllUnknownRequestsToAppRoot(HttpContext context, Func<Task> next)
        {
            await next();

            if(!this.RewriteRequestToUseAppRoute(context))
            {
                return;
            }

            context.Request.Path = "/default.html";
            await next();
        }


        /// <summary>
        /// Determine which requests should be replaced with default.html
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        private bool RewriteRequestToUseAppRoute(HttpContext context)
        {
            var thereIsNoAvailableFile = context.Response.StatusCode == 404;
            var theRequestDoesNotContainAnExtension = !Path.HasExtension(context.Request.Path.Value);

            return thereIsNoAvailableFile && theRequestDoesNotContainAnExtension;
        }
    }
}
