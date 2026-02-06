import React, { useState, useEffect } from 'react';

const LessonForm = ({ lesson, students, teachers, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    student_id: '',
    teacher_id: '',
    laikas: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (lesson) {
      setFormData({
        student_id: lesson.student_id || '',
        teacher_id: lesson.teacher_id || '',
        laikas: lesson.laikas || '',
      });
    }
  }, [lesson]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.student_id || !formData.teacher_id || !formData.laikas) {
      setError('Visi laukai privalomi');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      setError(error.message || 'Klaida išsaugant duomenis');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-merriweather italic text-brand-blue-1 mb-4">
          {lesson ? 'Redaguoti pamoką' : 'Pridėti pamoką'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="student_id" className="block text-sm font-medium text-gray-700 mb-1">
              Mokinys *
            </label>
            <select
              id="student_id"
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-1"
              required
            >
              <option value="">Pasirinkite mokinį</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.vardas} ({student.instrumentas})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="teacher_id" className="block text-sm font-medium text-gray-700 mb-1">
              Mokytojas *
            </label>
            <select
              id="teacher_id"
              name="teacher_id"
              value={formData.teacher_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-1"
              required
            >
              <option value="">Pasirinkite mokytoją</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.vardas} ({teacher.specialybė})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="laikas" className="block text-sm font-medium text-gray-700 mb-1">
              Laikas *
            </label>
            <input
              type="datetime-local"
              id="laikas"
              name="laikas"
              value={formData.laikas}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-1"
              required
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Atšaukti
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-blue-1 text-white rounded-md hover:bg-brand-blue-2 transition-colors"
            >
              {lesson ? 'Išsaugoti' : 'Pridėti'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LessonForm;
