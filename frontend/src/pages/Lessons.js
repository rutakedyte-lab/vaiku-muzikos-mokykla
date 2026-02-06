import React, { useState } from 'react';
import { useLessons } from '../hooks/useLessons';
import { useStudents } from '../hooks/useStudents';
import { useTeachers } from '../hooks/useTeachers';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import LessonForm from '../components/LessonForm';
import LessonVideo from '../components/LessonVideo';

const Lessons = () => {
  const { lessons, isLoading, createLesson, updateLesson, deleteLesson } = useLessons();
  const { students } = useStudents();
  const { teachers } = useTeachers();
  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const { isAdmin } = useAuth();

  const handleDelete = async (id) => {
    if (!window.confirm('Ar tikrai norite ištrinti šią pamoką?')) return;
    try {
      await deleteLesson(id);
    } catch (error) {
      console.error('Error deleting lesson:', error);
      alert('Klaida ištrinant pamoką');
    }
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingLesson(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingLesson) {
        await updateLesson(editingLesson.id, formData);
      } else {
        await createLesson(formData);
      }
      setShowForm(false);
      setEditingLesson(null);
    } catch (error) {
      console.error('Error saving lesson:', error);
      alert('Klaida išsaugant pamoką');
    }
  };

  const handleViewVideo = (lesson) => {
    setSelectedLesson(lesson);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue-1 mx-auto"></div>
          <p className="mt-4 text-gray-600">Kraunama...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-merriweather italic text-brand-blue-1">Pamokos</h1>
          {isAdmin() && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-brand-blue-1 text-white px-6 py-2 rounded-md hover:bg-brand-blue-2 transition-colors"
            >
              + Pridėti pamoką
            </button>
          )}
        </div>

        {/* Lessons Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-brand-blue-1 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Laikas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Mokinys
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Mokytojas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Video
                </th>
                {isAdmin() && (
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                    Veiksmai
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lessons.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin() ? 5 : 4} className="px-6 py-4 text-center text-gray-500">
                    Pamokų nerasta
                  </td>
                </tr>
              ) : (
                lessons.map((lesson) => (
                  <tr key={lesson.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lesson.laikas}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {lesson.student?.vardas || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lesson.teacher?.vardas || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {lesson.video_path ? (
                        <button
                          onClick={() => handleViewVideo(lesson)}
                          className="text-brand-blue-1 hover:text-brand-blue-2 font-medium"
                        >
                          Peržiūrėti video
                        </button>
                      ) : (
                        <button
                          onClick={() => handleViewVideo(lesson)}
                          className="text-brand-blue-1 hover:text-brand-blue-2 font-medium"
                        >
                          {isAdmin() ? 'Įkelti video' : 'Nėra video'}
                        </button>
                      )}
                    </td>
                    {isAdmin() && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(lesson)}
                          className="text-brand-blue-1 hover:text-brand-blue-2 mr-4"
                        >
                          Redaguoti
                        </button>
                        <button
                          onClick={() => handleDelete(lesson.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Ištrinti
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <LessonForm
          lesson={editingLesson}
          students={students}
          teachers={teachers}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Video Modal */}
      {selectedLesson && (
        <LessonVideo
          lesson={selectedLesson}
          onClose={() => setSelectedLesson(null)}
        />
      )}
    </Layout>
  );
};

export default Lessons;
