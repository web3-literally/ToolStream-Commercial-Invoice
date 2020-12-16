using Microsoft.Extensions.Localization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ToolStream_Invoice.Services
{
    public class resourcestringService : IresourcestringService
    {
        private readonly IStringLocalizer<Resource> _localizer;

        public resourcestringService(IStringLocalizer<Resource> sharedLocalizer)
        {
            _localizer = sharedLocalizer;
        }

        /// <summary>
        /// Get Resource String Values
        /// </summary>
        public Dictionary<string, string> Getresourcestrings(List<string> resourcestringNames)
        {
            var dict = new Dictionary<string, string>();
            foreach (var res in resourcestringNames) { dict.Add(res, _localizer[res]); }
            return dict;
        }

    }
}
