import React, { useState, useEffect } from 'react';
import { useStudents } from '../hooks/useStudents';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import StudentForm from '../components/StudentForm';

const Students = () => {
  const { students, isLoading, createStudent, updateStudent, deleteStudent, filterByInstrument } = useStudents();
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedInstrument, setSelectedInstrument] = useState('');
  const [instruments, setInstruments] = useState([]);
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (selectedInstrument) {
      const filtered = filterByInstrument(selectedInstrument);
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [selectedInstrument, students, filterByInstrument]);

  useEffect(() => {
    // Extract unique instruments
    const uniqueInstruments = [...new Set(students.map(s => s.instrumentas))];
    setInstruments(uniqueInstruments);
  }, [students]);

  const handleDelete = async (id) => {
    if (!window.confirm('Ar tikrai norite ištrinti šį mokinį?')) return;
    try {
      await deleteStudent(id);
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Klaida ištrinant mokinį');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, formData);
      } else {
        await createStudent(formData);
      }
      setShowForm(false);
      setEditingStudent(null);
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Klaida išsaugant mokinį');
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
          <h1 className="text-3xl font-merriweather italic text-brand-blue-1">Mokiniai</h1>
          {isAdmin() && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-brand-blue-1 text-white px-6 py-2 rounded-md hover:bg-brand-blue-2 transition-colors"
            >
              + Pridėti mokinį
            </button>
          )}
        </div>

        {/* Filter */}
        <div className="bg-white p-4 rounded-lg shadow">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtruoti pagal instrumentą:
          </label>
          <select
            value={selectedInstrument}
            onChange={(e) => setSelectedInstrument(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-1"
          >
            <option value="">Visi instrumentai</option>
            {instruments.map((instrument) => (
              <option key={instrument} value={instrument}>
                {instrument}
              </option>
            ))}
          </select>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-brand-blue-1 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Vardas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Amžius
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Instrumentas
                </th>
                {isAdmin() && (
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                    Veiksmai
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin() ? 4 : 3} className="px-6 py-4 text-center text-gray-500">
                    Mokinių nerasta
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.vardas}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.amžius}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.instrumentas}
                    </td>
                    {isAdmin() && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(student)}
                          className="text-brand-blue-1 hover:text-brand-blue-2 mr-4"
                        >
                          Redaguoti
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
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
        <StudentForm
          student={editingStudent}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </Layout>
  );
};

export default Students;
