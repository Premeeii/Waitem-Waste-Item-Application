package kittpas.waitem.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import kittpas.waitem.Entity.User;
import kittpas.waitem.Repository.UserRepository;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(Long id, User user) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser != null) {
            if(user.getUsername() != null) existingUser.setUsername(user.getUsername());
            if(user.getFirstname() != null) existingUser.setFirstname(user.getFirstname());
            if(user.getLastname() != null) existingUser.setLastname(user.getLastname());
            if(user.getPassword() != null) existingUser.setPassword(user.getPassword());
            if(user.getEmail() != null) existingUser.setEmail(user.getEmail());
            existingUser.setPhone(user.getPhone());
            return userRepository.save(existingUser);
        }
        return null;
    }
}
