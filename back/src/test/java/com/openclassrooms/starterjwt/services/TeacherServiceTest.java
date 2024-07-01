package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@SpringBootTest
public class TeacherServiceTest {

    @MockBean
    TeacherRepository teacherRepository;

    @Autowired
    TeacherService teacherService;

    final Teacher mockTeacher1 = Teacher.builder()
            .firstName("Minerva")
            .lastName("McGonagall")
            .build();

    final Teacher mockTeacher2 = Teacher.builder()
            .firstName("Severus")
            .lastName("Snape")
            .build();

    final List<Teacher> teachers = Arrays.asList(mockTeacher1, mockTeacher2);

    @Test
    @DisplayName("should find all teachers")
    public void testFindAllTeachers() {
        // GIVEN
        when(teacherRepository.findAll()).thenReturn(teachers);

        // WHEN
        List<Teacher> getAllTeachersList = teacherService.findAll();

        // THEN
        assertThat(getAllTeachersList.size()).isEqualTo(2);
        verify(teacherRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("should find teacher with its ID")
    public void testFindTeacherById() {
        // GIVEN
        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teachers.get(1)));

        // WHEN
        Teacher mockTeacher = teacherService.findById(1L);

        // THEN
        assertThat(mockTeacher).isEqualTo(mockTeacher1);
        verify(teacherRepository, times(1)).findById(1L);
    }
}
