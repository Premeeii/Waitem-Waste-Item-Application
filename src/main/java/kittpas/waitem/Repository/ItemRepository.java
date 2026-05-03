package kittpas.waitem.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import kittpas.waitem.Entity.Item;
import kittpas.waitem.Entity.enums.CategoryType;
import kittpas.waitem.Entity.enums.ItemStatus;

import java.math.BigDecimal;
import java.util.UUID;

@Repository
public interface ItemRepository extends JpaRepository<Item, UUID> {

    // Category filter
    Page<Item> findByCategoryId(Integer categoryId, Pageable pageable);

    // Category type filter (FOOD_WASTE / SECOND_HAND)
    Page<Item> findByCategoryType(CategoryType type, Pageable pageable);

    // Status filter
    Page<Item> findByStatus(ItemStatus status, Pageable pageable);

    // Seller's items
    Page<Item> findBySellerId(Long sellerId, Pageable pageable);

    // Search by keyword (title or description)
    @Query("SELECT i FROM Item i WHERE LOWER(i.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(i.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Item> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // Combined filter
    @Query("SELECT i FROM Item i WHERE " +
           "(:categoryId IS NULL OR i.category.id = :categoryId) AND " +
           "(:type IS NULL OR i.category.type = :type) AND " +
           "(:status IS NULL OR i.status = :status) AND " +
           "(:minPrice IS NULL OR i.discountedPrice >= :minPrice OR i.originalPrice >= :minPrice) AND " +
           "(:maxPrice IS NULL OR i.discountedPrice <= :maxPrice OR i.originalPrice <= :maxPrice) AND " +
           "(:keyword IS NULL OR LOWER(i.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(i.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Item> findWithFilters(
            @Param("categoryId") Integer categoryId,
            @Param("type") CategoryType type,
            @Param("status") ItemStatus status,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("keyword") String keyword,
            Pageable pageable);

    // Nearby items using Haversine formula (radius in km)
    @Query("SELECT i FROM Item i WHERE i.status = 'AVAILABLE' AND " +
           "(6371 * acos(cos(radians(:lat)) * cos(radians(i.latitude)) * " +
           "cos(radians(i.longitude) - radians(:lng)) + " +
           "sin(radians(:lat)) * sin(radians(i.latitude)))) <= :radius")
    Page<Item> findNearby(
            @Param("lat") double lat,
            @Param("lng") double lng,
            @Param("radius") double radius,
            Pageable pageable);

    // Get all items with pagination
    Page<Item> findAll(Pageable pageable);
}
