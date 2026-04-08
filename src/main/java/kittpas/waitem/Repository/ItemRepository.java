package kittpas.waitem.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import kittpas.waitem.Entity.Item;
import java.util.UUID;
import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, UUID> {
    List<Item> findByCategoryId(Long categoryId);
}
