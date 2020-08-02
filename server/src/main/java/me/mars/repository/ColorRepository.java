package me.mars.repository;

import me.mars.entity.Color;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * @author Marcin Szwałko
 */
public interface ColorRepository extends JpaRepository<Color, Long> {
    Optional<Color> findByHexCode(String hexCode);
}
