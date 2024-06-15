package com.openclassrooms.starterjwt.integration.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.time.LocalDateTime;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;

@SpringBootTest
@AutoConfigureMockMvc
public class SessionControllerIT {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    TeacherRepository teacherRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    SessionRepository sessionRepository;

    @Autowired
    ObjectMapper mapper;

    final Teacher mockTeacher=Teacher.builder()
            .firstName("mockFN")
            .lastName("mockLN")
            .build();

    final User mockUser=User.builder()
            .firstName("Red")
            .lastName("Mage")
            .email("red@mage.com")
            .admin(false)
            .password("Mage1234!")
            .build();

    final Session mockSession = Session.builder()
            .name("Magic Session")
            .date(new Date())
            .teacher(mockTeacher)
            .description("The magic session")
            .createdAt(LocalDateTime.now())
            .build();

    @AfterEach
    void clean() {
        sessionRepository.deleteAll();
        userRepository.deleteAll();
        teacherRepository.deleteAll();
    }

    @Test
    @WithMockUser(roles="USER")
    @DisplayName("Should get all sessions, when authorized user")
    void testGetAllSessions_ResponseOk() throws Exception {
        //GIVEN
        userRepository.save(mockUser);
        teacherRepository.save(mockTeacher);
        sessionRepository.save(mockSession);

        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/session/"))

        //THEN
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.content().string(containsString("Magic Session")));
    }

    @Test
    @WithMockUser(roles="USER")
    @DisplayName("Should get one session by ID, when authorized user")
    void testGetOneSessionById_ResponseOk() throws Exception {
        // GIVEN
        userRepository.save(mockUser);
        teacherRepository.save(mockTeacher);
        Long mockSessionId = sessionRepository.save(mockSession).getId();

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/session/" + mockSessionId))

        // THEN
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.content().string(containsString("Magic Session")));
    }

    @Test
    @DisplayName("Should throw when getting one session by ID, if unauthorized user")
    void testGetOneSessionById_UnauthorizedResponse() throws Exception {
        // GIVEN
        userRepository.save(mockUser);
        teacherRepository.save(mockTeacher);
        Long mockSessionId = sessionRepository.save(mockSession).getId();

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/session/" + mockSessionId))

                // THEN
                .andExpect(MockMvcResultMatchers.status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles="USER")
    @DisplayName("Should throw when getting one session by ID, if invalid ID format")
    void testGetOneSessionById_InvalidIdFormat() throws Exception {
        // GIVEN
        String mockSessionId = "invalid_ID";

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/session/" + mockSessionId))

        // THEN
        .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    @WithMockUser(roles="USER")
    @DisplayName("Should throw when getting one session by ID, if ID is not found")
    void testGetOneSessionById_NotFound() throws Exception {
        // GIVEN
        Long mockSessionId = 999L;

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/session/" + mockSessionId))

                // THEN
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    @WithMockUser(username = "red@mage.com")
    @DisplayName("Should create session successfully")
    void testCreateSession_ResponseOk() throws Exception {
        // GIVEN
        userRepository.save(mockUser);
        teacherRepository.save(mockTeacher);
        sessionRepository.save(mockSession);

        SessionDto createdMockSession = SessionDto.builder()
                .name("Black Magic Session")
                .teacher_id(mockTeacher.getId())
                .date(new Date())
                .description("That's magic !!!")
                .build();

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/session")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(createdMockSession))
                )

        // THEN
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    @DisplayName("Should update session successfully")
    @WithMockUser(username = "red@mage.com")
    void testUpdateSession_ResponseOk() throws Exception {
        // GIVEN
        userRepository.save(mockUser);
        teacherRepository.save(mockTeacher);
        Long mockSessionId = sessionRepository.save(mockSession).getId();

        SessionDto updatingMockSession = SessionDto.builder()
                .name("White Magic Session")
                .teacher_id(mockTeacher.getId())
                .date(new Date())
                .description("That's magic too !!!")
                .build();

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.put("/api/session/" + mockSessionId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(updatingMockSession))
                )
        // THEN
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string(containsString("That's magic too !!!")));

    }

    @Test
    @DisplayName("Should throw when updating session if invalid Id format")
    @WithMockUser(username = "red@mage.com")
    void testUpdateSession_InvalidId() throws Exception {
        // GIVEN
        userRepository.save(mockUser);
        teacherRepository.save(mockTeacher);
        String mockSessionId = "invalid_Id";

        SessionDto updatingMockSession = SessionDto.builder()
                .name("White Magic Session")
                .teacher_id(mockTeacher.getId())
                .date(new Date())
                .description("That's magic too !!!")
                .build();

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.put("/api/session/" + mockSessionId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(updatingMockSession))
                )
                // THEN
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "red@mage.com")
    @DisplayName("Should delete session successfully")
    void testDeleteSession_ResponseOk() throws Exception {
        // GIVEN
        userRepository.save(mockUser);
        teacherRepository.save(mockTeacher);
        Long mockSessionId = sessionRepository.save(mockSession).getId();

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/session/" + mockSessionId)
                )

        // THEN
        .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    @WithMockUser(username = "red@mage.com")
    @DisplayName("Should throw when deleting session if invalid Id format")
    void testDeleteSession_InvalidId() throws Exception {
        // GIVEN
        userRepository.save(mockUser);
        teacherRepository.save(mockTeacher);
        String mockSessionId = "invalid_Id";

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/session/" + mockSessionId)
                )

        // THEN
        .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "red@mage.com")
    @DisplayName("Should throw when deleting session if session's Id is not found")
    void testDeleteSession_IsNotFound() throws Exception {
        // GIVEN
        userRepository.save(mockUser);
        teacherRepository.save(mockTeacher);
        Long mockSessionId = 99L;

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/session/" + mockSessionId)
                )

                // THEN
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    @WithMockUser(roles="USER")
    @DisplayName("Should add user to session successfully if authorized user")
    void testParticipateToSession_ResponseOk() throws Exception {
        // GIVEN
        Long mockUserId = userRepository.save(mockUser).getId();
        teacherRepository.save(mockTeacher);
        Long mockSessionId = sessionRepository.save(mockSession).getId();

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/session/" + mockSessionId + "/participate/" + mockUserId))
        // THEN
                .andExpect(MockMvcResultMatchers.status().isOk());
        assertThat(sessionRepository.findById(mockSessionId).isPresent()).isTrue();
        assertThat(sessionRepository.findById(mockSessionId).get().getUsers().contains(mockUser)).isTrue();
    }

    @Test
    @WithMockUser(roles="USER")
    @DisplayName("Should throw when adding user to session if invalid Id format")
    void testParticipateSession_InvalidId() throws Exception {
        // GIVEN
        Long mockUserId = userRepository.save(mockUser).getId();
        String invalidId = "invalid_Id";
        teacherRepository.save(mockTeacher);
        Long mockSessionId = sessionRepository.save(mockSession).getId();

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/session/" + invalidId + "/participate/" + mockUserId))

        // THEN
        .andExpect(MockMvcResultMatchers.status().isBadRequest());

        // OR WHEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/session/" + mockSessionId + "/participate/" + invalidId))

        // THEN
        .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    @WithMockUser(roles="USER")
    @DisplayName("Should remove user participation successfully if authorized user")
    void testDeleteParticipation_ResponseOk() throws Exception {
        // GIVEN
        teacherRepository.save(mockTeacher);
        Long mockSessionId = sessionRepository.save(mockSession).getId();

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/session/" + mockSessionId))
                // THEN
                .andExpect(MockMvcResultMatchers.status().isOk());
        assertThat(sessionRepository.findById(mockSessionId).isPresent()).isFalse();
    }

    @Test
    @WithMockUser(roles="USER")
    @DisplayName("Should throw when removing user participation if invalid Id format")
    void testDeleteParticipation_InvalidId() throws Exception {
        // GIVEN
        Long mockUserId = userRepository.save(mockUser).getId();
        String invalidId = "invalid_Id";
        teacherRepository.save(mockTeacher);
        Long mockSessionId = sessionRepository.save(mockSession).getId();

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/session/" + invalidId + "/participate/" + mockUserId))

                // THEN
                .andExpect(MockMvcResultMatchers.status().isBadRequest());

        // OR WHEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/session/" + mockSessionId + "/participate/" + invalidId))

                // THEN
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }
}
