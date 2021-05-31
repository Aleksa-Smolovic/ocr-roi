package com.aleksa.ocrroi.service;

import com.aleksa.ocrroi.domain.DocumentType;
import com.aleksa.ocrroi.domain.Field;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.awt.*;
import java.io.IOException;
import java.util.*;
import java.io.File;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OCRService {

    private List<DocumentType> documentTypes = new ArrayList<>();

    public List<String> getDocumentTypesNames() {
        return documentTypes.parallelStream().map(DocumentType::getName).collect(Collectors.toList());
    }

    public List<DocumentType> getDocumentTypes() {
        return documentTypes;
    }

    public void saveDocumentTypeList(List<DocumentType> documentTypeList) {
        documentTypes = documentTypeList;
    }

    private String ocrRoi(Field field, MultipartFile image) throws TesseractException, IOException {
        File tempFile = File.createTempFile("ocr_image-", "." + FilenameUtils.getExtension(image.getOriginalFilename()));
        FileUtils.writeByteArrayToFile(tempFile, image.getBytes());
        tempFile.deleteOnExit();
        Tesseract tesseract = new Tesseract();
        tesseract.setDatapath("src/main/resources/tessdata");
        tesseract.setLanguage("eng");
        tesseract.setPageSegMode(1);
        tesseract.setOcrEngineMode(1);
        return tesseract.doOCR(tempFile, new Rectangle(field.getX(), field.getY(), field.getWidth(), field.getHeight()));
    }

    private Optional<DocumentType> findDocumentTypeByName(String documentTypeName) {
        return documentTypes.parallelStream().filter(s -> s.getName().equalsIgnoreCase(documentTypeName)).findFirst();
    }

    public Map<String, String> ocrDocumentTypeROIs(String documentTypeName, MultipartFile image) throws Exception {
        DocumentType documentType = findDocumentTypeByName(documentTypeName).orElseThrow(() -> new Exception("Error"));
        Map<String, String> fieldsValues = new HashMap<>();
        documentType.getFields().forEach(s -> {
            try {
                fieldsValues.put(s.getName(), ocrRoi(s, image));
            } catch (TesseractException | IOException e) {
                e.printStackTrace();
            }
        });
        return fieldsValues;
    }

}
