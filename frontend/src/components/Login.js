import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(username, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-blue-1 to-brand-light-blue-2">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-merriweather italic text-brand-blue-1 mb-2">
            Vilniaus Broniaus Jonušo
          </h1>
          <h2 className="text-2xl font-neutral font-medium text-brand-black">
            Muzikos Mokykla
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Vartotojo vardas
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-1"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Slaptažodis
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-1"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brand-blue-1 text-white py-2 px-4 rounded-md hover:bg-brand-blue-2 transition-colors font-medium"
          >
            Prisijungti
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-600 text-center">
          <p>Demo paskyros:</p>
          <p className="mt-2">
            <strong>Admin:</strong> admin / admin123<br />
            <strong>Viewer:</strong> viewer / viewer123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
