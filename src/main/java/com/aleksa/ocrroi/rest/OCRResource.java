package com.aleksa.ocrroi.rest;

import com.aleksa.ocrroi.domain.DocumentType;
import com.aleksa.ocrroi.service.OCRService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@AllArgsConstructor
public class OCRResource {

    private final OCRService ocrService;

    @PostMapping("ocr")
    public Map<String, String> ocr(@RequestParam(name = "image-file") MultipartFile image, @RequestParam(name = "document-type") String documentTypeName) throws Exception {
        return ocrService.ocrDocumentTypeROIs(documentTypeName, image);
    }

    @PostMapping("document-type")
    public void saveDocumentType(@RequestBody List<DocumentType> documentTypes) {
        ocrService.saveDocumentTypeList(documentTypes);
    }

}
