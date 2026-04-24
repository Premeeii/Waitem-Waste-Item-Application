package kittpas.waitem.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class ChatMessageResponse {

    private UUID id;
    private UUID chatRoomId;
    private Long senderId;
    private String senderUsername;
    private String content;
    private boolean isRead;
    private LocalDateTime createdAt;

    public ChatMessageResponse() {
    }

    public static ChatMessageResponse fromChatMessage(kittpas.waitem.Entity.ChatMessage msg) {
        ChatMessageResponse r = new ChatMessageResponse();
        r.setId(msg.getId());
        r.setChatRoomId(msg.getChatRoom().getId());
        r.setSenderId(msg.getSender().getId());
        r.setSenderUsername(msg.getSender().getUsername());
        r.setContent(msg.getContent());
        r.setRead(msg.isRead());
        r.setCreatedAt(msg.getCreatedAt());
        return r;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getChatRoomId() { return chatRoomId; }
    public void setChatRoomId(UUID chatRoomId) { this.chatRoomId = chatRoomId; }

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public String getSenderUsername() { return senderUsername; }
    public void setSenderUsername(String senderUsername) { this.senderUsername = senderUsername; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
