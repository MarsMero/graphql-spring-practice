package me.mars.data;

import io.leangen.graphql.annotations.types.GraphQLType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Marcin Szwałko
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@GraphQLType(name = "PlacedOrderUnit")
public class PlacedOrderUnitData {
    private String color;
    private String size;
    private Integer amount;
}
