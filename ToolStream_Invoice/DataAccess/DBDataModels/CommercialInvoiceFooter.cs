using System;
using System.Collections.Generic;

namespace ToolStream_Invoice.DataAccess.DBDataModels
{
    public partial class CommercialInvoiceFooter
    {
        public string OrderNumber { get; set; }
        public int NumberOfPackages { get; set; }
        public double TotalValue { get; set; }
        public double TotalWeight { get; set; }
        public string PrintName { get; set; }
        public string Signature { get; set; }
        public string Position { get; set; }
        public string Date { get; set; }
    }
}
