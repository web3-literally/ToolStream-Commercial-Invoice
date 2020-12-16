using System;
using System.Collections.Generic;

namespace ToolStream_Invoice.DataAccess.DBDataModels
{
    public partial class DachserHeader
    {
        public string OrderNumber { get; set; }
        public string CustomerReference { get; set; }
        public string Customer { get; set; }
        public string Attention { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Address3 { get; set; }
        public string CountryTerritory { get; set; }
        public string PostalCode { get; set; }
        public string CityOrTown { get; set; }
        public string Telephone { get; set; }
        public string VatExeNumber { get; set; }
        public string CvatState { get; set; }
        public string EcVatReg { get; set; }
        public string IncoTerms { get; set; }
        public string CurrencyCode { get; set; }
        public int? NumberOfPackages { get; set; }
        public int? TrailerId { get; set; }
        public string Flag { get; set; }
        public string Status { get; set; }
        public DateTime DateInserted { get; set; }
        public DateTime? DateProgRun { get; set; }
    }
}
