package kittpas.waitem.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import kittpas.waitem.Service.ChatService;
import kittpas.waitem.dto.ChatMessageRequest;
import kittpas.waitem.dto.ChatMessageResponse;
import kittpas.waitem.dto.ChatRoomResponse;

import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // WebSocket: send message (clients send to /app/chat.sendMessage)
    @MessageMapping("/chat.sendMessage")
    public void sendMessageWs(@Payload ChatMessageRequest request) {
        ChatMessageResponse response = chatService.sendMessage(request);
        // Broadcast to the chat room topic
        messagingTemplate.convertAndSend(
                "/topic/chat/" + request.getChatRoomId(),
                response);
    }

    // REST: send message (fallback for non-WebSocket clients)
    @PostMapping("/messages")
    public ResponseEntity<ChatMessageResponse> sendMessage(@Valid @RequestBody ChatMessageRequest request) {
        ChatMessageResponse response = chatService.sendMessage(request);
        // Also broadcast via WebSocket
        messagingTemplate.convertAndSend(
                "/topic/chat/" + request.getChatRoomId(),
                response);
        return ResponseEntity.ok(response);
    }

    // Get or create a chat room
    @PostMapping("/rooms")
    public ResponseEntity<ChatRoomResponse> getOrCreateRoom(
            @RequestParam Long buyerId,
            @RequestParam Long sellerId,
            @RequestParam UUID itemId) {
        return ResponseEntity.ok(chatService.getOrCreateChatRoom(buyerId, sellerId, itemId));
    }

    // Get user's chat rooms
    @GetMapping("/rooms/user/{userId}")
    public ResponseEntity<Page<ChatRoomResponse>> getUserChatRooms(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(chatService.getUserChatRooms(userId, pageable));
    }

    // Get chat room detail
    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<ChatRoomResponse> getChatRoom(@PathVariable UUID roomId) {
        return ResponseEntity.ok(chatService.getChatRoom(roomId));
    }

    // Get messages in a chat room
    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<Page<ChatMessageResponse>> getMessages(
            @PathVariable UUID roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(chatService.getMessages(roomId, pageable));
    }

    // Mark messages as read
    @PatchMapping("/rooms/{roomId}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable UUID roomId,
            @RequestParam Long userId) {
        chatService.markMessagesAsRead(roomId, userId);
        return ResponseEntity.ok().build();
    }
}
