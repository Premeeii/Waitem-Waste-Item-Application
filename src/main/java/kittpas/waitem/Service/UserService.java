package kittpas.waitem.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import kittpas.waitem.Entity.User;
import kittpas.waitem.Entity.enums.UserRole;
import kittpas.waitem.Repository.UserRepository;
import kittpas.waitem.config.JwtUtil;
import kittpas.waitem.dto.*;
import kittpas.waitem.exception.BadRequestException;
import kittpas.waitem.exception.ResourceNotFoundException;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // Register
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists");
        }
        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRole(UserRole.USER);

        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser.getUsername(), savedUser.getId(),
                savedUser.getRole().name());

        return new AuthResponse(token, savedUser.getUsername(), savedUser.getId(),
                savedUser.getRole().name());
    }

    // Login
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadRequestException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid username or password");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getId(),
                user.getRole().name());

        return new AuthResponse(token, user.getUsername(), user.getId(),
                user.getRole().name());
    }

    // Get user by ID
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return UserResponse.fromUser(user);
    }

    // Get all users
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(UserResponse::fromUser);
    }

    // Update profile
    public UserResponse updateUser(Long id, User updateData) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (updateData.getFirstname() != null) existingUser.setFirstname(updateData.getFirstname());
        if (updateData.getLastname() != null) existingUser.setLastname(updateData.getLastname());
        if (updateData.getEmail() != null) existingUser.setEmail(updateData.getEmail());
        if (updateData.getPhone() != null) existingUser.setPhone(updateData.getPhone());
        if (updateData.getProfileImageUrl() != null) existingUser.setProfileImageUrl(updateData.getProfileImageUrl());
        if (updateData.getBio() != null) existingUser.setBio(updateData.getBio());
        if (updateData.getDefaultAddress() != null) existingUser.setDefaultAddress(updateData.getDefaultAddress());
        if (updateData.getDefaultLatitude() != null) existingUser.setDefaultLatitude(updateData.getDefaultLatitude());
        if (updateData.getDefaultLongitude() != null) existingUser.setDefaultLongitude(updateData.getDefaultLongitude());

        User saved = userRepository.save(existingUser);
        return UserResponse.fromUser(saved);
    }

    // Delete user
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
}
