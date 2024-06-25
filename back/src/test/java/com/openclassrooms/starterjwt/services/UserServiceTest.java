package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.SpringBootSecurityJwtApplicationTests;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@SpringBootTest
public class UserServiceTest {

    @MockBean UserRepository userRepository;

    @Autowired
    UserService userService;

    @Test
    void test_FindById_ResponseOk() {
        //GIVEN
        User mockUser=User.builder()
                .email("red@mage.com")
                .firstName("Red")
                .lastName("Mage")
                .password("Mage1234!")
                .admin(true)
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));

        //WHEN
        User user=userService.findById(1L);

        //THEN
        assertThat(user).isEqualTo(mockUser);
        verify(userRepository,times(1)).findById(1L);
    }

    @Test
    void testDeleteUserById_ResponseOk() {
        // WHEN
        userService.delete(3L);

        // THEN
        verify(userRepository,times(1)).deleteById(3L);
    }
}
