package me.mars.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;

/**
 * Associative table of Order and Unit
 *
 * @author Marcin Szwałko
 */
@Entity
@NoArgsConstructor
@Data
public class OrderUnit {
    @EmbeddedId
    private OrderUnitId orderUnitId = new OrderUnitId();
    @ManyToOne
    @MapsId("orderId")
    private Order order;
    @ManyToOne
    @MapsId("unitId")
    private Unit unit;
    private Integer amount;
}