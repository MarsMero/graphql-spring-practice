package me.mars.repository;

import me.mars.entity.Unit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * @author Marcin Szwałko
 */
public interface UnitRepository extends JpaRepository<Unit, Long> {
    Optional<Unit> findUnitByColorIdAndSizeId(Long colorId, Long sizeId);
}
