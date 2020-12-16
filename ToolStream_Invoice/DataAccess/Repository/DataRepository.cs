using Microsoft.Extensions.Options;
using ToolStream_Invoice.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ToolStream_Invoice.DataAccess.DBDataModels;

namespace ToolStream_Invoice.DataAccess.Repository
{
    public class DataRepository : IDataRepository
    {
        private readonly DachserContext _databaseManager;
        public DataRepository(DachserContext context)
        {
            _databaseManager = context;
        }

        public async Task AddOrderToTrailer(int TrailerId, string OrderNumber)
        {
            await _databaseManager.AddOrderToTrailer(TrailerId, OrderNumber);
        }
        public async Task RemoveOrderFromTrailer(int TrailerId, string OrderNumber)
        {
            await _databaseManager.RemoveOrderFromTrailer(TrailerId, OrderNumber);
        }

        public async Task<int> CreateNewTrailer()
        {
            return await _databaseManager.CreateNewTrailer();
        }

        public async Task<int> DoesOrderNumberExist(string OrderNumber)
        {
            return await _databaseManager.DoesOrderNumberExist(OrderNumber);
        }

        public async Task<int> OrderNumberAlreadyUsed(string OrderNumber)
        {
            return await _databaseManager.OrderNumberAlreadyUsed(OrderNumber);
        }

        public async Task<List<SearchTrailer>> SearchExistingTrailer(int TrailerId)
        {
            return await _databaseManager.SearchExistingTrailer(TrailerId);
        }


        public async Task<List<CommercialInvoice>> CreateCommercialInvoice(int TrailerId)
        {
            return await _databaseManager.CreateCommercialInvoice(TrailerId);
        }

        public async Task<CommercialInvoiceHeader> CommercialInvoiceHeader(int TrailerId, string OrderNumber)
        {
            return await _databaseManager.GetCommercialInvoiceHeader(TrailerId, OrderNumber);
        }

        public async Task<List<CommercialInvoiceDetail>> CommercialInvoiceDetails(int TrailerId, string OrderNumber)
        {
            Console.WriteLine(TrailerId);
            Console.WriteLine(OrderNumber);
            return await _databaseManager.GetCommercialInvoiceDetails(TrailerId, OrderNumber);
        }

        public async Task<CommercialInvoiceFooter> CommercialInvoiceFooter(int TrailerId, string OrderNumber)
        {
            return await _databaseManager.GetCommercialInvoiceFooter(TrailerId, OrderNumber);
        }
    }
}
