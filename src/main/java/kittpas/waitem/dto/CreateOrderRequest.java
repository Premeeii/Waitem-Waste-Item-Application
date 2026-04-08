package kittpas.waitem.dto;

import java.math.BigDecimal;
import java.util.UUID;

public class CreateOrderRequest {
    private Long buyerId;
    private UUID itemId;
    private BigDecimal totalPrice;
    private String pickupCode;

    public CreateOrderRequest() {
    }

    public CreateOrderRequest(Long buyerId, UUID itemId, BigDecimal totalPrice, String pickupCode) {
        this.buyerId = buyerId;
        this.itemId = itemId;
        this.totalPrice = totalPrice;
        this.pickupCode = pickupCode;
    }

    public Long getBuyerId() {
        return buyerId;
    }

    public void setBuyerId(Long buyerId) {
        this.buyerId = buyerId;
    }

    public UUID getItemId() {
        return itemId;
    }

    public void setItemId(UUID itemId) {
        this.itemId = itemId;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getPickupCode() {
        return pickupCode;
    }

    public void setPickupCode(String pickupCode) {
        this.pickupCode = pickupCode;
    }
}
