'use strict';

$('#btn-add-order').click(function () {
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
});

$('#btn-create-invoice').click(function () {
    window.open('/Home/CommercialInvoice/19345', '_blank');
});

