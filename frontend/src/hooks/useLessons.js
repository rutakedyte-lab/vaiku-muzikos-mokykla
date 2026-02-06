import { useState, useEffect } from 'react';
import db, { id } from '../db/instantdb';

export const useLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      if (db.queryOnce && typeof db.queryOnce === 'function') {
        const result = await db.queryOnce({
          lessons: {},
          students: {},
          teachers: {},
        });
        
        let lessonsData = [];
        let studentsData = [];
        let teachersData = [];
        
        if (result) {
          if (result.data) {
            lessonsData = result.data.lessons || [];
            studentsData = result.data.students || [];
            teachersData = result.data.teachers || [];
          } else {
            lessonsData = result.lessons || [];
            studentsData = result.students || [];
            teachersData = result.teachers || [];
          }
        }
        
        console.log('Loaded lessons:', lessonsData);
        console.log('Loaded students:', studentsData);
        console.log('Loaded teachers:', teachersData);
        
        setLessons(lessonsData);
        setStudents(studentsData);
        setTeachers(teachersData);
        setError(null);
      } else if (db.query && typeof db.query === 'function') {
        const result = await db.query({
          lessons: {},
          students: {},
          teachers: {},
        });
        
        const lessonsData = result?.data?.lessons || result?.lessons || [];
        const studentsData = result?.data?.students || result?.students || [];
        const teachersData = result?.data?.teachers || result?.teachers || [];
        
        setLessons(lessonsData);
        setStudents(studentsData);
        setTeachers(teachersData);
        setError(null);
      } else {
        console.warn('No query method available');
        setError(new Error('No query method available'));
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createLesson = async (lessonData) => {
    try {
      const lessonId = id();
      await db.transact([
        db.tx.lessons[lessonId].update({
          student_id: lessonData.student_id,
          teacher_id: lessonData.teacher_id,
          laikas: lessonData.laikas,
        }),
      ]);
      await loadData();
    } catch (err) {
      console.error('Error creating lesson:', err);
      throw err;
    }
  };

  const updateLesson = async (id, lessonData) => {
    try {
      await db.transact([
        db.tx.lessons[id].update({
          ...(lessonData.student_id && { student_id: lessonData.student_id }),
          ...(lessonData.teacher_id && { teacher_id: lessonData.teacher_id }),
          ...(lessonData.laikas && { laikas: lessonData.laikas }),
        }),
      ]);
      await loadData();
    } catch (err) {
      console.error('Error updating lesson:', err);
      throw err;
    }
  };

  const deleteLesson = async (id) => {
    try {
      await db.transact([db.tx.lessons[id].delete()]);
      await loadData();
    } catch (err) {
      console.error('Error deleting lesson:', err);
      throw err;
    }
  };

  const updateLessonVideo = async (lessonId, videoPath) => {
    try {
      await db.transact([
        db.tx.lessons[lessonId].update({
          video_path: videoPath,
        }),
      ]);
      await loadData();
    } catch (err) {
      console.error('Error updating lesson video:', err);
      throw err;
    }
  };

  // Join lessons with students and teachers
  const lessonsWithDetails = lessons.map((lesson) => {
    const student = students.find((s) => s.id === lesson.student_id);
    const teacher = teachers.find((t) => t.id === lesson.teacher_id);
    return {
      ...lesson,
      student,
      teacher,
    };
  });

  const getTeacherSchedule = (teacherId) => {
    return lessonsWithDetails.filter((lesson) => lesson.teacher_id === teacherId);
  };

  return {
    lessons: lessonsWithDetails,
    isLoading,
    error,
    createLesson,
    updateLesson,
    deleteLesson,
    updateLessonVideo,
    getTeacherSchedule,
  };
};
