package kittpas.waitem.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import com.fasterxml.jackson.annotation.JsonIgnore;
import kittpas.waitem.Entity.enums.UserRole;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @Column(name = "firstname")
    private String firstname;

    @Column(name = "lastname")
    private String lastname;

    @JsonIgnore
    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Column(name = "default_address")
    private String defaultAddress;

    @Column(name = "default_latitude", precision = 10, scale = 7)
    private BigDecimal defaultLatitude;

    @Column(name = "default_longitude", precision = 10, scale = 7)
    private BigDecimal defaultLongitude;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private UserRole role;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.role == null) {
            this.role = UserRole.USER;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public User() {
    }

    public User(Long id, String username, String firstname, String lastname, String password,
                String email, String phone, String profileImageUrl, String bio,
                String defaultAddress, BigDecimal defaultLatitude, BigDecimal defaultLongitude,
                UserRole role) {
        this.id = id;
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.password = password;
        this.email = email;
        this.phone = phone;
        this.profileImageUrl = profileImageUrl;
        this.bio = bio;
        this.defaultAddress = defaultAddress;
        this.defaultLatitude = defaultLatitude;
        this.defaultLongitude = defaultLongitude;
        this.role = role;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFirstname() { return firstname; }
    public void setFirstname(String firstname) { this.firstname = firstname; }

    public String getLastname() { return lastname; }
    public void setLastname(String lastname) { this.lastname = lastname; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getDefaultAddress() { return defaultAddress; }
    public void setDefaultAddress(String defaultAddress) { this.defaultAddress = defaultAddress; }

    public BigDecimal getDefaultLatitude() { return defaultLatitude; }
    public void setDefaultLatitude(BigDecimal defaultLatitude) { this.defaultLatitude = defaultLatitude; }

    public BigDecimal getDefaultLongitude() { return defaultLongitude; }
    public void setDefaultLongitude(BigDecimal defaultLongitude) { this.defaultLongitude = defaultLongitude; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
