package kittpas.waitem.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import kittpas.waitem.Entity.enums.OrderStatus;
import kittpas.waitem.Service.OrderService;
import kittpas.waitem.dto.CreateOrderRequest;
import kittpas.waitem.dto.OrderResponse;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // Create order
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return ResponseEntity.ok(orderService.createOrder(request));
    }

    // Get all orders
    @GetMapping
    public ResponseEntity<Page<OrderResponse>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(orderService.getAllOrders(pageable));
    }

    // Get order detail
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable UUID id) {
        return ResponseEntity.ok(orderService.detailOrder(id));
    }

    // Update order status
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    // Delete order
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable UUID id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    // Buyer's order history
    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<Page<OrderResponse>> getOrdersByBuyer(
            @PathVariable Long buyerId,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        if (status != null) {
            return ResponseEntity.ok(orderService.getOrdersByBuyerIdAndStatus(buyerId, status, pageable));
        }
        return ResponseEntity.ok(orderService.getOrdersByBuyerId(buyerId, pageable));
    }

    // Seller's order history
    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<Page<OrderResponse>> getOrdersBySeller(
            @PathVariable Long sellerId,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        if (status != null) {
            return ResponseEntity.ok(orderService.getOrdersBySellerIdAndStatus(sellerId, status, pageable));
        }
        return ResponseEntity.ok(orderService.getOrdersBySellerId(sellerId, pageable));
    }
}
