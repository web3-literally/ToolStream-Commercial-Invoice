using System;
using System.Collections.Generic;
using ToolStream_Invoice.DataAccess.DBDataModels;

namespace ToolStream_Invoice.DataAccess.ApiDataModels
{
    public partial class CommercialInvoiceDataModel
    {
        public CommercialInvoiceHeader InvoiceHeader { get; set; }
        public List<CommercialInvoiceDetail> InvoiceDetails { get; set; }
        public CommercialInvoiceFooter InvoiceFooter { get; set; }
    }
}
