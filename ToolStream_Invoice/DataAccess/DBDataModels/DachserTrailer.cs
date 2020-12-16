using System;
using System.Collections.Generic;

namespace ToolStream_Invoice.DataAccess.DBDataModels
{
    public partial class DachserTrailer
    {
        public int TrailerId { get; set; }
        public string TrailerDescription { get; set; }
        public string TrailerNotes { get; set; }
        public bool? CommercialInvoicePrinted { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateInvoicePrinted { get; set; }
    }
}
