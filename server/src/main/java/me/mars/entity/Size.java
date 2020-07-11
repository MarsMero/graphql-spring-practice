package me.mars.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

/**
 * Represents unit's size;
 *
 * @author Marcin Szwałko
 */
@Entity
@Data
@NoArgsConstructor
public class Size {
    @Id
    @GeneratedValue
    private Long id;
    @Column(unique = true)
    private String name;

    public Size(String name) {
        this.name = name;
    }
}
