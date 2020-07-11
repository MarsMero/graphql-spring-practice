package me.mars.service;

import io.leangen.graphql.annotations.GraphQLArgument;
import io.leangen.graphql.annotations.GraphQLMutation;
import io.leangen.graphql.annotations.GraphQLNonNull;
import io.leangen.graphql.annotations.GraphQLQuery;
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi;
import me.mars.data.ColorData;
import me.mars.data.PlaceOrderData;
import me.mars.data.PlacedOrderData;
import me.mars.data.PlacedOrderUnitData;
import me.mars.data.UnitData;
import me.mars.entity.Order;
import me.mars.entity.OrderUnit;
import me.mars.repository.ColorRepository;
import me.mars.repository.OrderRepository;
import me.mars.repository.OrderUnitRepository;
import me.mars.repository.SizeRepository;
import me.mars.repository.UnitRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author Marcin Szwałko
 */
@GraphQLApi
@Service
public class OrderService {
    private OrderRepository orderRepository;
    private OrderUnitRepository orderUnitRepository;
    private ColorRepository colorRepository;
    private UnitRepository unitRepository;
    private SizeRepository sizeRepository;

    public OrderService(OrderRepository orderRepository, OrderUnitRepository orderUnitRepository,
                        ColorRepository colorRepository, UnitRepository unitRepository, SizeRepository sizeRepository) {
        this.orderRepository = orderRepository;
        this.orderUnitRepository = orderUnitRepository;
        this.colorRepository = colorRepository;
        this.unitRepository = unitRepository;
        this.sizeRepository = sizeRepository;
    }

    @GraphQLQuery
    public List<PlacedOrderData> orders() {
        return orderRepository.findAll().stream().map(order -> {
            var unitDataList =
            orderUnitRepository.findAllByOrderId(order.getId()).stream().map(orderUnit -> {
                var unit = orderUnit.getUnit();
                return new PlacedOrderUnitData(unit.getColor().getName(), unit.getSize().getName(), orderUnit.getAmount());
            }).collect(Collectors.toList());
            return new PlacedOrderData(order.getName(), order.getAge(), order.getTimestamp(), unitDataList);
        }).collect(Collectors.toList());
    }

    @GraphQLQuery
    public List<ColorData> colors() {
        return colorRepository.findAll().stream().map(color -> new ColorData(color.getName(), color.getHexCode())).collect(Collectors.toList());
    }

    @GraphQLQuery
    public List<UnitData> units() {
        return unitRepository.findAll().stream()
                .map(unit -> new UnitData(unit.getColor().getName(), unit.getSize().getName(), unit.getStockAmount()))
                .collect(Collectors.toList());
    }

    @GraphQLMutation
    public boolean placeOrder(@GraphQLNonNull @GraphQLArgument(name = "params") PlaceOrderData placeOrder) {
        var order = createOrder(placeOrder.getName(), placeOrder.getAge());
        for (var unit : placeOrder.getUnits()) {
            addUnitToOrder(order.getId(),unit.getColor(), unit.getSize(), unit.getAmount());
        }
        return true;
    }

    public Order createOrder(String name, Integer age) {
        var order = new Order();
        order.setName(name);
        order.setAge(age);
        order.setTimestamp(Instant.now());
        return orderRepository.save(order);
    }

    public OrderUnit addUnitToOrder(Long orderId, String colorName, String sizeName, Integer amount) {
        if (amount == null || amount < 1) {
            throw new IllegalArgumentException();
        }
        var color = colorRepository.findByName(colorName).orElseThrow();
        var size = sizeRepository.findByName(sizeName).orElseThrow();
        var unit = unitRepository.findUnitByColorIdAndSizeId(color.getId(), size.getId()).orElseThrow();
        var order = orderRepository.findById(orderId).orElseThrow();
        if (amount > unit.getStockAmount()) {
            throw new IllegalArgumentException("Requested amount is greater than available");
        }
        unit.setStockAmount(unit.getStockAmount() - amount);
        var orderUnit = new OrderUnit();
        orderUnit.setOrder(order);
        orderUnit.setUnit(unit);
        orderUnit.setAmount(amount);
        order.getOrderUnits().add(orderUnit);
        return orderUnitRepository.save(orderUnit);
    }
}
