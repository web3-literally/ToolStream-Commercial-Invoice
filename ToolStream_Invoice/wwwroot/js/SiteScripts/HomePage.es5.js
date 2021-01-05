"use strict";

var CurrentTrailerId = null;

function emptyOrderListTable() {
    $('#orders-table tbody').empty();
}

function showOrderListTable(orderNoList) {
    emptyOrderListTable();
    orderNoList.forEach(function (OrderNumber) {
        if (!OrderNumber) return;

        var orderRow = "<tr>" + ("<td>" + OrderNumber + "</td>") + "</tr>";
        $('#orders-table tbody').append(orderRow);
    });
}

function searchTrailer(search_trailer_id) {
    $.get("/api/ApiGeneral/SearchExistingTrailer?TrailerId=" + search_trailer_id, function (data) {
        var trailerId = 0;
        var orderNoList = [];

        if (data.length == 0) {
            customAlert("Not Found Trailer");
            CurrentTrailerId = null;
            $('#trailer-id').html("Not Found");
            return;
        }

        for (var i = 0; i < data.length; i++) {
            trailerId = data[i].trailerId;
            orderNoList.push(data[i].orderNumber);
        }

        $('#trailer-id').html(trailerId);
        showOrderListTable(orderNoList);
        CurrentTrailerId = trailerId;
    });
}

$('#btn-search-trailer').click(function () {
    var search_trailer_id = $('#search-trailer-id').val();
    if (!search_trailer_id) {
        customAlert("Please Input TrailerId");
        return;
    }

    searchTrailer(search_trailer_id);
});

$('#btn-create-trailer').click(function () {
    $.get("/api/ApiGeneral/CreateNewTrailer", function (data) {
        emptyOrderListTable();
        var trailerId = data;
        $('#trailer-id').html(trailerId);
        CurrentTrailerId = trailerId;
    });
});

$('#btn-add-order').click(function () {
    if (CurrentTrailerId == null) {
        customAlert("Please Search Or Create Trailer");
        return;
    }

    $('#modal-add-order').modal();
});

$('#btn-confirm-add-order').click(function () {
    var bValid = true;
    $('#modal-add-order').find('input, select').each(function () {
        if ($(this).is(':visible') && $(this).prop('required') && ($(this).val() == null || $(this).val() === "")) {
            $(this).addClass('is-invalid');
            bValid = false;
        } else {
            $(this).removeClass('is-invalid');
        }
    });
    if (!bValid) return;
    $('#modal-add-order').modal("hide");

    var OrderNumber = $('#add-order-number').val();
    $.get("/api/ApiGeneral/AddOrderToTrailer?TrailerId=" + CurrentTrailerId + "&OrderNumber=" + OrderNumber, function (data) {
        if (data == "Success") {
            searchTrailer(CurrentTrailerId);
            customAlert("Success", true);
        } else customAlert(data);
    });
});

$('#btn-remove-order').click(function () {
    if (CurrentTrailerId == null) {
        customAlert("Please Search Or Create Trailer");
        return;
    }

    $('#modal-remove-order').modal();
});

$('#btn-confirm-remove-order').click(function () {
    var bValid = true;
    $('#modal-remove-order').find('input, select').each(function () {
        if ($(this).is(':visible') && $(this).prop('required') && ($(this).val() == null || $(this).val() === "")) {
            $(this).addClass('is-invalid');
            bValid = false;
        } else {
            $(this).removeClass('is-invalid');
        }
    });
    if (!bValid) return;
    $('#modal-remove-order').modal("hide");

    var OrderNumber = $('#remove-order-number').val();
    $.get("/api/ApiGeneral/RemoveOrderFromTrailer?TrailerId=" + CurrentTrailerId + "&OrderNumber=" + OrderNumber, function (data) {
        if (data == "Success") {
            searchTrailer(CurrentTrailerId);
            customAlert("Success", true);
        } else customAlert(data);
    });
});

function GeneratePDFFromInvoice(data) {
    var docWidth = 595;
    var docHeight = 842;
    var doc = new jsPDF("portrait", "pt", "a4"); //595 � 842

    for (var i = 0; i < data.length; i++) {
        doc.setPage(doc.internal.getNumberOfPages());

        /***************************************************** Add SubHeader ******************************************************/
        doc.setFont("arial", "italic");
        doc.setFontSize(18);
        doc.text(400, 30, "Commercial Invoice");
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(1.0);
        doc.line(20, 50, docWidth - 20, 50);

        var InvoiceHeader = data[i].invoiceHeader;
        var InvoiceDetails = data[i].invoiceDetails;
        var InvoiceFooter = data[i].invoiceFooter;

        /***************************************************** Add SubHeader ******************************************************/

        var SellerAddress = InvoiceHeader.sellerAddress1 + "  " + InvoiceHeader.sellerAddress2 + "  " + InvoiceHeader.sellerAddress3 + "  " + (InvoiceHeader.sellerCityOrTown + "  " + InvoiceHeader.sellerStateProvinceCounty + "  " + InvoiceHeader.sellerPostalCode + "  " + InvoiceHeader.sellerCountry);

        var ImporterAddress = InvoiceHeader.importerAddress1 + "  " + InvoiceHeader.importerAddress2 + "  " + InvoiceHeader.importerAddress3 + "  " + (InvoiceHeader.importerCityOrTown + "  " + InvoiceHeader.importerStateProvinceCounty + "  " + InvoiceHeader.importerPostalCode + "  " + InvoiceHeader.importerCountry);

        var CustomerAddress = InvoiceHeader.customerAddress1 + "  " + InvoiceHeader.customerAddress2 + "  " + InvoiceHeader.customerAddress3 + "  " + (InvoiceHeader.customerCity + "  " + InvoiceHeader.customerPostalCode + "  " + InvoiceHeader.customerCountry);

        var MaxCharCountPerLine = 80;

        if (SellerAddress.length > MaxCharCountPerLine) SellerAddress = [SellerAddress.slice(0, MaxCharCountPerLine), "\n\t\t", SellerAddress.slice(MaxCharCountPerLine)].join('');
        if (ImporterAddress.length > MaxCharCountPerLine) ImporterAddress = [ImporterAddress.slice(0, MaxCharCountPerLine), "\n\t\t", ImporterAddress.slice(MaxCharCountPerLine)].join('');
        if (CustomerAddress.length > MaxCharCountPerLine) CustomerAddress = [CustomerAddress.slice(0, MaxCharCountPerLine), "\n\t\t", CustomerAddress.slice(MaxCharCountPerLine)].join('');

        doc.setFont("arial", "normal");
        doc.setFontSize(12);
        var strSubHeaderInfo = "Seller : " + InvoiceHeader.sellerName + "\n" + ("Address : " + SellerAddress + "\n") + "VAT NO : \n" + "\n" + ("Importer : " + InvoiceHeader.importerName + "\n") + ("Address : " + ImporterAddress + "\n") + "EORI Number : \n" + "\n" + ("Delivery Address : " + InvoiceHeader.customer + "\n") + ("Address : " + CustomerAddress + "\n") + "\n" + ("Vat : " + InvoiceHeader.vatState + "  " + InvoiceHeader.vatNumber + "\n") + ("Inco Terms : " + InvoiceHeader.incoTerms + "\n") + ("Currency : " + InvoiceHeader.currencyCode + "\n");
        doc.text(20, 80, strSubHeaderInfo);
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(1.0);
        doc.line(20, 310, docWidth - 20, 310);

        /***************************************************** Add Detail ******************************************************/

        var tableStartY = 330;
        var tableMargin = 20;
        var tableBody = [];
        var rowCount = InvoiceDetails.length;
        for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            tableBody.push({
                OrderLineNo: InvoiceDetails[rowIndex].orderLineNo,
                ProductSKU: InvoiceDetails[rowIndex].productSKU,
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
            columns: [{ header: 'OrderLine No', dataKey: 'OrderLineNo' }, { header: 'Product Code/SKU', dataKey: 'ProductSKU' }, { header: 'Country Of Origin', dataKey: 'CountryOfOrigin' }, { header: 'Tariff Number', dataKey: 'TariffNumber' }, { header: 'Line Price', dataKey: 'LinePrice' }, { header: 'Gross Weight', dataKey: 'NetWeight' }]
        });

        var tableCellHeight = 22.5;
        var tableBottom = tableStartY + (rowCount + 1) * tableCellHeight;
        while (tableBottom >= docHeight - tableMargin) tableBottom = tableBottom - docHeight + tableCellHeight + tableMargin;

        doc.setPage(doc.internal.getNumberOfPages());
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(1.0);
        doc.line(20, tableBottom + 20, 575, tableBottom + 20);

        /***************************************************** Add SubFooter ******************************************************/

        var footerY = tableBottom + 40;
        if (tableBottom + 120 > docHeight) {
            doc.addPage();
            footerY = 30;
        }

        var strFooterInfo = "Order Number : " + InvoiceFooter.orderNumber + "\n" + ("Number Of Packages : " + InvoiceFooter.numberOfPackages + "\n") + ("Total Value : " + Math.round(InvoiceFooter.totalValue * 1000) / 1000 + "\n") + ("Total Gross Weight : " + Math.round(InvoiceFooter.totalWeight * 1000) / 1000 + "\n") + "\n";
        doc.text(400, footerY, strFooterInfo);

        var bottomY = footerY + 100;
        if (footerY + 100 > docHeight) {
            doc.addPage();
            bottomY = 30;
        }

        var strPrintName = "Print Name : " + InvoiceFooter.printName;
        var strSignature = "Signature : " + InvoiceFooter.signature;
        var strPosition = "Position : " + InvoiceFooter.position;
        var strDate = "Date : " + InvoiceFooter.date;

        doc.text(20, bottomY, strPrintName);
        doc.text(300, bottomY, strPosition);
        doc.text(20, bottomY + 40, strSignature);
        doc.text(300, bottomY + 40, strDate);

        if (i < data.length - 1) doc.addPage();
    }

    window.open(doc.output('bloburl'), '_blank');
}

$('#btn-create-invoice').click(function () {
    if (CurrentTrailerId == null) {
        customAlert("Please Search Or Create Trailer");
        return;
    }

    $.get("/api/ApiGeneral/CreateCommercialInvoice?TrailerId=" + CurrentTrailerId, function (data) {
        if (data.length == 0) {
            customAlert("Trailer Is Empty! Plesae Add OrderNumber.");
            return;
        }
        GeneratePDFFromInvoice(data);
    });
});

