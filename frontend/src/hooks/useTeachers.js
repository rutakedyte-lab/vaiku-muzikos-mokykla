import { useState, useEffect } from 'react';
import db, { id } from '../db/instantdb';

export const useTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setIsLoading(true);
      
      if (db.queryOnce && typeof db.queryOnce === 'function') {
        const result = await db.queryOnce({ teachers: {} });
        
        let teachersData = [];
        if (result) {
          if (result.data && result.data.teachers) {
            teachersData = result.data.teachers;
          } else if (result.teachers) {
            teachersData = result.teachers;
          } else if (Array.isArray(result)) {
            teachersData = result;
          } else if (result.data && Array.isArray(result.data)) {
            teachersData = result.data;
          }
        }
        
        console.log('Loaded teachers:', teachersData);
        setTeachers(teachersData);
        setError(null);
      } else if (db.query && typeof db.query === 'function') {
        const result = await db.query({ teachers: {} });
        const teachersData = result?.data?.teachers || result?.teachers || [];
        setTeachers(teachersData);
        setError(null);
      } else {
        console.warn('No query method available');
        setError(new Error('No query method available'));
      }
    } catch (err) {
      console.error('Error loading teachers:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createTeacher = async (teacherData) => {
    try {
      const teacherId = id();
      await db.transact([
        db.tx.teachers[teacherId].update({
          vardas: teacherData.vardas,
          specialybė: teacherData.specialybė,
        }),
      ]);
      await loadTeachers();
    } catch (err) {
      console.error('Error creating teacher:', err);
      throw err;
    }
  };

  const updateTeacher = async (id, teacherData) => {
    try {
      await db.transact([
        db.tx.teachers[id].update({
          ...(teacherData.vardas && { vardas: teacherData.vardas }),
          ...(teacherData.specialybė && { specialybė: teacherData.specialybė }),
        }),
      ]);
      await loadTeachers();
    } catch (err) {
      console.error('Error updating teacher:', err);
      throw err;
    }
  };

  const deleteTeacher = async (id) => {
    try {
      await db.transact([db.tx.teachers[id].delete()]);
      await loadTeachers();
    } catch (err) {
      console.error('Error deleting teacher:', err);
      throw err;
    }
  };

  const getTeacherSchedule = (teacherId) => {
    return null;
  };

  return {
    teachers,
    isLoading,
    error,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    getTeacherSchedule,
  };
};
