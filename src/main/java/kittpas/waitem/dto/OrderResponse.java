package kittpas.waitem.dto;

import kittpas.waitem.Entity.Order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class OrderResponse {

    private UUID id;
    private Long buyerId;
    private String buyerUsername;
    private UUID itemId;
    private String itemTitle;
    private String itemImageUrl;
    private Long sellerId;
    private String sellerUsername;
    private String status;
    private BigDecimal totalPrice;
    private String pickupCode;
    private String pickupAddress;
    private BigDecimal pickupLatitude;
    private BigDecimal pickupLongitude;
    private String pickupNote;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public OrderResponse() {
    }

    public static OrderResponse fromOrder(Order order) {
        OrderResponse r = new OrderResponse();
        r.setId(order.getId());
        r.setBuyerId(order.getBuyer().getId());
        r.setBuyerUsername(order.getBuyer().getUsername());
        r.setItemId(order.getItem().getId());
        r.setItemTitle(order.getItem().getTitle());
        r.setItemImageUrl(order.getItem().getImageUrl());
        r.setSellerId(order.getItem().getSeller().getId());
        r.setSellerUsername(order.getItem().getSeller().getUsername());
        r.setStatus(order.getStatus() != null ? order.getStatus().name() : null);
        r.setTotalPrice(order.getTotalPrice());
        r.setPickupCode(order.getPickupCode());
        r.setPickupAddress(order.getPickupAddress());
        r.setPickupLatitude(order.getPickupLatitude());
        r.setPickupLongitude(order.getPickupLongitude());
        r.setPickupNote(order.getPickupNote());
        r.setCreatedAt(order.getCreatedAt());
        r.setUpdatedAt(order.getUpdatedAt());
        return r;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Long getBuyerId() { return buyerId; }
    public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }

    public String getBuyerUsername() { return buyerUsername; }
    public void setBuyerUsername(String buyerUsername) { this.buyerUsername = buyerUsername; }

    public UUID getItemId() { return itemId; }
    public void setItemId(UUID itemId) { this.itemId = itemId; }

    public String getItemTitle() { return itemTitle; }
    public void setItemTitle(String itemTitle) { this.itemTitle = itemTitle; }

    public String getItemImageUrl() { return itemImageUrl; }
    public void setItemImageUrl(String itemImageUrl) { this.itemImageUrl = itemImageUrl; }

    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }

    public String getSellerUsername() { return sellerUsername; }
    public void setSellerUsername(String sellerUsername) { this.sellerUsername = sellerUsername; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public String getPickupCode() { return pickupCode; }
    public void setPickupCode(String pickupCode) { this.pickupCode = pickupCode; }

    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }

    public BigDecimal getPickupLatitude() { return pickupLatitude; }
    public void setPickupLatitude(BigDecimal pickupLatitude) { this.pickupLatitude = pickupLatitude; }

    public BigDecimal getPickupLongitude() { return pickupLongitude; }
    public void setPickupLongitude(BigDecimal pickupLongitude) { this.pickupLongitude = pickupLongitude; }

    public String getPickupNote() { return pickupNote; }
    public void setPickupNote(String pickupNote) { this.pickupNote = pickupNote; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
