package kittpas.waitem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import kittpas.waitem.Entity.User;
import kittpas.waitem.Service.UserService;
import kittpas.waitem.Entity.Item;
import kittpas.waitem.Service.ItemService;
import kittpas.waitem.Service.CategoryService;
import kittpas.waitem.Service.OrderService;
import kittpas.waitem.Entity.Category;
import kittpas.waitem.Entity.Order;
import kittpas.waitem.dto.CreateItemRequest;
import kittpas.waitem.dto.CreateOrderRequest;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class MyController {

    @Autowired
    private UserService userService;
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private ItemService itemService;
    @Autowired
    private OrderService orderService;

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PatchMapping("/users/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    @GetMapping("/categories")
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @PostMapping("/createcategory")
    public Category createCategory(@RequestBody Category category) {
        return categoryService.createCategory(category);
    }

    @GetMapping("/items")
    public List<Item> getAllItems() {
        return itemService.getAllItems();
    }

    @GetMapping("/items/{id}")
    public Item detailItem(@PathVariable UUID id) {
        return itemService.detailItem(id);
    }

    @GetMapping("/items/category/{categoryId}")
    public List<Item> getItemsByCategory(@PathVariable Long categoryId) {
        return itemService.getItemsByCategory(categoryId);
    }

    @PostMapping("/createitem")
    public Item createItem(@RequestBody CreateItemRequest request) {
        return itemService.createItem(request);
    }

    @PatchMapping("/updateitem/{id}")
    public Item updateItem(@PathVariable UUID id, @RequestBody Item item) {
        return itemService.updateItem(id, item);
    }

    @DeleteMapping("/deleteitem/{id}")
    public void deleteItem(@PathVariable UUID id) {
        itemService.deleteItem(id);
    }

    @PostMapping("/createorder")
    public Order createOrder(@RequestBody CreateOrderRequest request) {
        return orderService.createOrder(request);
    }

    @GetMapping("/orders")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/orders/{id}")
    public Order detailOrder(@PathVariable UUID id) {
        return orderService.detailOrder(id);
    }

    @PatchMapping("/updateorder/{id}")
    public Order updateOrder(@PathVariable UUID id, @RequestBody Order order) {
        return orderService.updateOrder(id, order);
    }

    @DeleteMapping("/deleteorder/{id}")
    public void deleteOrder(@PathVariable UUID id) {
        orderService.deleteOrder(id);
    }

    @GetMapping("/orders/buyer/{buyerId}")
    public List<Order> getOrdersByBuyerId(@PathVariable Long buyerId) {
        return orderService.getOrdersByBuyerId(buyerId);
    }
}
