package kittpas.waitem.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import kittpas.waitem.Entity.Order;
import kittpas.waitem.Entity.Item;
import kittpas.waitem.Entity.User;
import kittpas.waitem.Entity.enums.ItemStatus;
import kittpas.waitem.Entity.enums.OrderStatus;
import kittpas.waitem.Repository.OrderRepository;
import kittpas.waitem.Repository.ItemRepository;
import kittpas.waitem.Repository.UserRepository;
import kittpas.waitem.dto.CreateOrderRequest;
import kittpas.waitem.dto.OrderResponse;
import kittpas.waitem.exception.BadRequestException;
import kittpas.waitem.exception.ResourceNotFoundException;

import java.util.Random;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ItemRepository itemRepository;
    @Autowired
    private UserRepository userRepository;

    // Create order
    public OrderResponse createOrder(CreateOrderRequest request) {
        Item item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        if (item.getStatus() != ItemStatus.AVAILABLE) {
            throw new BadRequestException("Item is not available");
        }

        User buyer = userRepository.findById(request.getBuyerId())
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found"));

        // Prevent buyer from buying their own item
        if (item.getSeller().getId().equals(buyer.getId())) {
            throw new BadRequestException("You cannot buy your own item");
        }

        // Generate pickup code automatically
        String pickupCode = generatePickupCode();

        Order order = new Order();
        order.setBuyer(buyer);
        order.setItem(item);
        order.setTotalPrice(request.getTotalPrice() != null ? request.getTotalPrice() : 
                            (item.getDiscountedPrice() != null ? item.getDiscountedPrice() : item.getOriginalPrice()));
        order.setPickupCode(pickupCode);
        order.setPickupAddress(request.getPickupAddress());
        order.setPickupLatitude(request.getPickupLatitude());
        order.setPickupLongitude(request.getPickupLongitude());
        order.setPickupNote(request.getPickupNote());
        order.setStatus(OrderStatus.PENDING);

        // Mark item as RESERVED
        item.setStatus(ItemStatus.RESERVED);
        itemRepository.save(item);

        return OrderResponse.fromOrder(orderRepository.save(order));
    }

    // Get all orders with pagination
    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable).map(OrderResponse::fromOrder);
    }

    // Detail order
    public OrderResponse detailOrder(UUID id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        return OrderResponse.fromOrder(order);
    }

    // Update order status
    public OrderResponse updateOrderStatus(UUID id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        OrderStatus newStatus = OrderStatus.valueOf(status);
        order.setStatus(newStatus);

        // Update item status based on order status
        Item item = order.getItem();
        switch (newStatus) {
            case COMPLETED:
                item.setStatus(ItemStatus.SOLD);
                break;
            case CANCELLED_BY_BUYER:
            case CANCELLED_BY_SELLER:
            case NO_SHOW:
                item.setStatus(ItemStatus.AVAILABLE);
                break;
            default:
                break;
        }
        itemRepository.save(item);

        return OrderResponse.fromOrder(orderRepository.save(order));
    }

    // Delete order
    public void deleteOrder(UUID id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        // Restore item availability if order was pending/reserved
        if (order.getStatus() == OrderStatus.PENDING) {
            Item item = order.getItem();
            item.setStatus(ItemStatus.AVAILABLE);
            itemRepository.save(item);
        }

        orderRepository.delete(order);
    }

    // Get orders by buyer
    public Page<OrderResponse> getOrdersByBuyerId(Long buyerId, Pageable pageable) {
        return orderRepository.findByBuyerId(buyerId, pageable).map(OrderResponse::fromOrder);
    }

    // Get orders by buyer with status filter
    public Page<OrderResponse> getOrdersByBuyerIdAndStatus(Long buyerId, OrderStatus status, Pageable pageable) {
        return orderRepository.findByBuyerIdAndStatus(buyerId, status, pageable).map(OrderResponse::fromOrder);
    }

    // Get orders by seller (history for seller)
    public Page<OrderResponse> getOrdersBySellerId(Long sellerId, Pageable pageable) {
        return orderRepository.findByItemSellerId(sellerId, pageable).map(OrderResponse::fromOrder);
    }

    // Get orders by seller with status filter
    public Page<OrderResponse> getOrdersBySellerIdAndStatus(Long sellerId, OrderStatus status, Pageable pageable) {
        return orderRepository.findByItemSellerIdAndStatus(sellerId, status, pageable).map(OrderResponse::fromOrder);
    }

    // Generate 6-digit pickup code
    private String generatePickupCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}
