package me.mars.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents possible combination of colors and sizes.
 *
 * @author Marcin Szwałko
 */
@Entity
@Data
@NoArgsConstructor
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"color_id", "size_id"}))
public class Unit {
    @Id
    @GeneratedValue
    private Long id;
    @ManyToOne
    @JoinColumn(name = "color_id", foreignKey = @ForeignKey(name = "unit_color_id_fk"))
    private Color color;
    @ManyToOne
    @JoinColumn(name = "size_id", foreignKey = @ForeignKey(name= "unit_size_id_fk"))
    private Size size;
    @OneToMany(mappedBy = "order")
    private List<OrderUnit> orderUnits = new ArrayList<>();
    @NotNull
    private Integer stockAmount;

    public Unit(Color color, Size size, Integer stockAmount) {
        this.color = color;
        this.size = size;
        this.stockAmount = stockAmount;
    }
}
