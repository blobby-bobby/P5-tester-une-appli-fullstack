package com.openclassrooms.starterjwt.integration.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;


@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerIT {
    @Autowired
    MockMvc mockMvc;

    @Autowired
    UserRepository userRepository;

    // mappe les requêtes MVC de JSON en string
    // NEEDED pour tous les tests avec requêtes POST
    @Autowired
    ObjectMapper mapper;

    final User userMock = User.builder()
            .firstName("User")
            .lastName("Test")
            .admin(false)
            .email("user@test.com")
            .password(new BCryptPasswordEncoder().encode("Aa123456!"))
            .build();

    @BeforeEach
    void init() {
        userRepository.deleteAll();
        userRepository.save(userMock);
    }

    @AfterEach
    void clean() {
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("Should log in with valid real user data")
    void testLogin_ResponseOK() throws Exception {
        // GIVEN
        LoginRequest request = LoginRequest.builder()
                .email("user@test.com")
                .password("Aa123456!")
                .build();

        // THEN
        mockMvc.perform(
                MockMvcRequestBuilders
                        .post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                        .andExpect(MockMvcResultMatchers.status().isOk());

    }

    @Test
    @DisplayName("Should not log in if invalid real user data")
    void testLogin_UnauthorizedResponse() throws Exception {
        // GIVEN
        LoginRequest request = LoginRequest.builder()
                .email("bulle@test.com")
                .password("wrong_password")
                .build();

        // WHEN
        mockMvc.perform(
                        MockMvcRequestBuilders
                                .post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(mapper.writeValueAsString(request)))
        // THEN
                .andExpect(MockMvcResultMatchers.status().isUnauthorized());

    }

    @Test
    @DisplayName("Should register new user with valid data")
    void testRegister_ResponseOk() throws Exception {
        // GIVEN
        SignupRequest request = SignupRequest.builder()
                .email("user@testing.com")
                .password("Aa123456!")
                .firstName("User")
                .lastName("Test")
                .build();

        // WHEN
        mockMvc.perform(
                MockMvcRequestBuilders
                        .post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(request)))
        // THEN
                .andExpect(MockMvcResultMatchers.status().isOk());

        assertThat(userRepository.findByEmail("user@testing.com").isPresent()).isTrue();

    }

    @Test
    @DisplayName("Should not register and warn if email is already taken")
    void testAlreadyTakenEmailWhenRegister() throws Exception {
        // GIVEN
        userRepository.save(userMock);

        SignupRequest request = SignupRequest.builder()
                .email("user@test.com")
                .password("Aa123456!")
                .firstName("User")
                .lastName("Test")
                .build();

        // WHEN
        mockMvc.perform(
                MockMvcRequestBuilders
                        .post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(request)))

        // THEN
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.content().string(containsString("Email is already taken")));
    }
}
