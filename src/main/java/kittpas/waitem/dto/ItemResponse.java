package kittpas.waitem.dto;

import kittpas.waitem.Entity.Item;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class ItemResponse {

    private UUID id;
    private Long sellerId;
    private String sellerUsername;
    private Integer categoryId;
    private String categoryName;
    private String categoryType;
    private String title;
    private String description;
    private BigDecimal originalPrice;
    private BigDecimal discountedPrice;
    private String imageUrl;
    private Integer quantity;
    private String condition;
    private LocalDateTime expiryDate;
    private String addressText;
    private String status;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ItemResponse() {
    }

    public static ItemResponse fromItem(Item item) {
        ItemResponse r = new ItemResponse();
        r.setId(item.getId());
        r.setSellerId(item.getSeller().getId());
        r.setSellerUsername(item.getSeller().getUsername());
        r.setCategoryId(item.getCategory().getId());
        r.setCategoryName(item.getCategory().getName());
        r.setCategoryType(item.getCategory().getType() != null ? item.getCategory().getType().name() : null);
        r.setTitle(item.getTitle());
        r.setDescription(item.getDescription());
        r.setOriginalPrice(item.getOriginalPrice());
        r.setDiscountedPrice(item.getDiscountedPrice());
        r.setImageUrl(item.getImageUrl());
        r.setQuantity(item.getQuantity());
        r.setCondition(item.getCondition());
        r.setExpiryDate(item.getExpiryDate());
        r.setAddressText(item.getAddressText());
        r.setStatus(item.getStatus() != null ? item.getStatus().name() : null);
        r.setLatitude(item.getLatitude());
        r.setLongitude(item.getLongitude());
        r.setCreatedAt(item.getCreatedAt());
        r.setUpdatedAt(item.getUpdatedAt());
        return r;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }

    public String getSellerUsername() { return sellerUsername; }
    public void setSellerUsername(String sellerUsername) { this.sellerUsername = sellerUsername; }

    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getCategoryType() { return categoryType; }
    public void setCategoryType(String categoryType) { this.categoryType = categoryType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }

    public BigDecimal getDiscountedPrice() { return discountedPrice; }
    public void setDiscountedPrice(BigDecimal discountedPrice) { this.discountedPrice = discountedPrice; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }

    public LocalDateTime getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDateTime expiryDate) { this.expiryDate = expiryDate; }

    public String getAddressText() { return addressText; }
    public void setAddressText(String addressText) { this.addressText = addressText; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
