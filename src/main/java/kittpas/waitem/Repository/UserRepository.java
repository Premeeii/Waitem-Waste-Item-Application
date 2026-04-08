package kittpas.waitem.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import kittpas.waitem.Entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
}
