import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-brand-blue-1 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
                <div>
                  <h1 className="text-lg font-merriweather italic text-brand-blue-1">
                    Vilniaus Broniaus Jonušo
                  </h1>
                  <p className="text-sm font-neutral text-gray-600">Muzikos Mokykla</p>
                </div>
              </Link>

              <nav className="hidden md:flex space-x-4">
                <Link
                  to="/students"
                  className={`px-4 py-2 rounded-md transition-colors ${
                    isActive('/students')
                      ? 'bg-brand-blue-1 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Mokiniai
                </Link>
                <Link
                  to="/teachers"
                  className={`px-4 py-2 rounded-md transition-colors ${
                    isActive('/teachers')
                      ? 'bg-brand-blue-1 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Mokytojai
                </Link>
                <Link
                  to="/lessons"
                  className={`px-4 py-2 rounded-md transition-colors ${
                    isActive('/lessons')
                      ? 'bg-brand-blue-1 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Pamokos
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.username} ({user?.role === 'admin' ? 'Administratorius' : 'Peržiūros'})
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Atsijungti
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
