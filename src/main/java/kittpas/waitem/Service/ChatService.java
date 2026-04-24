package kittpas.waitem.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import kittpas.waitem.Entity.ChatMessage;
import kittpas.waitem.Entity.ChatRoom;
import kittpas.waitem.Entity.Item;
import kittpas.waitem.Entity.User;
import kittpas.waitem.Repository.ChatMessageRepository;
import kittpas.waitem.Repository.ChatRoomRepository;
import kittpas.waitem.Repository.ItemRepository;
import kittpas.waitem.Repository.UserRepository;
import kittpas.waitem.dto.ChatMessageRequest;
import kittpas.waitem.dto.ChatMessageResponse;
import kittpas.waitem.dto.ChatRoomResponse;
import kittpas.waitem.exception.ResourceNotFoundException;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class ChatService {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ItemRepository itemRepository;

    // Get or create chat room
    public ChatRoomResponse getOrCreateChatRoom(Long buyerId, Long sellerId, UUID itemId) {
        Optional<ChatRoom> existing = chatRoomRepository
                .findByBuyerIdAndSellerIdAndItemId(buyerId, sellerId, itemId);

        if (existing.isPresent()) {
            return ChatRoomResponse.fromChatRoom(existing.get());
        }

        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found"));
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found"));
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        ChatRoom room = new ChatRoom();
        room.setBuyer(buyer);
        room.setSeller(seller);
        room.setItem(item);

        return ChatRoomResponse.fromChatRoom(chatRoomRepository.save(room));
    }

    // Send message (used by WebSocket and REST)
    public ChatMessageResponse sendMessage(ChatMessageRequest request) {
        ChatRoom chatRoom = chatRoomRepository.findById(request.getChatRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Chat room not found"));

        User sender = userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));

        ChatMessage message = new ChatMessage();
        message.setChatRoom(chatRoom);
        message.setSender(sender);
        message.setContent(request.getContent());

        ChatMessage saved = chatMessageRepository.save(message);

        // Update chat room's last message
        chatRoom.setLastMessage(request.getContent());
        chatRoom.setLastMessageAt(LocalDateTime.now());
        chatRoomRepository.save(chatRoom);

        return ChatMessageResponse.fromChatMessage(saved);
    }

    // Get messages in a chat room
    public Page<ChatMessageResponse> getMessages(UUID chatRoomId, Pageable pageable) {
        return chatMessageRepository.findByChatRoomIdOrderByCreatedAtAsc(chatRoomId, pageable)
                .map(ChatMessageResponse::fromChatMessage);
    }

    // Get user's chat rooms
    public Page<ChatRoomResponse> getUserChatRooms(Long userId, Pageable pageable) {
        return chatRoomRepository.findByBuyerIdOrSellerId(userId, userId, pageable)
                .map(ChatRoomResponse::fromChatRoom);
    }

    // Get chat room by ID
    public ChatRoomResponse getChatRoom(UUID chatRoomId) {
        ChatRoom room = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat room not found"));
        return ChatRoomResponse.fromChatRoom(room);
    }

    // Mark messages as read
    public void markMessagesAsRead(UUID chatRoomId, Long userId) {
        
        // This is a simplified version — in production you'd use a batch update query
        chatMessageRepository.findByChatRoomIdOrderByCreatedAtAsc(chatRoomId, Pageable.unpaged())
                .forEach(msg -> {
                    if (!msg.getSender().getId().equals(userId) && !msg.isRead()) {
                        msg.setRead(true);
                        chatMessageRepository.save(msg);
                    }
                });
    }
}
