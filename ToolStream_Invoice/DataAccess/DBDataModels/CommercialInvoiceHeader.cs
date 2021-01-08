using System;
using System.Collections.Generic;

namespace ToolStream_Invoice.DataAccess.DBDataModels
{
    public partial class CommercialInvoiceHeader
    {
        public string OrderNumber { get; set; }
        public string CustomerReference { get; set; }

        public string SellerName { get; set; }
        public string SellerAddress1 { get; set; }
        public string SellerAddress2 { get; set; }
        public string SellerAddress3 { get; set; }
        public string SellerCityOrTown { get; set; }
        public string SellerStateProvinceCounty { get; set; }
        public string SellerPostalCode { get; set; }
        public string SellerCountry { get; set; }
        public string SellerVatnumber { get; set; }
        public string SellerEORInumber { get; set; }

        public string ImporterName { get; set; }
        public string ImporterAddress1 { get; set; }
        public string ImporterAddress2 { get; set; }
        public string ImporterAddress3 { get; set; }
        public string ImporterCityOrTown { get; set; }
        public string ImporterStateProvinceCounty { get; set; }
        public string ImporterPostalCode { get; set; }
        public string ImporterCountry { get; set; }
        public string ImporterVatnumber { get; set; }
        public string ImporterEORInumber { get; set; }
        public string InvoiceNumber { get; set; }

        public string Customer { get; set; }
        public string CustomerAddress1 { get; set; }
        public string CustomerAddress2 { get; set; }
        public string CustomerAddress3 { get; set; }
        public string CustomerCity { get; set; }
        public string CustomerCountry { get; set; }
        public string CustomerPostalCode { get; set; }

        public string vatState { get; set; }
        public string VatNumber { get; set; }
        public string IncoTerms { get; set; }
        public string CurrencyCode { get; set; }
    }
}
