import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'magic'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, sendMagicCode, loginWithMagicCode } = useAuth();
  const navigate = useNavigate();

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await sendMagicCode(email);
    if (result.success) {
      setCodeSent(true);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleMagicCodeSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await loginWithMagicCode(email, code);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const resetMagicCode = () => {
    setCodeSent(false);
    setCode('');
    setError('');
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

        {/* Login Method Tabs */}
        <div className="flex mb-6 border-b border-gray-200">
          <button
            type="button"
            onClick={() => {
              setLoginMethod('password');
              setError('');
              resetMagicCode();
            }}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
              loginMethod === 'password'
                ? 'text-brand-blue-1 border-b-2 border-brand-blue-1'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Slaptažodis
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMethod('magic');
              setError('');
              resetMagicCode();
            }}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
              loginMethod === 'magic'
                ? 'text-brand-blue-1 border-b-2 border-brand-blue-1'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Magic Code
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Password Login Form */}
        {loginMethod === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-blue-1 text-white py-2 px-4 rounded-md hover:bg-brand-blue-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Prisijungiama...' : 'Prisijungti'}
            </button>
          </form>
        )}

        {/* Magic Code Login Form */}
        {loginMethod === 'magic' && (
          <>
            {!codeSent ? (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    El. pašto adresas
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-1"
                    placeholder="vardas@example.com"
                    required
                    disabled={loading}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Jums bus išsiųstas kodas el. paštu
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-blue-1 text-white py-2 px-4 rounded-md hover:bg-brand-blue-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Siunčiama...' : 'Siųsti kodą'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleMagicCodeSubmit} className="space-y-4">
                <div className="bg-brand-light-blue-2 p-4 rounded-md mb-4">
                  <p className="text-sm text-gray-700">
                    Kodas išsiųstas į <strong>{email}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={resetMagicCode}
                    className="mt-2 text-sm text-brand-blue-1 hover:text-brand-blue-2 underline"
                  >
                    Pakeisti el. pašto adresą
                  </button>
                </div>

                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                    Įveskite kodą
                  </label>
                  <input
                    type="text"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-1 text-center text-2xl tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="w-full bg-brand-blue-1 text-white py-2 px-4 rounded-md hover:bg-brand-blue-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Prisijungiama...' : 'Prisijungti'}
                </button>
              </form>
            )}
          </>
        )}

        {/* Demo Accounts Info */}
        {loginMethod === 'password' && (
          <div className="mt-6 text-sm text-gray-600 text-center">
            <p>Demo paskyros:</p>
            <p className="mt-2">
              <strong>Admin:</strong> admin / admin123<br />
              <strong>Viewer:</strong> viewer / viewer123
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
