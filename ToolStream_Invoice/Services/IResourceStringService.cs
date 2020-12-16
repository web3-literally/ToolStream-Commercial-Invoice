using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ToolStream_Invoice.Services
{
    public interface IresourcestringService
    {
        Dictionary<string, string> Getresourcestrings(List<string> resourcestringNames);
    }
}