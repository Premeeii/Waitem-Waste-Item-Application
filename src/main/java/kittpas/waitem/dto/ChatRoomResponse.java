package kittpas.waitem.dto;

import kittpas.waitem.Entity.ChatRoom;

import java.time.LocalDateTime;
import java.util.UUID;

public class ChatRoomResponse {

    private UUID id;
    private Long buyerId;
    private String buyerUsername;
    private String buyerProfileImageUrl;
    private Long sellerId;
    private String sellerUsername;
    private String sellerProfileImageUrl;
    private UUID itemId;
    private String itemTitle;
    private String itemImageUrl;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private LocalDateTime createdAt;

    public ChatRoomResponse() {
    }

    public static ChatRoomResponse fromChatRoom(ChatRoom room) {
        ChatRoomResponse r = new ChatRoomResponse();
        r.setId(room.getId());
        r.setBuyerId(room.getBuyer().getId());
        r.setBuyerUsername(room.getBuyer().getUsername());
        r.setBuyerProfileImageUrl(room.getBuyer().getProfileImageUrl());
        r.setSellerId(room.getSeller().getId());
        r.setSellerUsername(room.getSeller().getUsername());
        r.setSellerProfileImageUrl(room.getSeller().getProfileImageUrl());
        r.setItemId(room.getItem().getId());
        r.setItemTitle(room.getItem().getTitle());
        r.setItemImageUrl(room.getItem().getImageUrl());
        r.setLastMessage(room.getLastMessage());
        r.setLastMessageAt(room.getLastMessageAt());
        r.setCreatedAt(room.getCreatedAt());
        return r;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Long getBuyerId() { return buyerId; }
    public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }

    public String getBuyerUsername() { return buyerUsername; }
    public void setBuyerUsername(String buyerUsername) { this.buyerUsername = buyerUsername; }

    public String getBuyerProfileImageUrl() { return buyerProfileImageUrl; }
    public void setBuyerProfileImageUrl(String buyerProfileImageUrl) { this.buyerProfileImageUrl = buyerProfileImageUrl; }

    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }

    public String getSellerUsername() { return sellerUsername; }
    public void setSellerUsername(String sellerUsername) { this.sellerUsername = sellerUsername; }

    public String getSellerProfileImageUrl() { return sellerProfileImageUrl; }
    public void setSellerProfileImageUrl(String sellerProfileImageUrl) { this.sellerProfileImageUrl = sellerProfileImageUrl; }

    public UUID getItemId() { return itemId; }
    public void setItemId(UUID itemId) { this.itemId = itemId; }

    public String getItemTitle() { return itemTitle; }
    public void setItemTitle(String itemTitle) { this.itemTitle = itemTitle; }

    public String getItemImageUrl() { return itemImageUrl; }
    public void setItemImageUrl(String itemImageUrl) { this.itemImageUrl = itemImageUrl; }

    public String getLastMessage() { return lastMessage; }
    public void setLastMessage(String lastMessage) { this.lastMessage = lastMessage; }

    public LocalDateTime getLastMessageAt() { return lastMessageAt; }
    public void setLastMessageAt(LocalDateTime lastMessageAt) { this.lastMessageAt = lastMessageAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
