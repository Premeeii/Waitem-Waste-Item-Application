package kittpas.waitem.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import kittpas.waitem.Entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

}
