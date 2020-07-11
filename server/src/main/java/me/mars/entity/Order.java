package me.mars.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents user's order.
 *
 * @author Marcin Szwałko
 */
@Entity
@Data
@NoArgsConstructor
@Table(name = "custom_order")
public class Order {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private Integer age;
    private Instant timestamp;
    @OneToMany(mappedBy = "unit")
    private List<OrderUnit> orderUnits = new ArrayList<>();
}
