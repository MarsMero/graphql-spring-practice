package me.mars.repository;

import me.mars.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author Marcin Szwałko
 */
public interface OrderRepository extends JpaRepository<Order, Long> {
}
