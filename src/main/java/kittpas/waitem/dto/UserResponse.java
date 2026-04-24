package kittpas.waitem.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class UserResponse {

    private Long id;
    private String username;
    private String firstname;
    private String lastname;
    private String email;
    private String phone;
    private String profileImageUrl;
    private String bio;
    private String defaultAddress;
    private BigDecimal defaultLatitude;
    private BigDecimal defaultLongitude;
    private String role;
    private LocalDateTime createdAt;

    public UserResponse() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFirstname() { return firstname; }
    public void setFirstname(String firstname) { this.firstname = firstname; }

    public String getLastname() { return lastname; }
    public void setLastname(String lastname) { this.lastname = lastname; }

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

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static UserResponse fromUser(kittpas.waitem.Entity.User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setFirstname(user.getFirstname());
        response.setLastname(user.getLastname());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setProfileImageUrl(user.getProfileImageUrl());
        response.setBio(user.getBio());
        response.setDefaultAddress(user.getDefaultAddress());
        response.setDefaultLatitude(user.getDefaultLatitude());
        response.setDefaultLongitude(user.getDefaultLongitude());
        response.setRole(user.getRole() != null ? user.getRole().name() : null);
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}
