package kittpas.waitem.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import kittpas.waitem.Entity.Order;
import kittpas.waitem.Entity.enums.OrderStatus;

import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    // Buyer's orders
    Page<Order> findByBuyerId(Long buyerId, Pageable pageable);

    // Seller's orders (via item's seller)
    Page<Order> findByItemSellerId(Long sellerId, Pageable pageable);

    // Buyer's orders filtered by status
    Page<Order> findByBuyerIdAndStatus(Long buyerId, OrderStatus status, Pageable pageable);

    // Seller's orders filtered by status
    Page<Order> findByItemSellerIdAndStatus(Long sellerId, OrderStatus status, Pageable pageable);

    // Check if buyer already ordered this item
    boolean existsByBuyerIdAndItemId(Long buyerId, UUID itemId);

    // Get all with pagination
    Page<Order> findAll(Pageable pageable);
}
