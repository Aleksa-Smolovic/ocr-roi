package com.aleksa.ocrroi.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class Field {

    private String name;
    private Integer x;
    private Integer y;
    private Integer width;
    private Integer height;
    private Integer rotate;
    private Integer scaleY;
    private Integer scaleX;

}
