package kittpas.waitem.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import kittpas.waitem.Entity.Order;
import kittpas.waitem.Repository.OrderRepository;
import kittpas.waitem.Repository.ItemRepository;
import kittpas.waitem.Repository.UserRepository;
import kittpas.waitem.Entity.Item;
import kittpas.waitem.Entity.User;
import kittpas.waitem.Entity.enums.ItemStatus;
import kittpas.waitem.Entity.enums.OrderStatus;
import kittpas.waitem.dto.CreateOrderRequest;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ItemRepository itemRepository;
    @Autowired
    private UserRepository userRepository;

    public Order createOrder(CreateOrderRequest request) {
        Item item = itemRepository.findById(request.getItemId()).orElse(null);
        if (item == null) {
            throw new RuntimeException("Item not found");
        }
        if (item.getStatus() != ItemStatus.AVAILABLE) {
            throw new RuntimeException("Item is not available");
        }

        User buyer = userRepository.findById(request.getBuyerId()).orElse(null);
        if (buyer == null) {
            throw new RuntimeException("Buyer not found");
        }

        Order order = new Order();
        order.setBuyer(buyer);
        order.setItem(item);
        order.setTotalPrice(request.getTotalPrice());
        order.setPickupCode(request.getPickupCode());
        order.setStatus(OrderStatus.PENDING);
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order detailOrder(UUID id) {
        return orderRepository.findById(id).orElse(null);
    }

    public Order updateOrder(UUID id, Order order) {
        Order existingOrder = orderRepository.findById(id).orElse(null);
        if (existingOrder != null) {
            if (order.getBuyer() != null)
                existingOrder.setBuyer(order.getBuyer());
            if (order.getItem() != null)
                existingOrder.setItem(order.getItem());
            if (order.getTotalPrice() != null)
                existingOrder.setTotalPrice(order.getTotalPrice());
            if (order.getPickupCode() != null)
                existingOrder.setPickupCode(order.getPickupCode());
            return orderRepository.save(existingOrder);
        }
        return null;
    }

    public void deleteOrder(UUID id) {
        orderRepository.deleteById(id);
    }

    public List<Order> getOrdersByBuyerId(Long buyerId) {
        return orderRepository.findByBuyerId(buyerId);
    }
}
