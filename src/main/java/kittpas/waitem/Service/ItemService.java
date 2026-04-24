package kittpas.waitem.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import kittpas.waitem.Repository.ItemRepository;
import kittpas.waitem.Repository.UserRepository;
import kittpas.waitem.Repository.CategoryRepository;
import kittpas.waitem.Entity.Item;
import kittpas.waitem.Entity.User;
import kittpas.waitem.Entity.Category;
import kittpas.waitem.Entity.enums.CategoryType;
import kittpas.waitem.Entity.enums.ItemStatus;
import kittpas.waitem.dto.CreateItemRequest;
import kittpas.waitem.dto.UpdateItemRequest;
import kittpas.waitem.dto.ItemResponse;
import kittpas.waitem.exception.ResourceNotFoundException;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // Get all items with pagination
    public Page<ItemResponse> getAllItems(Pageable pageable) {
        return itemRepository.findAll(pageable).map(ItemResponse::fromItem);
    }

    // Create item
    public ItemResponse createItem(CreateItemRequest request) {
        User seller = userRepository.findById(request.getSellerId())
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found with id: " + request.getSellerId()));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Item item = new Item();
        item.setSeller(seller);
        item.setCategory(category);
        item.setTitle(request.getTitle());
        item.setDescription(request.getDescription());
        item.setOriginalPrice(request.getOriginalPrice());
        item.setDiscountedPrice(request.getDiscountedPrice());
        item.setImageUrl(request.getImageUrl());
        item.setQuantity(request.getQuantity());
        item.setCondition(request.getCondition());
        item.setExpiryDate(request.getExpiryDate());
        item.setAddressText(request.getAddressText());
        item.setLatitude(request.getLatitude());
        item.setLongitude(request.getLongitude());
        item.setStatus(ItemStatus.AVAILABLE);

        return ItemResponse.fromItem(itemRepository.save(item));
    }

    // Detail item
    public ItemResponse detailItem(UUID id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
        return ItemResponse.fromItem(item);
    }

    // Update item
    public ItemResponse updateItem(UUID id, UpdateItemRequest request) {
        Item existingItem = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));

        if (request.getTitle() != null) existingItem.setTitle(request.getTitle());
        if (request.getDescription() != null) existingItem.setDescription(request.getDescription());
        if (request.getOriginalPrice() != null) existingItem.setOriginalPrice(request.getOriginalPrice());
        if (request.getDiscountedPrice() != null) existingItem.setDiscountedPrice(request.getDiscountedPrice());
        if (request.getImageUrl() != null) existingItem.setImageUrl(request.getImageUrl());
        if (request.getQuantity() != null) existingItem.setQuantity(request.getQuantity());
        if (request.getCondition() != null) existingItem.setCondition(request.getCondition());
        if (request.getExpiryDate() != null) existingItem.setExpiryDate(request.getExpiryDate());
        if (request.getAddressText() != null) existingItem.setAddressText(request.getAddressText());
        if (request.getLatitude() != null) existingItem.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) existingItem.setLongitude(request.getLongitude());
        if (request.getStatus() != null) {
            existingItem.setStatus(ItemStatus.valueOf(request.getStatus()));
        }

        return ItemResponse.fromItem(itemRepository.save(existingItem));
    }

    // Delete item
    public void deleteItem(UUID id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
        itemRepository.delete(item);
    }

    // Get items by category
    public Page<ItemResponse> getItemsByCategory(Integer categoryId, Pageable pageable) {
        return itemRepository.findByCategoryId(categoryId, pageable).map(ItemResponse::fromItem);
    }

    // Get items by category type (FOOD_WASTE / SECOND_HAND)
    public Page<ItemResponse> getItemsByCategoryType(CategoryType type, Pageable pageable) {
        return itemRepository.findByCategoryType(type, pageable).map(ItemResponse::fromItem);
    }

    // Get items by seller
    public Page<ItemResponse> getItemsBySeller(Long sellerId, Pageable pageable) {
        return itemRepository.findBySellerId(sellerId, pageable).map(ItemResponse::fromItem);
    }

    // Search items by keyword
    public Page<ItemResponse> searchItems(String keyword, Pageable pageable) {
        return itemRepository.searchByKeyword(keyword, pageable).map(ItemResponse::fromItem);
    }

    // Advanced filter
    public Page<ItemResponse> filterItems(Integer categoryId, CategoryType type, ItemStatus status,
                                          BigDecimal minPrice, BigDecimal maxPrice, String keyword,
                                          Pageable pageable) {
        return itemRepository.findWithFilters(categoryId, type, status, minPrice, maxPrice, keyword, pageable)
                .map(ItemResponse::fromItem);
    }

    // Nearby items
    public Page<ItemResponse> getNearbyItems(double lat, double lng, double radiusKm, Pageable pageable) {
        return itemRepository.findNearby(lat, lng, radiusKm, pageable).map(ItemResponse::fromItem);
    }
}
