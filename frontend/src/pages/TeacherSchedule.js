import React from 'react';
import { useParams } from 'react-router-dom';
import { useTeachers } from '../hooks/useTeachers';
import { useLessons } from '../hooks/useLessons';
import Layout from '../components/Layout';

const TeacherSchedule = () => {
  const { id } = useParams();
  const { teachers, isLoading: teachersLoading } = useTeachers();
  const { getTeacherSchedule, isLoading: lessonsLoading } = useLessons();

  const teacher = teachers.find((t) => t.id === id);
  const schedule = getTeacherSchedule(id);

  if (teachersLoading || lessonsLoading) {
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
        <div>
          <h1 className="text-3xl font-merriweather italic text-brand-blue-1 mb-2">
            {teacher?.vardas} - Tvarkaraštis
          </h1>
          <p className="text-gray-600">{teacher?.specialybė}</p>
        </div>

        {!schedule || schedule.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            Tvarkaraščio duomenų nėra
          </div>
        ) : (
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
                    Instrumentas
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schedule.map((lesson) => (
                  <tr key={lesson.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lesson.laikas}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {lesson.student?.vardas || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lesson.student?.instrumentas || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TeacherSchedule;
