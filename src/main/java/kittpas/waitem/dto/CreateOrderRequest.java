package kittpas.waitem.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class CreateOrderRequest {

    @NotNull(message = "Buyer ID is required")
    private Long buyerId;

    @NotNull(message = "Item ID is required")
    private java.util.UUID itemId;

    private BigDecimal totalPrice;
    private String pickupAddress;
    private BigDecimal pickupLatitude;
    private BigDecimal pickupLongitude;
    private String pickupNote;

    public CreateOrderRequest() {
    }

    public Long getBuyerId() { return buyerId; }
    public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }

    public java.util.UUID getItemId() { return itemId; }
    public void setItemId(java.util.UUID itemId) { this.itemId = itemId; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }

    public BigDecimal getPickupLatitude() { return pickupLatitude; }
    public void setPickupLatitude(BigDecimal pickupLatitude) { this.pickupLatitude = pickupLatitude; }

    public BigDecimal getPickupLongitude() { return pickupLongitude; }
    public void setPickupLongitude(BigDecimal pickupLongitude) { this.pickupLongitude = pickupLongitude; }

    public String getPickupNote() { return pickupNote; }
    public void setPickupNote(String pickupNote) { this.pickupNote = pickupNote; }
}
