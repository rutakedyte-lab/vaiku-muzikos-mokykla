import { useState, useEffect } from 'react';
import db, { id } from '../db/instantdb';

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      
      // Use queryOnce for one-time queries
      if (db.queryOnce && typeof db.queryOnce === 'function') {
        const result = await db.queryOnce({ students: {} });
        
        // Handle different response formats
        let studentsData = [];
        if (result) {
          if (result.data && result.data.students) {
            studentsData = result.data.students;
          } else if (result.students) {
            studentsData = result.students;
          } else if (Array.isArray(result)) {
            studentsData = result;
          } else if (result.data && Array.isArray(result.data)) {
            studentsData = result.data;
          }
        }
        
        console.log('Loaded students:', studentsData);
        setStudents(studentsData);
        setError(null);
      } else if (db.query && typeof db.query === 'function') {
        // Fallback to db.query if queryOnce doesn't exist
        const result = await db.query({ students: {} });
        const studentsData = result?.data?.students || result?.students || [];
        setStudents(studentsData);
        setError(null);
      } else {
        console.warn('No query method available');
        setError(new Error('No query method available'));
      }
    } catch (err) {
      console.error('Error loading students:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createStudent = async (studentData) => {
    try {
      const studentId = id();
      await db.transact([
        db.tx.students[studentId].update({
          vardas: studentData.vardas,
          amžius: parseInt(studentData.amžius),
          instrumentas: studentData.instrumentas,
        }),
      ]);
      await loadStudents();
    } catch (err) {
      console.error('Error creating student:', err);
      throw err;
    }
  };

  const updateStudent = async (id, studentData) => {
    try {
      await db.transact([
        db.tx.students[id].update({
          ...(studentData.vardas && { vardas: studentData.vardas }),
          ...(studentData.amžius && { amžius: parseInt(studentData.amžius) }),
          ...(studentData.instrumentas && { instrumentas: studentData.instrumentas }),
        }),
      ]);
      await loadStudents();
    } catch (err) {
      console.error('Error updating student:', err);
      throw err;
    }
  };

  const deleteStudent = async (id) => {
    try {
      await db.transact([db.tx.students[id].delete()]);
      await loadStudents();
    } catch (err) {
      console.error('Error deleting student:', err);
      throw err;
    }
  };

  const filterByInstrument = (instrument) => {
    return students.filter((s) => s.instrumentas === instrument);
  };

  return {
    students,
    isLoading,
    error,
    createStudent,
    updateStudent,
    deleteStudent,
    filterByInstrument,
  };
};
