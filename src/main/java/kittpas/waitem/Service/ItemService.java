package kittpas.waitem.Service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import kittpas.waitem.Repository.ItemRepository;
import kittpas.waitem.Repository.UserRepository;
import kittpas.waitem.Repository.CategoryRepository;
import kittpas.waitem.Entity.Item;
import kittpas.waitem.Entity.User;
import kittpas.waitem.Entity.Category;
import kittpas.waitem.Entity.enums.ItemStatus;
import kittpas.waitem.dto.CreateItemRequest;
import java.util.List;
import java.util.UUID;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    //Get All Item
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }
    
    //Create Item
    public Item createItem(CreateItemRequest request) {
        // ค้นหา seller
        User seller = userRepository.findById(request.getSellerId())
                .orElseThrow(() -> new RuntimeException("Seller not found with id: " + request.getSellerId()));

        // ค้นหา category
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));

        // สร้าง Item
        Item item = new Item();
        item.setSeller(seller);
        item.setCategory(category);
        item.setTitle(request.getTitle());
        item.setDescription(request.getDescription());
        item.setOriginalPrice(request.getOriginalPrice());
        item.setDiscountedPrice(request.getDiscountedPrice());
        item.setLatitude(request.getLatitude());
        item.setLongitude(request.getLongitude());
        item.setStatus(ItemStatus.AVAILABLE);

        return itemRepository.save(item);
    }
    
    //Detail Item
    public Item detailItem(UUID id) {
        return itemRepository.findById(id).orElse(null);
    }

    //Update Item
    public Item updateItem(UUID id, Item item) {
        Item existingItem = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
        existingItem.setTitle(item.getTitle());
        existingItem.setDescription(item.getDescription());
        existingItem.setOriginalPrice(item.getOriginalPrice());
        existingItem.setDiscountedPrice(item.getDiscountedPrice());
        existingItem.setLatitude(item.getLatitude());
        existingItem.setLongitude(item.getLongitude());
        existingItem.setStatus(ItemStatus.AVAILABLE);
        return itemRepository.save(existingItem);
    }

    //Delete Item
    public void deleteItem(UUID id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
        itemRepository.delete(item);
    }

    public List<Item> getItemsByCategory(Long categoryId) {
        return itemRepository.findByCategoryId(categoryId);
    }
}
