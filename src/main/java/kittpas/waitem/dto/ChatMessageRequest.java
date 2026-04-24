package kittpas.waitem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class ChatMessageRequest {

    @NotNull(message = "Chat room ID is required")
    private UUID chatRoomId;

    @NotNull(message = "Sender ID is required")
    private Long senderId;

    @NotBlank(message = "Content is required")
    private String content;

    public ChatMessageRequest() {
    }

    public UUID getChatRoomId() { return chatRoomId; }
    public void setChatRoomId(UUID chatRoomId) { this.chatRoomId = chatRoomId; }

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
