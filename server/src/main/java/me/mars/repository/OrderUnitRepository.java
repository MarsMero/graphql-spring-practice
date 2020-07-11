package me.mars.repository;

import me.mars.entity.OrderUnit;
import me.mars.entity.OrderUnitId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * @author Marcin Szwałko
 */
public interface OrderUnitRepository extends JpaRepository<OrderUnit, OrderUnitId> {
    List<OrderUnit> findAllByOrderId(Long orderId);
}
