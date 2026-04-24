package kittpas.waitem.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import kittpas.waitem.Entity.ChatRoom;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, UUID> {

    // Find chat rooms for a user (as buyer or seller)
    Page<ChatRoom> findByBuyerIdOrSellerId(Long buyerId, Long sellerId, Pageable pageable);

    // Find existing chat room between buyer, seller, and item
    Optional<ChatRoom> findByBuyerIdAndSellerIdAndItemId(Long buyerId, Long sellerId, UUID itemId);
}
