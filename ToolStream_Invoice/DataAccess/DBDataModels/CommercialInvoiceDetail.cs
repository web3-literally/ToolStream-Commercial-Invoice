using System;
using System.Collections.Generic;

namespace ToolStream_Invoice.DataAccess.DBDataModels
{
    public partial class CommercialInvoiceDetail
    {
        public string OrderNumber { get; set; }
        public string OrderLineNo { get; set; }
        public string ProductSKU { get; set; }
        public string DescriptionOfGood { get; set; }
        public string CountryOfOrigin { get; set; }
        public string TariffNumber { get; set; }
        public double LinePrice { get; set; }
        public string CurrencyCode { get; set; }
        public string PreferenceDeclaration { get; set; }
        public string CustomsProcedureCode { get; set; }
        public double NetWeight { get; set; }
    }
}
