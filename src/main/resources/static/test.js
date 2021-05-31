var uploadPlaceholder = $('#upload-placeholder');
var imageContainer = $('#image-container');
var imageFile = $('#image-file');
var documentTypeInput = $('#document-type');
var image = $('#image');
var ocrButton = $('#perform-ocr');
var fieldTable = $('#field-table-body');

function replaceUploadPlaceholder() {
    uploadPlaceholder.hide();
    imageContainer.show();
}

function replaceImageContainer() {
    imageContainer.hide();
    uploadPlaceholder.show();
}

uploadPlaceholder.click(function () {
    imageFile.trigger('click');
});

imageFile.on('change', function (e) {
    if (!validateDocumentTypeImage(imageFile, false))
        return;
    var imageValue = imageFile.get(0).files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        image.attr('src', reader.result);
    };
    replaceUploadPlaceholder();
    reader.readAsDataURL(imageValue);
});

function validateDocumentTypeImage(file, isRequired) {
    if (file.get(0).files.length === 0) {
        if(!isRequired)
            return false;
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Image is missing!',
        });
        return false;
    }

    var validationImage = file.get(0).files[0];
    var fileType = validationImage["type"];
    var validImageTypes = ["image/jpg", "image/jpeg", "image/png"];
    if ($.inArray(fileType, validImageTypes) < 0) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Invalid image file type!',
        });
        return false;
    }

    return true;
}

ocrButton.click(function () {
    var documentType = documentTypeInput.val();
    if (!documentType) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Document type not selected!',
        });
        return;
    }
    if (!validateDocumentTypeImage(imageFile, true))
        return;

    ocr();
});

function ocr() {
    var data = new FormData();
    data.append('document-type', documentTypeInput.val());
    data.append('image-file', imageFile.get(0).files[0]);

    jQuery.ajax({
        url: 'ocr',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        method: 'POST',
        type: 'POST',
        success: function (data) {
            populateTable(data);
        },
        error: function () {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error performing OCR!'
            });
        }
    });
}

function populateTable(fields){
    fieldTable.empty();
    var rows = '';
    $.each(fields, function(index, value) {
        rows += '<tr><td>' + index + '</td><td>' + value +
            '</td></tr>';
    });
    fieldTable.append(rows);
}