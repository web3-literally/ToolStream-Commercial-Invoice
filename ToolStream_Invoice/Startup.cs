using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Localization.Routing;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ToolStream_Invoice.DataAccess.Repository;
using ToolStream_Invoice.Models;
using ToolStream_Invoice.Services;
using System.Globalization;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Protocols;
using ToolStream_Invoice.DataAccess.DBDataModels;
using Microsoft.EntityFrameworkCore;

namespace ToolStream_Invoice
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            services.Configure<AppSettings>(Configuration);

            services.AddScoped<IresourcestringService, resourcestringService>();
            services.AddScoped<IDataRepository, DataRepository>();

            services.AddLocalization(options => options.ResourcesPath = "resources");
            services.AddHttpClient();

            services.AddMvc(option => option.EnableEndpointRouting = false)
                .SetCompatibilityVersion(CompatibilityVersion.Version_3_0)
                .AddViewLocalization()
                .AddDataAnnotationsLocalization();

            services.AddDbContext<DachserContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DachserDatabase")));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
                app.UseHttpsRedirection();
            }

            app.UseStaticFiles();
            app.UseCookiePolicy();


            app.UseMvc(routes =>
            {
                routes.MapRoute(name: "default", template: "{controller=Home}/{action=Index}/{id?}");
                // If invalid route then culture set to invalid, BaseController will then do the defaulting to appropriate one.                   
                routes.MapGet("{*path}", ctx => { return Task.CompletedTask; });

            });

        }
    }

}
