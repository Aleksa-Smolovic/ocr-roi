package com.aleksa.ocrroi.rest;

import com.aleksa.ocrroi.domain.DocumentType;
import com.aleksa.ocrroi.service.OCRService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@AllArgsConstructor
@Controller
public class OCRController {

    private final OCRService ocrService;

    @RequestMapping("ocr-test")
    public String  test(Model model){
        List<String> documentTypesNames = ocrService.getDocumentTypesNames();
        model.addAttribute("documentTypes", documentTypesNames);
        return "test";
    }

    @RequestMapping("/")
    public String  documentTypes(Model model){
        List<DocumentType> documentTypes = ocrService.getDocumentTypes();
        model.addAttribute("documentTypes", documentTypes);
        return "index";
    }

}
