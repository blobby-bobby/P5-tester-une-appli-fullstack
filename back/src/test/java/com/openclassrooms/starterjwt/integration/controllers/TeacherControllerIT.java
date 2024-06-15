package com.openclassrooms.starterjwt.integration.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
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

@SpringBootTest
@AutoConfigureMockMvc
public class TeacherControllerIT {
    @Autowired
    MockMvc mockMvc;

    @Autowired
    TeacherRepository teacherRepository;

    @Autowired
    ObjectMapper mapper;

    final Teacher teacherMock = Teacher.builder()
            .firstName("Blue")
            .lastName("Mage")
            .build();

    @AfterEach
    void clean() { teacherRepository.deleteAll(); }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("Should find teacher by ID if authorized User")
    void testFindById_ResponseOK() throws Exception {
        // GIVEN
        Long mockTeacherId = teacherRepository.save(teacherMock).getId();

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/teacher/"+ mockTeacherId))

        // THEN
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("Should throws when finding teacher by ID is not found")
    void testFindById_IsNotFound() throws Exception {
        // GIVEN
        Long mockTeacherId = 99L;

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/teacher/"+ mockTeacherId))

        // THEN
        .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("Should throws when finding teacher by invalid ID format")
    void testFindById_InvalidId() throws Exception {
        // GIVEN
        String invalidTeacherId = "Invalid_ID";

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/teacher/" + invalidTeacherId))

        // THEN
        .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("Should find all teachers")
    void testFindAll_ResponseOk() throws Exception {
        // GIVEN
        teacherRepository.save(teacherMock);

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/teacher"))

        // THEN
        .andExpect(MockMvcResultMatchers.status().isOk());
    }
}
