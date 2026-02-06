import React, { useState } from 'react';
import { useTeachers } from '../hooks/useTeachers';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import TeacherForm from '../components/TeacherForm';
import { Link } from 'react-router-dom';

const Teachers = () => {
  const { teachers, isLoading, createTeacher, updateTeacher, deleteTeacher } = useTeachers();
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const { isAdmin } = useAuth();

  const handleDelete = async (id) => {
    if (!window.confirm('Ar tikrai norite ištrinti šį mokytoją?')) return;
    try {
      await deleteTeacher(id);
    } catch (error) {
      console.error('Error deleting teacher:', error);
      alert('Klaida ištrinant mokytoją');
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTeacher(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingTeacher) {
        await updateTeacher(editingTeacher.id, formData);
      } else {
        await createTeacher(formData);
      }
      setShowForm(false);
      setEditingTeacher(null);
    } catch (error) {
      console.error('Error saving teacher:', error);
      alert('Klaida išsaugant mokytoją');
    }
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
          <h1 className="text-3xl font-merriweather italic text-brand-blue-1">Mokytojai</h1>
          {isAdmin() && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-brand-blue-1 text-white px-6 py-2 rounded-md hover:bg-brand-blue-2 transition-colors"
            >
              + Pridėti mokytoją
            </button>
          )}
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              Mokytojų nerasta
            </div>
          ) : (
            teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-neutral font-medium text-gray-900 mb-2">
                  {teacher.vardas}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{teacher.specialybė}</p>
                <div className="flex justify-between items-center">
                  <Link
                    to={`/teachers/${teacher.id}/schedule`}
                    className="text-brand-blue-1 hover:text-brand-blue-2 text-sm font-medium"
                  >
                    Peržiūrėti tvarkaraštį →
                  </Link>
                  {isAdmin() && (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEdit(teacher)}
                        className="text-brand-blue-1 hover:text-brand-blue-2 text-sm"
                      >
                        Redaguoti
                      </button>
                      <button
                        onClick={() => handleDelete(teacher.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Ištrinti
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <TeacherForm
          teacher={editingTeacher}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </Layout>
  );
};

export default Teachers;
