package me.mars.entity;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Embeddable;
import java.io.Serializable;

/**
 * Is a key for OrderUnit
 * @author Marcin Szwałko
 */
@NoArgsConstructor
@EqualsAndHashCode
@Getter
@Setter
@Embeddable
public class OrderUnitId implements Serializable {
    private Long orderId;
    private Long unitId;
}
