using System.Collections.Generic;
using System.Threading.Tasks;
using ToolStream_Invoice.Models;
using ToolStream_Invoice.DataAccess.DBDataModels;

namespace ToolStream_Invoice.DataAccess.Repository
{
    public interface IDataRepository
    {
        Task<int> CreateNewTrailer();
        Task<List<SearchTrailer>> SearchExistingTrailer(int TrailerId);
        Task AddOrderToTrailer(int TrailerId, string OrderNumber);
        Task RemoveOrderFromTrailer(int TrailerId, string OrderNumber);
        Task<int> OrderNumberAlreadyUsed(string OrderNumber);
        Task<int> DoesOrderNumberExist(string OrderNumber);

        Task<List<CommercialInvoiceDataModel>> CreateCommercialInvoice(int TrailerId);
        Task<CommercialInvoiceHeader> CommercialInvoiceHeader(int TrailerId, string OrderNumber);
        Task<List<CommercialInvoiceDetail>> CommercialInvoiceDetails(int TrailerId, string OrderNumber);
        Task<CommercialInvoiceFooter> CommercialInvoiceFooter(int TrailerId, string OrderNumber);
    }
}