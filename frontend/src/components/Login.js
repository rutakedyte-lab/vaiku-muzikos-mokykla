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
  const { login, sendMagicCode, loginWithMagicCode, loginWithGoogle } = useAuth();
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

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    const result = await loginWithGoogle();
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
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

        {/* Google Login */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">arba</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="mt-4 w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Prisijungti su Google
          </button>
        </div>

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
