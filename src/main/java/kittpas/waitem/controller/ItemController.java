package kittpas.waitem.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import kittpas.waitem.Entity.enums.CategoryType;
import kittpas.waitem.Entity.enums.ItemStatus;
import kittpas.waitem.Service.ItemService;
import kittpas.waitem.dto.CreateItemRequest;
import kittpas.waitem.dto.UpdateItemRequest;
import kittpas.waitem.dto.ItemResponse;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    @Autowired
    private ItemService itemService;

    // Get all items
    @GetMapping
    public ResponseEntity<Page<ItemResponse>> getAllItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(itemService.getAllItems(pageable));
    }

    // Get item detail
    @GetMapping("/{id}")
    public ResponseEntity<ItemResponse> getItemById(@PathVariable UUID id) {
        return ResponseEntity.ok(itemService.detailItem(id));
    }

    // Create item
    @PostMapping
    public ResponseEntity<ItemResponse> createItem(@Valid @RequestBody CreateItemRequest request) {
        return ResponseEntity.ok(itemService.createItem(request));
    }

    // Update item
    @PatchMapping("/{id}")
    public ResponseEntity<ItemResponse> updateItem(@PathVariable UUID id, @RequestBody UpdateItemRequest request) {
        return ResponseEntity.ok(itemService.updateItem(id, request));
    }

    // Delete item
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable UUID id) {
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }

    // Search items by keyword
    @GetMapping("/search")
    public ResponseEntity<Page<ItemResponse>> searchItems(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(itemService.searchItems(keyword, pageable));
    }

    // Get items by category
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<ItemResponse>> getItemsByCategory(
            @PathVariable Integer categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(itemService.getItemsByCategory(categoryId, pageable));
    }

    // Get items by type (FOOD_WASTE / SECOND_HAND)
    @GetMapping("/type/{type}")
    public ResponseEntity<Page<ItemResponse>> getItemsByType(
            @PathVariable CategoryType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(itemService.getItemsByCategoryType(type, pageable));
    }

    // Advanced filter
    @GetMapping("/filter")
    public ResponseEntity<Page<ItemResponse>> filterItems(
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) CategoryType type,
            @RequestParam(required = false) ItemStatus status,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(itemService.filterItems(categoryId, type, status, minPrice, maxPrice, keyword, pageable));
    }

    // Nearby items
    @GetMapping("/nearby")
    public ResponseEntity<Page<ItemResponse>> getNearbyItems(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "5") double radius,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(itemService.getNearbyItems(lat, lng, radius, pageable));
    }
}
