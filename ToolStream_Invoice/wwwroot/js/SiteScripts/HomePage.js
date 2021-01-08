let CurrentTrailerId = null;


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


function GeneratePDFFromInvoice(data) {
    var docWidth = 595;
    var docHeight = 842;
    var doc = new jsPDF("portrait", "pt", "a4"); //595 � 842

    let InvoiceHeader = data[0].invoiceHeader;

    let SellerAddress = `${InvoiceHeader.sellerAddress1}  ${InvoiceHeader.sellerAddress2}  ${InvoiceHeader.sellerAddress3}  ` +
        `${InvoiceHeader.sellerCityOrTown}  ${InvoiceHeader.sellerStateProvinceCounty}  ${InvoiceHeader.sellerPostalCode}  ${InvoiceHeader.sellerCountry}`;

    let MaxCharCountPerLine = 80;

    let ImporterAddress = `${InvoiceHeader.importerAddress1}  ${InvoiceHeader.importerAddress2}  ${InvoiceHeader.importerAddress3}  ` +
        `${InvoiceHeader.importerCityOrTown}  ${InvoiceHeader.importerStateProvinceCounty}  ${InvoiceHeader.importerPostalCode}  ${InvoiceHeader.importerCountry}`;

    if (SellerAddress.length > MaxCharCountPerLine)
        SellerAddress = [SellerAddress.slice(0, MaxCharCountPerLine), "\n\t\t", SellerAddress.slice(MaxCharCountPerLine)].join('');
    if (ImporterAddress.length > MaxCharCountPerLine)
        ImporterAddress = [ImporterAddress.slice(0, MaxCharCountPerLine), "\n\t\t", ImporterAddress.slice(MaxCharCountPerLine)].join('');


    var tableBody = [];

    var TotalNumberOfPackages = 0;
    var TotalValue = 0;
    var TotalGrossWeight = 0;

    for (let i = 0; i < data.length; i++) {
        let InvoiceDetails = data[i].invoiceDetails;
        let InvoiceFooter = data[i].invoiceFooter;

        var rowCount = InvoiceDetails.length;
        for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            tableBody.push({
                OrderLineNo: InvoiceDetails[rowIndex].orderLineNo,
                Units: InvoiceDetails[rowIndex].units,
                ProductSKU: InvoiceDetails[rowIndex].productSKU,
                Description: InvoiceDetails[rowIndex].descriptionOfGood,
                CountryOfOrigin: InvoiceDetails[rowIndex].countryOfOrigin,
                TariffNumber: InvoiceDetails[rowIndex].tariffNumber,
                LinePrice: Math.round(InvoiceDetails[rowIndex].linePrice * 1000) / 1000,
                NetWeight: Math.round(InvoiceDetails[rowIndex].netWeight * 1000) / 1000
            });
        }

        TotalNumberOfPackages += InvoiceFooter.numberOfPackages;
        TotalValue += InvoiceFooter.totalValue;
        TotalGrossWeight += InvoiceFooter.totalWeight;
    }

    let InvoiceFooter = data[0].invoiceFooter;

    doc.setPage(doc.internal.getNumberOfPages());

    /***************************************************** Add SubHeader ******************************************************/
    doc.setFont("arial", "italic");
    doc.setFontSize(18);
    doc.text(400, 30, "Commercial Invoice");
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1.0);
    doc.line(20, 50, docWidth - 20, 50);

    /***************************************************** Add SubHeader ******************************************************/

    doc.setFont("arial", "normal");
    doc.setFontSize(12);

    var strInvoiceNumber = `Invoice Number : ${InvoiceHeader.invoiceNumber}`;
    doc.text(400, 70, strInvoiceNumber);

    var strSubHeaderInfo = `Seller : ${InvoiceHeader.sellerName}\n` +
        `Address : ${SellerAddress}\n` +
        `VAT NO : ${InvoiceHeader.sellerVatnumber}\n` +
        `EORI Number : ${InvoiceHeader.sellerEORInumber}\n` +
        "\n" +
        `Importer : ${InvoiceHeader.importerName}\n` +
        `Address : ${ImporterAddress}\n` +
        `VAT NO : ${InvoiceHeader.importerVatnumber}\n` +
        `EORI Number : ${InvoiceHeader.importerEORInumber}\n` +
        "\n" +
        `Inco Terms : ${InvoiceHeader.incoTerms}\n` +
        `Currency : ${InvoiceHeader.currencyCode}\n`;
    doc.text(20, 100, strSubHeaderInfo);

    // doc.setDrawColor(0, 0, 0);
    // doc.setLineWidth(1.0);
    // doc.line(20, 280, docWidth - 20, 310);

    /***************************************************** Add Detail ******************************************************/

    var tableStartY = 270;
    var tableMargin = 20;

    doc.autoTable({
        startY: tableStartY,
        margin: tableMargin,
        theme: 'grid',
        styles: {
            fontSize: 8
        },
        headStyles: {
            fillColor: [100, 100, 100],
            valign: 'middle',
            halign: 'center'
        },
        body: tableBody,
        columns: [
            { header: 'OrderLine No', dataKey: 'OrderLineNo' },
            { header: 'Quantity', dataKey: 'Units' },
            { header: 'Product Code/SKU', dataKey: 'ProductSKU' },
            { header: 'Description', dataKey: 'Description' },
            { header: 'Country Of Origin', dataKey: 'CountryOfOrigin' },
            { header: 'Tariff Number', dataKey: 'TariffNumber' },
            { header: 'Line Price', dataKey: 'LinePrice' },
            { header: 'Net Weight', dataKey: 'NetWeight' },
        ],
    });

    var tableBottom = doc.autoTable.previous.finalY;

    // doc.setPage(doc.internal.getNumberOfPages());
    // doc.setDrawColor(0, 0, 0);
    // doc.setLineWidth(1.0);
    // doc.line(20, tableBottom + 20, 575, tableBottom + 20);

    /***************************************************** Add SubFooter ******************************************************/

    let footerY = tableBottom + 40;
    if (tableBottom + 120 > docHeight) {
        doc.addPage();
        footerY = 30;
    }

    var strFooterInfo = `Number Of Packages : ${TotalNumberOfPackages}\n` +
        `Total Value : ${Math.round(TotalValue * 1000) / 1000}\n` +
        `Total Net Weight : ${Math.round(TotalGrossWeight * 1000) / 1000}\n` +
        "\n";
    doc.text(400, footerY, strFooterInfo);

    let bottomY = footerY + 100;
    if (bottomY + 500 > docHeight) {
        doc.addPage();
        bottomY = 30;
    }

    var strPrintName = `Print Name : Darrell Morris`;
    var strSignature = `Signature : `;
    var strPosition = `Position : CEO`;
    var strDate = `Date : ${InvoiceFooter.date}`;

    doc.text(20, bottomY, strPrintName);
    doc.text(300, bottomY, strPosition);
    doc.text(20, bottomY + 40, strSignature);
    doc.text(300, bottomY + 40, strDate);

    var imgSignature = "data:image/jpeg;base64,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";
    doc.addImage(imgSignature, 'jpeg', 80, bottomY + 20, 200, 90);

    // for (let i = 0; i < data.length; i++) {
    //     doc.setPage(doc.internal.getNumberOfPages());

    //     /***************************************************** Add SubHeader ******************************************************/
    //     doc.setFont("arial", "italic");
    //     doc.setFontSize(18);
    //     doc.text(400, 30, "Commercial Invoice");
    //     doc.setDrawColor(0, 0, 0);
    //     doc.setLineWidth(1.0);
    //     doc.line(20, 50, docWidth - 20, 50);

    //     let InvoiceHeader = data[i].invoiceHeader;
    //     let InvoiceDetails = data[i].invoiceDetails;
    //     let InvoiceFooter = data[i].invoiceFooter;


    //     /***************************************************** Add SubHeader ******************************************************/

    //     let SellerAddress = `${InvoiceHeader.sellerAddress1}  ${InvoiceHeader.sellerAddress2}  ${InvoiceHeader.sellerAddress3}  ` +
    //         `${InvoiceHeader.sellerCityOrTown}  ${InvoiceHeader.sellerStateProvinceCounty}  ${InvoiceHeader.sellerPostalCode}  ${InvoiceHeader.sellerCountry}`;

    //     let ImporterAddress = `${InvoiceHeader.importerAddress1}  ${InvoiceHeader.importerAddress2}  ${InvoiceHeader.importerAddress3}  ` +
    //         `${InvoiceHeader.importerCityOrTown}  ${InvoiceHeader.importerStateProvinceCounty}  ${InvoiceHeader.importerPostalCode}  ${InvoiceHeader.importerCountry}`;

    //     let CustomerAddress = `${InvoiceHeader.customerAddress1}  ${InvoiceHeader.customerAddress2}  ${InvoiceHeader.customerAddress3}  ` +
    //         `${InvoiceHeader.customerCity}  ${InvoiceHeader.customerPostalCode}  ${InvoiceHeader.customerCountry}`

    //     let MaxCharCountPerLine = 80;

    //     if (SellerAddress.length > MaxCharCountPerLine)
    //         SellerAddress = [SellerAddress.slice(0, MaxCharCountPerLine), "\n\t\t", SellerAddress.slice(MaxCharCountPerLine)].join('');
    //     if (ImporterAddress.length > MaxCharCountPerLine)
    //         ImporterAddress = [ImporterAddress.slice(0, MaxCharCountPerLine), "\n\t\t", ImporterAddress.slice(MaxCharCountPerLine)].join('');
    //     if (CustomerAddress.length > MaxCharCountPerLine)
    //         CustomerAddress = [CustomerAddress.slice(0, MaxCharCountPerLine), "\n\t\t", CustomerAddress.slice(MaxCharCountPerLine)].join('');

    //     doc.setFont("arial", "normal");
    //     doc.setFontSize(12);
    //     var strSubHeaderInfo = `Seller : ${InvoiceHeader.sellerName}\n` +
    //         `Address : ${SellerAddress}\n` +
    //         `VAT NO : ${InvoiceHeader.sellerVatEORInumber}\n` +
    //         "\n" +
    //         `Importer : ${InvoiceHeader.importerName}\n` +
    //         `Address : ${ImporterAddress}\n` +
    //         `EORI Number : ${InvoiceHeader.importerEORInumber}\n` +
    //         "\n" +
    //         `Address : ${CustomerAddress}\n` +
    //         "\n" +
    //         `Inco Terms : ${InvoiceHeader.incoTerms}\n` +
    //         `Currency : ${InvoiceHeader.currencyCode}\n`;
    //     doc.text(20, 80, strSubHeaderInfo);

    //     // doc.setDrawColor(0, 0, 0);
    //     // doc.setLineWidth(1.0);
    //     // doc.line(20, 280, docWidth - 20, 310);

    //     /***************************************************** Add Detail ******************************************************/

    //     var tableStartY = 300;
    //     var tableMargin = 20;
    //     var tableBody = [];
    //     var rowCount = InvoiceDetails.length;
    //     for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    //         tableBody.push({
    //             OrderLineNo: InvoiceDetails[rowIndex].orderLineNo,
    //             Units: InvoiceDetails[rowIndex].units,
    //             ProductSKU: InvoiceDetails[rowIndex].productSKU,
    //             Description: InvoiceDetails[rowIndex].descriptionOfGood,
    //             CountryOfOrigin: InvoiceDetails[rowIndex].countryOfOrigin,
    //             TariffNumber: InvoiceDetails[rowIndex].tariffNumber,
    //             LinePrice: Math.round(InvoiceDetails[rowIndex].linePrice * 1000) / 1000,
    //             NetWeight: Math.round(InvoiceDetails[rowIndex].netWeight * 1000) / 1000
    //         });
    //     }

    //     doc.autoTable({
    //         startY: tableStartY,
    //         margin: tableMargin,
    //         theme: 'grid',
    //         headStyles: {
    //             fillColor: [100, 100, 100],
    //             valign: 'middle',
    //             halign: 'center'
    //         },
    //         body: tableBody,
    //         columns: [
    //             { header: 'OrderLine No', dataKey: 'OrderLineNo' },
    //             { header: 'Quantity', dataKey: 'Units' },
    //             { header: 'Product Code/SKU', dataKey: 'ProductSKU' },
    //             { header: 'Description', dataKey: 'Description' },
    //             { header: 'Country Of Origin', dataKey: 'CountryOfOrigin' },
    //             { header: 'Tariff Number', dataKey: 'TariffNumber' },
    //             { header: 'Line Price', dataKey: 'LinePrice' },
    //             { header: 'Gross Weight', dataKey: 'NetWeight' },
    //         ],
    //     });

    //     var tableBottom = doc.autoTable.previous.finalY;

    //     // doc.setPage(doc.internal.getNumberOfPages());
    //     // doc.setDrawColor(0, 0, 0);
    //     // doc.setLineWidth(1.0);
    //     // doc.line(20, tableBottom + 20, 575, tableBottom + 20);

    //     /***************************************************** Add SubFooter ******************************************************/

    //     let footerY = tableBottom + 40;
    //     if (tableBottom + 120 > docHeight) {
    //         doc.addPage();
    //         footerY = 30;
    //     }

    //     var strFooterInfo = `Number Of Packages : ${TotalNumberOfPackages}\n` +
    //         `Total Value : ${Math.round(TotalValue * 1000) / 1000}\n` +
    //         `Total Gross Weight : ${Math.round(TotalGrossWeight * 1000) / 1000}\n` +
    //         "\n";
    //     doc.text(400, footerY, strFooterInfo);

    //     let bottomY = footerY + 100;
    //     if (footerY + 100 > docHeight) {
    //         doc.addPage();
    //         bottomY = 30;
    //     }

    //     var strPrintName = `Print Name : Darrell Morris`;
    //     var strSignature = `Signature : `;
    //     var strPosition = `Position : CEO`;
    //     var strDate = `Date : ${InvoiceFooter.date}`;

    //     doc.text(20, bottomY, strPrintName);
    //     doc.text(300, bottomY, strPosition);
    //     doc.text(20, bottomY + 40, strSignature);
    //     doc.text(300, bottomY + 40, strDate);

    //     var imgSignature = "data:image/jpeg;base64,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";
    //     doc.addImage(imgSignature, 'jpeg', 80, bottomY + 20, 200, 90);

    //     if (i < data.length - 1) doc.addPage();
    // }

    window.open(doc.output('bloburl'), '_blank');
}


$('#btn-create-invoice').click(function() {
    if (CurrentTrailerId == null) {
        customAlert("Please Search Or Create Trailer");
        return;
    }

    $.get(`/api/ApiGeneral/CreateCommercialInvoice?TrailerId=${CurrentTrailerId}`, function(data) {
        if (data.length == 0) {
            customAlert("Trailer Is Empty! Plesae Add OrderNumber.");
            return;
        }
        GeneratePDFFromInvoice(data);
    });
});