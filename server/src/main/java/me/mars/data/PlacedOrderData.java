package me.mars.data;

import io.leangen.graphql.annotations.GraphQLId;
import io.leangen.graphql.annotations.types.GraphQLType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

/**
 * @author Marcin Szwałko
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@GraphQLType(name = "PlacedOrder")
public class PlacedOrderData {
    @GraphQLId()
    private Long id;
    private String name;
    private Integer age;
    private Instant timestamp;
    private List<OrderUnitData> units;
}
