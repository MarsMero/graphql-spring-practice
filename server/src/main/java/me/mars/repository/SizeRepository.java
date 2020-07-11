package me.mars.repository;

import me.mars.entity.Size;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * @author Marcin Szwałko
 */
public interface SizeRepository extends JpaRepository<Size, Long> {
    Optional<Size> findByName(String name);
}
