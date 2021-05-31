var addDocumentTypeButton = $('#add-document-type');
var documentTypeListOutput = $('#document-type-list');
var fieldListOutput = $('#field-list');
var image = document.getElementById('image');
var documentTypeNameInput = $('#document-type-name');
var documentTypeFileInput = $('#document-type-file');
var documentTypeIdInput = $('#document-type-id');
var fieldNameInput = $('#field-name');
var fieldIdInput = $('#field-id');
var documentTypeForm = $('#document-type-form');
var fieldForm = $('#field-form');
var uploadPlaceholder = $('#upload-placeholder');
var imageContainer = $('#image-container');
var saveBtn = $('#save-btn');
var documentTypeList = [];
var currentDocumentTypeId;
var currentFieldId;
var cropper;

addDocumentTypeButton.click(function () {
    if (currentDocumentTypeId == null) {
        createDocumentType();
    } else {
        updateDocumentType();
    }
});

function createDocumentType() {
    destroyCropper();
    var documentTypeName = documentTypeNameInput.val();
    if (!validateDocumentTypeForm(documentTypeName) || !validateDocumentTypeImage(documentTypeFileInput, true))
        return;

    var documentTypeId = Date.now();
    var documentTypeItem = getDocumentTypeItem(documentTypeId, documentTypeName, image.src);
    documentTypeListOutput.append(documentTypeItem);
    documentTypeList[documentTypeId] = {
        name: documentTypeName,
        imageURL: image.src,
        fields: []
    };
    documentTypeForm[0].reset();
    replaceImageContainer();
}

function updateDocumentType() {
    // TODO update
}

function validateDocumentTypeForm(documentTypeName) {
    if (documentTypeName.length < 3) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Document type name must have at least 3 characters!',
        });
        return false;
    }

    for (index in documentTypeList) {
        if (documentTypeList[index].name === documentTypeName) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Document type with given name already exists!',
            });
            return false;
        }
    }

    return true;
}

function validateDocumentTypeImage(documentTypeFileInput, isRequired) {
    if (documentTypeFileInput.get(0).files.length == 0) {
        if (!isRequired)
            return true;
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Document type sample image is missing!',
        });
        return false;
    }

    var documentTypeFile = documentTypeFileInput.get(0).files[0];
    var fileType = documentTypeFile["type"];
    var validImageTypes = ["image/jpg", "image/jpeg", "image/png"];
    if ($.inArray(fileType, validImageTypes) < 0) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Invalid sample image file type!',
        });
        return false;
    }

    return true;
}

function deleteDocumentType(documentTypeId) {
    if (documentTypeId == currentDocumentTypeId) {
        destroyCropper();
        replaceImageContainer();
        image.src = '';
        currentDocumentTypeId = null;
    }
    delete documentTypeList[documentTypeId];
    $("#document-type-" + documentTypeId).remove();
}

documentTypeListOutput.on("click", "span.delete-document-type", function () {
    var documentTypeId = $(this).data("document-type-id");
    deleteDocumentType(documentTypeId);
});

function initCropper() {
    cropper = new Cropper(image, {
        viewMode: 3
    });
}

function destroyCropper() {
    if (cropper == null)
        return;
    cropper.destroy();
    cropper = null;
}

async function refreshCropper() {
    destroyCropper();
    await setTimeout(initCropper(), 1000);
}

documentTypeListOutput.on("click", "div.edit-document-type", function () {
    var documentTypeId = $(this).data("document-type-id");
    var documentType = documentTypeList[documentTypeId];
    currentDocumentTypeId = documentTypeId;
    documentTypeIdInput.val(documentTypeId);
    documentTypeNameInput.val(documentType.name);
    replaceUploadPlaceholder();
    displayDocumentTypeImage(documentType.imageURL);
    refreshFieldList(documentType.fields);
});

function displayDocumentTypeImage(imageUrl) {
    image.src = imageUrl;
    refreshCropper();
}

documentTypeFileInput.on('change', function (e) {
    replaceUploadPlaceholder();
    destroyCropper();
    if (!validateDocumentTypeImage(documentTypeFileInput, true))
        return;
    var documentTypeFile = documentTypeFileInput.get(0).files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        image.src = reader.result;
    };
    reader.readAsDataURL(documentTypeFile);
});

$('#add-field').click(function () {
    if (currentDocumentTypeId == null)
        return;

    if (fieldNameInput.val().length < 3) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Document type field must be at least 3 characters long!',
        });
        return;
    }

    var currentDocumentType = documentTypeList[currentDocumentTypeId];
    for (index in currentDocumentType.fields) {
        if (currentDocumentType.fields[index].name === fieldNameInput.val()) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Field name with given name already exists for this document type!',
            });
            return;
        }
    }

    var fieldId = Date.now();
    var field = cropper.getData();
    field.name = fieldNameInput.val();
    currentDocumentType.fields[fieldId] = field;
    var fieldListItem = getFieldItem(fieldId, field.name);
    fieldListOutput.append(fieldListItem);
    fieldForm[0].reset();
    refreshCropper();
});

fieldListOutput.on("click", "span.delete-field", function () {
    var fieldId = $(this).data("field-id");
    deleteField(fieldId);
});

function deleteField(fieldId) {
    if (fieldId == currentFieldId) {
        refreshCropper();
        currentFieldId = null;
    }
    delete documentTypeList[currentDocumentTypeId].fields[fieldId];
    $("#field-" + fieldId).remove();
}

fieldListOutput.on("click", "div.edit-field", function () {
    var fieldId = $(this).data("field-id");
    currentFieldId = fieldId;
    var field = documentTypeList[currentDocumentTypeId].fields[currentFieldId];
    fieldIdInput.val(fieldId);
    fieldNameInput.val(field.name);
    cropper.setData(field);
});

$('#new-document-type').on("click", function () {
    currentDocumentTypeId = null;
    currentFieldId = null;
    documentTypeForm[0].reset();
    fieldForm[0].reset();
    destroyCropper();
    replaceImageContainer();
    image.src = '';
});

$('#new-field').on("click", function () {
    currentFieldId = null;
    fieldForm[0].reset();
    refreshCropper();
});

function refreshFieldList(fields) {
    fieldListOutput.empty();
    for (index in fields) {
        var fieldListItem = getFieldItem(index, fields[index].name);
        fieldListOutput.append(fieldListItem);
    }
}

function replaceUploadPlaceholder() {
    uploadPlaceholder.hide();
    imageContainer.show();
}

function replaceImageContainer() {
    imageContainer.hide();
    uploadPlaceholder.show();
}

uploadPlaceholder.click(function () {
    documentTypeFileInput.trigger('click');
});

saveBtn.click(function () {
    var data = [];
    for (index in documentTypeList) {
        var tempDocumentType = documentTypeList[index];
        var tempDocumentTypeFields = [];
        for(fieldIndex in tempDocumentType.fields){
            var tempField = tempDocumentType.fields[fieldIndex];
            tempDocumentTypeFields.push({
               name:  tempField.name,
                x: parseInt(tempField.x),
                y: parseInt(tempField.y),
                width: parseInt(tempField.width),
                height: parseInt(tempField.height),
                scaleX: parseInt(tempField.scaleX),
                scaleY: parseInt(tempField.scaleY)
            });
        }
        data.push({
            name: tempDocumentType.name,
            fields: tempDocumentTypeFields
        });
    }

    jQuery.ajax({
        url: 'document-type',
        data: JSON.stringify(data),
        cache: false,
        contentType: "application/json",
        processData: false,
        method: 'POST',
        type: 'POST',
        success: function () {
            Swal.fire(
                'Good job!',
                'Document types saved sucesfully!',
                'success'
            );
        },
        error: function () {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error performing OCR!'
            });
        }
    });
});