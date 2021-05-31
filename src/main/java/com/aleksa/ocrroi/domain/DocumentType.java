package com.aleksa.ocrroi.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class DocumentType {

    private String name;
    private List<Field> fields;

}
