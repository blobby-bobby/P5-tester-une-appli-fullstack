package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
public class SessionServiceTest {

    @MockBean
    SessionRepository sessionRepository;

    @MockBean
    UserRepository userRepository;

    @Autowired
    SessionService sessionService;

    final Session mockSession = Session.builder()
            .id(1L)
            .name("Magic Session")
            .date(new Date())
            .description("The magic session")
            .users(new ArrayList<>())
            .build();

    final User mockUser = User.builder()
            .id(99L)
            .email("red@mage.com")
            .firstName("Red")
            .lastName("Mage")
            .admin(false)
            .password("Mage1234!")
            .build();

    @Test
    @DisplayName("should create session")
    public void testCreateSession() {
        // GIVEN
        Session newSession = new Session();

        // WHEN
        sessionService.create(newSession);

        // THEN
        verify(sessionRepository).save(newSession);
    }

    @Test
    @DisplayName("should delete session")
    public void testDeleteSession() {
        // WHEN
        sessionService.delete(1L);

        // THEN
        verify(sessionRepository).deleteById(1L);
    }

    @Test
    @DisplayName("should update session")
    public void testUpdateSession() {
        // WHEN
        sessionService.update(3L, mockSession);

        // THEN
        verify(sessionRepository).save(mockSession);
    }

    @Test
    @DisplayName("should participate")
    public void testParticipate() {
        // GIVEN
        when(sessionRepository.findById(3L)).thenReturn(Optional.of(mockSession));
        when(userRepository.findById(99L)).thenReturn(Optional.of(mockUser));

        // WHEN
        sessionService.participate(3L,99L);

        // THEN
        verify(sessionRepository).findById(3L);
        verify(userRepository).findById(99L);
    }

    @Test
    @DisplayName("should no longer participate")
    public void testNoLongerParticipate() {
        // GIVEN
        List<User> users = new ArrayList<>();
        users.add(mockUser);
        mockSession.setUsers(users);

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(mockSession));

        // WHEN
        sessionService.noLongerParticipate(1L,99L);

        // THEN
        verify(sessionRepository).save(mockSession);
    }
}
