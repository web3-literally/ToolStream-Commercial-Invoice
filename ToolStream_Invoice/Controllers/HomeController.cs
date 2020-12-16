using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ToolStream_Invoice.DataAccess.Repository;
using ToolStream_Invoice.Services;
using Microsoft.Extensions.Localization;
using ToolStream_Invoice.Models;
using System.Diagnostics;

namespace ToolStream_Invoice.Controllers
{
    public class HomeController : BaseController
    {
        private readonly IDataRepository _dataRepository;
        private readonly IStringLocalizer<Resource> _localizer;
        private readonly IresourcestringService _resourcestring;

        public HomeController(IStringLocalizer<Resource> sharedLocalizer, IresourcestringService resString, IDataRepository repo)
        {
            _dataRepository = repo;
            _localizer = sharedLocalizer;
            _resourcestring = resString;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult CommercialInvoice(string id = "")
        {
            int nTrailerId = 0;
            if (int.TryParse(id, out nTrailerId))
                return View();
            else
                return RedirectToAction("Error");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}