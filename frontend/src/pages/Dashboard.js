import React from 'react';
import { useStudents } from '../hooks/useStudents';
import { useTeachers } from '../hooks/useTeachers';
import { useLessons } from '../hooks/useLessons';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { students, isLoading: studentsLoading } = useStudents();
  const { teachers, isLoading: teachersLoading } = useTeachers();
  const { lessons, isLoading: lessonsLoading } = useLessons();

  const isLoading = studentsLoading || teachersLoading || lessonsLoading;

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
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-merriweather italic text-brand-blue-1 mb-2">
            Sveiki atvykę!
          </h1>
          <p className="text-gray-600 text-lg">
            Vilniaus Broniaus Jonušo Muzikos Mokyklos valdymo sistema
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/students"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Mokiniai</p>
                <p className="text-3xl font-bold text-brand-blue-1">{students.length}</p>
              </div>
              <div className="w-12 h-12 bg-brand-light-blue-2 rounded-full flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </Link>

          <Link
            to="/teachers"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Mokytojai</p>
                <p className="text-3xl font-bold text-brand-blue-1">{teachers.length}</p>
              </div>
              <div className="w-12 h-12 bg-brand-light-blue-2 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎓</span>
              </div>
            </div>
          </Link>

          <Link
            to="/lessons"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pamokos</p>
                <p className="text-3xl font-bold text-brand-blue-1">{lessons.length}</p>
              </div>
              <div className="w-12 h-12 bg-brand-light-blue-2 rounded-full flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-merriweather italic text-brand-blue-1 mb-4">
            Greitieji veiksmai
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/students"
              className="p-4 border-2 border-brand-blue-1 rounded-lg hover:bg-brand-light-blue-2 transition-colors"
            >
              <h3 className="font-medium text-gray-900 mb-1">Peržiūrėti mokinius</h3>
              <p className="text-sm text-gray-600">Rodyti visų mokinių sąrašą</p>
            </Link>
            <Link
              to="/teachers"
              className="p-4 border-2 border-brand-blue-1 rounded-lg hover:bg-brand-light-blue-2 transition-colors"
            >
              <h3 className="font-medium text-gray-900 mb-1">Peržiūrėti mokytojus</h3>
              <p className="text-sm text-gray-600">Rodyti visų mokytojų sąrašą</p>
            </Link>
            <Link
              to="/lessons"
              className="p-4 border-2 border-brand-blue-1 rounded-lg hover:bg-brand-light-blue-2 transition-colors"
            >
              <h3 className="font-medium text-gray-900 mb-1">Peržiūrėti pamokas</h3>
              <p className="text-sm text-gray-600">Rodyti visų pamokų sąrašą</p>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
