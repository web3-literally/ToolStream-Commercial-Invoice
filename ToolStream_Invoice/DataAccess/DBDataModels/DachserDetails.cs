using System;
using System.Collections.Generic;

namespace ToolStream_Invoice.DataAccess.DBDataModels
{
    public partial class DachserDetails
    {
        public string OrderNumber { get; set; }
        public string OrderLineNo { get; set; }
        public string ProductSku { get; set; }
        public string DescriptionOfGood { get; set; }
        public string CountryOfOrigin { get; set; }
        public string TariffNumber { get; set; }
        public double? UnitPrice { get; set; }
        public double? LinePrice { get; set; }
        public int? Units { get; set; }
        public string CurrencyCode { get; set; }
        public string PreferenceDeclaration { get; set; }
        public string CustomsProcedureCode { get; set; }
        public double? UnitWeight { get; set; }
        public double? LineWeight { get; set; }
        public decimal? PalletNumber { get; set; }
    }
}
