function getDocumentTypeItem(id, name, imageUrl) {
    return `<li class="new-item mt-1" id="document-type-` + id + `">
    <div class="list-content">
        <div data-document-type-id="` + id + `" class="edit-document-type">
            <span class="preview p-2">
                <img class="list-image"
                    src="` + imageUrl + `" />
            </span>
            <span class="name">
                ` + name + `
            </span>
        </div>
        <span data-document-type-id="` + id + `" class="options delete-document-type pr-5">
            <i class="fas fa-trash"></i>
        </span>
    </div>
</li>`;
}

function getFieldItem(id, name) {
    return `<li class="new-item mt-1" id="field-` + id + `">
    <div class="list-content">
        <div data-field-id="` + id + `" class="edit-field">
            <span class="name">
                ` + name + `
            </span>
        </div>
        <span data-field-id="` + id + `" class="options delete-field pr-5">
            <i class="fas fa-trash"></i>
        </span>
    </div>
</li>`;
}