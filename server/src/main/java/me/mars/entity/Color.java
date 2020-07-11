package me.mars.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

/**
 * Represents unit color
 *
 * @author Marcin Szwałko
 */
@Entity
@Data
@NoArgsConstructor
public class Color {
    @Id
    @GeneratedValue
    private Long id;
    @Column(unique = true)
    private String name;
    private String hexCode;

    public Color(String name) {
        this.name = name;
    }

    public Color(String name, String hexCode) {
        this.name = name;
        this.hexCode = hexCode;
    }
}