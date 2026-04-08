package kittpas.waitem.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import kittpas.waitem.Entity.Order;
import java.util.UUID;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    
    List<Order> findByBuyerId(Long buyerId);
}
