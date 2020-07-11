package me.mars;

import me.mars.entity.Color;
import me.mars.entity.Size;
import me.mars.entity.Unit;
import me.mars.repository.ColorRepository;
import me.mars.repository.SizeRepository;
import me.mars.repository.UnitRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Initializes database.
 *
 * @author Marcin Szwałko
 */
@Component
public class InitDatabaseRunner implements ApplicationRunner {
    private ColorRepository colorRepository;
    private SizeRepository sizeRepository;
    private UnitRepository unitRepository;

    public InitDatabaseRunner(ColorRepository colorRepository, SizeRepository sizeRepository, UnitRepository unitRepository) {
        this.colorRepository = colorRepository;
        this.sizeRepository = sizeRepository;
        this.unitRepository = unitRepository;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        var colors = getAllColors();
        var sizes = getAllSizes();
        colorRepository.saveAll(colors);
        sizeRepository.saveAll(sizes);

        var units = new ArrayList<Unit>(colors.size()*sizes.size());
        for (var color : colors) {
            for (var size : sizes) {
                units.add(new Unit(color, size, 5));
            }
        }
        unitRepository.saveAll(units);
    }

    private List<Color> getAllColors() {
        return List.of(
                new Color("Red", "#FF0000"),
                new Color("Green", "#008000"),
                new Color("Blue", "#0000FF"),
                new Color("Yellow", "#FFFF00"),
                new Color("Black", "#000000"),
                new Color("White", "#FFFFFF")
        );
    }

    private List<Size> getAllSizes() {
        return List.of(
                new Size("S"), new Size("M"), new Size("L"), new Size("XL")
        );
    }
}
