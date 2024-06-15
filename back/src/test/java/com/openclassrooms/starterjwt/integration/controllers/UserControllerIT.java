package com.openclassrooms.starterjwt.integration.controllers;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.hamcrest.Matchers.containsString;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    final User userMock = User.builder()
            .firstName("MockFirstName")
            .lastName("MockLastName")
            .admin(false)
            .email("mock@test.com")
            .password("Aa123456!")
            .build();

    final User userMock2 = User.builder()
            .firstName("Red")
            .lastName("Mage")
            .admin(false)
            .email("red@mage.com")
            .password("Mage1234!")
            .build();

    @AfterEach
    void clean() {
        userRepository.deleteAll();
    }

    @Test
    @WithMockUser(roles="USER")
    @DisplayName("Should retrieve correct user data with Id if authenticated User")
    void testFindById_AuthorizedUser() throws Exception {
        // GIVEN
        Long mockUserId = userRepository.save(userMock).getId();

        // WHEN
        mockMvc.perform(
                MockMvcRequestBuilders.get("/api/user/" + mockUserId))
        // THEN
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string(containsString("MockFirstName")));
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("Should throw when getting user data if user is null")
    void testFindById_NotFoundUser() throws Exception {
        // GIVEN
        Long mockUserId = 999L;

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user/" + mockUserId))
                // THEN
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    @DisplayName("Should have unauthorized response when getting user if unAuthorized User")
    void testFindById_UnauthorizedResponse() throws Exception {
        // GIVEN
        Long mockUserId = userRepository.save(userMock).getId();

        // WHEN
        mockMvc.perform(
                        MockMvcRequestBuilders.get("/api/user/" + mockUserId))
        // THEN
                .andExpect(MockMvcResultMatchers.status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("Should throw bad request response if invalid Id format when getting user")
    void testFindById_InvalidIdFormat() throws Exception {
        // GIVEN
        String invalidId = "Invalid_Id";

        // WHEN
        mockMvc.perform(
                        MockMvcRequestBuilders.get("/api/user/" + invalidId)
                )

        // THEN
        .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

//    @Test
//    @DisplayName("should delete one user successfully if request by auth user")
//    void testDeleteUser_ResponseOk() throws Exception {
//        //GIVEN
//        Long mockUserId=userRepository.save(userMock).getId();
//
//        //WHEN
//        mockMvc.perform(
//                MockMvcRequestBuilders.delete("/api/user/" + mockUserId)
//                        .with(user("mock@test.com"))
//        )
//
//        // THEN
//                .andExpect(MockMvcResultMatchers.status().isOk());
//
//    }

    @Test
    @WithMockUser(username = "mock@test.com")
    @DisplayName("Should delete one user successfully if request by auth user")
    void testDeleteUser_ResponseOk() throws Exception {
        //GIVEN
        Long mockUserId=userRepository.save(userMock).getId();

        //WHEN
        mockMvc.perform(
                        MockMvcRequestBuilders.delete("/api/user/" + mockUserId)
                )

                // THEN
                .andExpect(MockMvcResultMatchers.status().isOk());

    }

    @Test
    @WithMockUser(username = "red@mage.com")
    @DisplayName("Should respond with unauthorized if unauthorized user request to delete user")
    void testDeleteUser_UnauthorizedUser() throws Exception {
        //GIVEN
        Long mockUserId=userRepository.save(userMock).getId();
        userRepository.save(userMock2);

        //WHEN
        mockMvc.perform(
                        MockMvcRequestBuilders.delete("/api/user/" + mockUserId)
                )

        // THEN
        .andExpect(MockMvcResultMatchers.status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "red@mage.com")
    @DisplayName("Should throw bad request response if invalid id format when deleting user")
    void testDeleteUser_BadResponse() throws Exception {
        //GIVEN
        String invalidId = "Invalid_Id";

        //WHEN
        mockMvc.perform(
                        MockMvcRequestBuilders.delete("/api/user/" + invalidId)
                )

                // THEN
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }


    @Test
    @WithMockUser(username = "red@mage.com")
    @DisplayName("Should respond with unauthorized if unauthorized user request to delete user")
    void testDeleteUser_NotFoundUser() throws Exception {
        //GIVEN
        Long mockUserId = 999L;
        userRepository.save(userMock2);

        //WHEN
        mockMvc.perform(
                        MockMvcRequestBuilders.delete("/api/user/" + mockUserId)
                )

                // THEN
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }
}
