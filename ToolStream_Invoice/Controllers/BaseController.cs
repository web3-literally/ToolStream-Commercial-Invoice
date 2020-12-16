using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ToolStream_Invoice.Controllers
{
    public class BaseController : Controller
    {
        protected readonly string _currentCulture;

        public BaseController()
        {
            _currentCulture = CultureInfo.CurrentCulture.Name;
        }


        public override void OnActionExecuting(ActionExecutingContext context)
        {
            base.OnActionExecuting(context);
        }
    }
}