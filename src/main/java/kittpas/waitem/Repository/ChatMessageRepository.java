package kittpas.waitem.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import kittpas.waitem.Entity.ChatMessage;

import java.util.UUID;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {

    // Get messages in a chat room with pagination
    Page<ChatMessage> findByChatRoomIdOrderByCreatedAtAsc(UUID chatRoomId, Pageable pageable);

    // Count unread messages for a user in a specific chat room
    long countByChatRoomIdAndSenderIdNotAndIsReadFalse(UUID chatRoomId, Long userId);
}
