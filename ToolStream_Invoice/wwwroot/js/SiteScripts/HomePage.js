let CurrentTrailerId = null;
let InvoiceOrderNumberList = [];
let InvoicePrintIndex = 0;


function emptyOrderListTable() {
    $('#orders-table tbody').empty();
}

function showOrderListTable(orderNoList) {
    emptyOrderListTable();
    orderNoList.forEach((OrderNumber) => {
        if (!OrderNumber) return;

        let orderRow = "<tr>" +
            `<td>${OrderNumber}</td>` +
            "</tr>";
        $('#orders-table tbody').append(orderRow);
    });
}

function searchTrailer(search_trailer_id) {
    $.get(`/api/ApiGeneral/SearchExistingTrailer?TrailerId=${search_trailer_id}`, function(data) {
        let trailerId = 0;
        let orderNoList = [];

        if (data.length == 0) {
            customAlert("Not Found Trailer");
            CurrentTrailerId = null;
            $('#trailer-id').html("Not Found");
            return;
        }

        for (let i = 0; i < data.length; i++) {
            trailerId = data[i].trailerId;
            orderNoList.push(data[i].orderNumber);
        }

        $('#trailer-id').html(trailerId);
        showOrderListTable(orderNoList);
        CurrentTrailerId = trailerId;
    });
}

$('#btn-search-trailer').click(function() {
    let search_trailer_id = $('#search-trailer-id').val();
    if (!search_trailer_id) {
        customAlert("Please Input TrailerId");
        return;
    }

    searchTrailer(search_trailer_id);
});

$('#btn-create-trailer').click(function() {
    $.get(`/api/ApiGeneral/CreateNewTrailer`, function(data) {
        emptyOrderListTable();
        let trailerId = data;
        $('#trailer-id').html(trailerId);
        CurrentTrailerId = trailerId;
    });
});


$('#btn-add-order').click(function() {
    if (CurrentTrailerId == null) {
        customAlert("Please Search Or Create Trailer");
        return;
    }

    $('#modal-add-order').modal();
});

$('#btn-confirm-add-order').click(function() {
    let bValid = true;
    $('#modal-add-order').find('input, select').each(function() {
        if ($(this).is(':visible') && $(this).prop('required') && ($(this).val() == null || $(this).val() === "")) {
            $(this).addClass('is-invalid');
            bValid = false;
        } else {
            $(this).removeClass('is-invalid');
        }
    });
    if (!bValid) return;
    $('#modal-add-order').modal("hide");

    let OrderNumber = $('#add-order-number').val();
    $.get(`/api/ApiGeneral/AddOrderToTrailer?TrailerId=${CurrentTrailerId}&OrderNumber=${OrderNumber}`, function(data) {
        if (data == "Success") {
            searchTrailer(CurrentTrailerId);
            customAlert("Success", true);
        } else
            customAlert(data);
    });
});


$('#btn-remove-order').click(function() {
    if (CurrentTrailerId == null) {
        customAlert("Please Search Or Create Trailer");
        return;
    }

    $('#modal-remove-order').modal();
});

$('#btn-confirm-remove-order').click(function() {
    let bValid = true;
    $('#modal-remove-order').find('input, select').each(function() {
        if ($(this).is(':visible') && $(this).prop('required') && ($(this).val() == null || $(this).val() === "")) {
            $(this).addClass('is-invalid');
            bValid = false;
        } else {
            $(this).removeClass('is-invalid');
        }
    });
    if (!bValid) return;
    $('#modal-remove-order').modal("hide");

    let OrderNumber = $('#remove-order-number').val();
    $.get(`/api/ApiGeneral/RemoveOrderFromTrailer?TrailerId=${CurrentTrailerId}&OrderNumber=${OrderNumber}`, function(data) {
        if (data == "Success") {
            searchTrailer(CurrentTrailerId);
            customAlert("Success", true);
        } else
            customAlert(data);
    });
});


function GeneratePDFFromInvoice(doc, docWidth, docHeight) {
    doc.setPage(doc.internal.getNumberOfPages());
    //Add Header
    doc.setFont("arial", "italic");
    doc.setFontSize(18);
    doc.text(400, 30, "Commercial Invoice");
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1.0);
    doc.line(20, 50, docWidth - 20, 50);

    $.get(`/api/ApiGeneral/CommercialInvoiceHeader?TrailerId=${CurrentTrailerId}&OrderNumber=${InvoiceOrderNumberList[InvoicePrintIndex]}`, function(InvoiceHeader) {
        console.log(InvoiceHeader);

        //Add SubHeader
        let SellerAddress = `${InvoiceHeader.sellerAddress1}  ${InvoiceHeader.sellerAddress2}  ${InvoiceHeader.sellerAddress3}  ` +
            `${InvoiceHeader.sellerCityOrTown}  ${InvoiceHeader.sellerStateProvinceCounty}  ${InvoiceHeader.sellerPostalCode}  ${InvoiceHeader.sellerCountry}`;

        let ImporterAddress = `${InvoiceHeader.importerAddress1}  ${InvoiceHeader.importerAddress2}  ${InvoiceHeader.importerAddress3}  ` +
            `${InvoiceHeader.importerCityOrTown}  ${InvoiceHeader.importerStateProvinceCounty}  ${InvoiceHeader.importerPostalCode}  ${InvoiceHeader.importerCountry}`;

        let CustomerAddress = `${InvoiceHeader.customerAddress1}  ${InvoiceHeader.customerAddress2}  ${InvoiceHeader.customerAddress3}  ` +
            `${InvoiceHeader.customerCity}  ${InvoiceHeader.customerPostalCode}  ${InvoiceHeader.customerCountry}`

        let MaxCharCountPerLine = 80;

        if (SellerAddress.length > MaxCharCountPerLine)
            SellerAddress = [SellerAddress.slice(0, MaxCharCountPerLine), "\n\t\t", SellerAddress.slice(MaxCharCountPerLine)].join('');
        if (ImporterAddress.length > MaxCharCountPerLine)
            ImporterAddress = [ImporterAddress.slice(0, MaxCharCountPerLine), "\n\t\t", ImporterAddress.slice(MaxCharCountPerLine)].join('');
        if (CustomerAddress.length > MaxCharCountPerLine)
            CustomerAddress = [CustomerAddress.slice(0, MaxCharCountPerLine), "\n\t\t", CustomerAddress.slice(MaxCharCountPerLine)].join('');

        doc.setFont("arial", "normal");
        doc.setFontSize(12);
        var strSubHeaderInfo = `Seller : ${InvoiceHeader.sellerName}\n` +
            `Address : ${SellerAddress}\n` +
            "\n" +
            `Importer : ${InvoiceHeader.importerName}\n` +
            `Address : ${ImporterAddress}\n` +
            "\n" +
            `Customer : ${InvoiceHeader.customer}\n` +
            `Address : ${CustomerAddress}\n` +
            "\n" +
            `Vat : ${InvoiceHeader.vatState}  ${InvoiceHeader.vatNumber}\n` +
            `Inco Terms : ${InvoiceHeader.incoTerms}\n` +
            `Currency : ${InvoiceHeader.currencyCode}\n`;
        doc.text(20, 80, strSubHeaderInfo);
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(1.0);
        doc.line(20, 310, docWidth - 20, 310);


        $.get(`/api/ApiGeneral/CommercialInvoiceDetails?TrailerId=${CurrentTrailerId}&OrderNumber=${InvoiceOrderNumberList[InvoicePrintIndex]}`, function(InvoiceDetails) {
            console.log(InvoiceDetails);

            //Add Detail
            var tableStartY = 330;
            var tableMargin = 20;
            var tableBody = [];
            var rowCount = InvoiceDetails.length;
            for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
                tableBody.push({
                    OrderLineNo: InvoiceDetails[rowIndex].orderLineNo,
                    CountryOfOrigin: InvoiceDetails[rowIndex].countryOfOrigin,
                    TariffNumber: InvoiceDetails[rowIndex].tariffNumber,
                    LinePrice: Math.round(InvoiceDetails[rowIndex].linePrice * 1000) / 1000,
                    NetWeight: Math.round(InvoiceDetails[rowIndex].netWeight * 1000) / 1000
                });
            }

            doc.autoTable({
                startY: tableStartY,
                margin: tableMargin,
                theme: 'grid',
                headStyles: {
                    fillColor: [100, 100, 100]
                },
                body: tableBody,
                columns: [
                    { header: 'OrderLineNo', dataKey: 'OrderLineNo' },
                    { header: 'CountryOfOrigin', dataKey: 'CountryOfOrigin' },
                    { header: 'TariffNumber', dataKey: 'TariffNumber' },
                    { header: 'LinePrice', dataKey: 'LinePrice' },
                    { header: 'NetWeight', dataKey: 'NetWeight' },
                ],
            });

            var tableCellHeight = 22.5;
            var tableBottom = tableStartY + (rowCount + 1) * tableCellHeight;
            while (tableBottom >= docHeight - tableMargin)
                tableBottom = tableBottom - docHeight + tableCellHeight + tableMargin;


            doc.setPage(doc.internal.getNumberOfPages());
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(1.0);
            doc.line(20, tableBottom + 20, 575, tableBottom + 20);


            $.get(`/api/ApiGeneral/CommercialInvoiceFooter?TrailerId=${CurrentTrailerId}&OrderNumber=${InvoiceOrderNumberList[InvoicePrintIndex]}`, function(InvoiceFooter) {
                console.log(InvoiceFooter);

                let footerY = tableBottom + 40;
                if (tableBottom + 120 > docHeight) {
                    doc.addPage();
                    footerY = 30;
                }

                //Add SubFooter
                var strFooterInfo = `Order Number : ${InvoiceFooter.orderNumber}\n` +
                    `Number Of Packages : ${InvoiceFooter.numberOfPackages}\n` +
                    `Total Value : ${Math.round(InvoiceFooter.totalValue * 1000) / 1000}\n` +
                    `Total Weight : ${Math.round(InvoiceFooter.totalWeight * 1000) / 1000}\n` +
                    "\n";
                doc.text(400, footerY, strFooterInfo);

                let bottomY = footerY + 100;
                if (footerY + 100 > docHeight) {
                    doc.addPage();
                    bottomY = 30;
                }

                strFooterInfo = `Print Name : ${InvoiceFooter.printName}\t\t Signature : ${InvoiceFooter.signature}\t\t Position : ${InvoiceFooter.position}\t\t Date : ${InvoiceFooter.date}\t\n`;
                doc.text(20, bottomY, strFooterInfo);


                InvoicePrintIndex++;
                if (InvoicePrintIndex >= InvoiceOrderNumberList.length) {

                    window.open(doc.output('bloburl'), '_blank');

                    InvoiceOrderNumberList = [];
                    InvoicePrintIndex = 0;
                    console.log("**************** COMPLETED! ***************");
                    return;
                }

                doc.addPage();
                GeneratePDFFromInvoice(doc, docWidth, docHeight);
            });
        });
    });
}

$('#btn-create-invoice').click(function() {
    if (CurrentTrailerId == null) {
        customAlert("Please Search Or Create Trailer");
        return;
    }

    $.get(`/api/ApiGeneral/CreateCommercialInvoice?TrailerId=${CurrentTrailerId}`, function(data) {
        InvoiceOrderNumberList = [];
        InvoicePrintIndex = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i]) InvoiceOrderNumberList.push(data[i].orderNumber);
        }
        if (InvoiceOrderNumberList.length == 0) {
            customAlert("Trailer Is Empty! Plesae Add OrderNumber.");
            return;
        }
        var docWidth = 595;
        var docHeight = 842;
        var doc = new jsPDF("portrait", "pt", "a4"); //595 � 842
        GeneratePDFFromInvoice(doc, docWidth, docHeight);
    });



    return;

    var docWidth = 595;
    var docHeight = 842;
    var doc = new jsPDF("portrait", "pt", "a4"); //595 � 842
    for (var i = 0; i < 10; i++) {
        doc.setPage(doc.internal.getNumberOfPages());
        //Add Header
        doc.setFont("arial", "italic");
        doc.setFontSize(18);
        doc.text(400, 30, "Commercial Invoice");
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(1.0);
        doc.line(20, 50, docWidth - 20, 50);

        //Add SubHeader
        doc.setFont("arial", "normal");
        doc.setFontSize(12);
        var strSubHeaderInfo = "SellerName : ToolStream LTD\n" +
            "SellerAddress1 : Boundary Way\n" +
            "SellerAddress2 : Lufton Trading Estate\n" +
            "SellerAddress3 : \n" +
            "SellerCityOrTown: Yeovil\n" +
            "SellerStateProvinceCountry : Somerset\n" +
            "SellerPostCode : BA228HZ\n" +
            "SellerCountry : GB\n" +
            "\n" +
            "ImporterName : JDR or Baker Tilly TBC\n" +
            "ImporterAddress1 : TBC\n" +
            "ImporterAddress2 : TBC\n" +
            "ImporterAddress3 : TBC\n" +
            "ImporterCityOrTown : TBC\n" +
            "ImporterStateProvinceCountry : TBC\n" +
            "ImporterPostalCode : TBC \n" +
            "ImporterCountry : NL\n" +
            "\n" +
            "Customer : 25998\n" +
            "CustomerAddress1 : Torpedo Construction Ltd T/A\n" +
            "CustomerAddress2 : Radius Ireland\n" +
            "CustomerAddress3 : 50 Baldoyle Industrail Estate\n" +
            "CustomerCity : Dublin\n" +
            "CustomerCountry : IE\n" +
            "CustomerPostalCode : D13\n" +
            "\n" +
            "VatState : IE\n" +
            "VatNumber : 4871536O\n" +
            "IcoTerms : \n" +
            "CurrencyCode : EUR\n";
        doc.text(20, 80, strSubHeaderInfo);
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(1.0);
        doc.line(20, 500, docWidth - 20, 500);

        //Add Detail
        var tableStartY = 520;
        var tableMargin = 20;
        var tableBody = [];
        var rowCount = 30;
        for (var rowIndex = 1; rowIndex <= rowCount; rowIndex++) {
            tableBody.push({ OrderLineNo: rowIndex, CountryOfOrigin: 'CN', TariffNumber: '82055980', LinePrice: '28.38', NetWeight: '2.4' });
        }

        doc.autoTable({
            startY: tableStartY,
            margin: tableMargin,
            theme: 'grid',
            headStyles: {
                fillColor: [100, 100, 100]
            },
            body: tableBody,
            columns: [
                { header: 'OrderLineNo', dataKey: 'OrderLineNo' },
                { header: 'CountryOfOrigin', dataKey: 'CountryOfOrigin' },
                { header: 'TariffNumber', dataKey: 'TariffNumber' },
                { header: 'LinePrice', dataKey: 'LinePrice' },
                { header: 'NetWeight', dataKey: 'NetWeight' },
            ],
        });

        var tableCellHeight = 22.5;
        var tableBottom = tableStartY + (rowCount + 1) * tableCellHeight;
        while (tableBottom >= docHeight - tableMargin)
            tableBottom = tableBottom - docHeight + tableCellHeight + tableMargin;


        doc.setPage(doc.internal.getNumberOfPages());
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(1.0);
        doc.line(20, tableBottom + 20, 575, tableBottom + 20);

        //Add SubFooter
        var strFooterInfo = "Total Value : ToolStream LTD\n" +
            "Number Of Packages : 1\n" +
            "Total Value : 1393.96\n" +
            "Total Weight : 319.501\n" +
            "\n";
        doc.text(400, tableBottom + 40, strFooterInfo);

        strFooterInfo = "Print Name : \t\t Signature : \t\t Position : \t\t Date : \t\t\n";
        doc.text(20, tableBottom + 120, strFooterInfo);

        doc.addPage();
    }

    //doc.save("Invoice.pdf");
    window.open(doc.output('bloburl'), '_blank');
});