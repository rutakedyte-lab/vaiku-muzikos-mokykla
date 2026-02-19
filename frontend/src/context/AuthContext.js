import React, { createContext, useState, useEffect, useContext } from 'react';
import db from '../db/instantdb';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    
    // Load users from InstantDB - with error handling
    loadUsers().finally(() => {
      setLoading(false);
    });
  }, []);

  const loadUsers = async () => {
    try {
      // Check if db.query exists
      if (!db.query) {
        console.warn('db.query is not available. Using empty users array.');
        setUsers([]);
        return;
      }
      
      const result = await db.query({ users: {} });
      const usersData = result?.data?.users || result?.users || [];
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users from InstantDB:', error);
      // Continue without users - login will work with localStorage only
      setUsers([]);
    }
  };

  const login = async (username, password) => {
    try {
      // First try to find user from loaded users
      let foundUser = users.find(
        (u) => u.username === username && u.password === password
      );

      // If not found and db.query exists, try to query directly
      if (!foundUser && db.query) {
        try {
          const result = await db.query({
            users: {
              $: {
                where: {
                  username: { $eq: username },
                  password: { $eq: password },
                },
              },
            },
          });
          const queriedUsers = result?.data?.users || result?.users || [];
          foundUser = queriedUsers[0];
        } catch (queryError) {
          console.error('Error querying users:', queryError);
        }
      }

      // Fallback: hardcoded demo users if InstantDB is not available
      if (!foundUser) {
        const demoUsers = [
          { id: '1', username: 'admin', password: 'admin123', role: 'admin' },
          { id: '2', username: 'viewer', password: 'viewer123', role: 'viewer' },
        ];
        foundUser = demoUsers.find(
          (u) => u.username === username && u.password === password
        );
      }

      if (!foundUser) {
        return {
          success: false,
          error: 'Neteisingi prisijungimo duomenys',
        };
      }

      const userData = {
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Prisijungimo klaida',
      };
    }
  };

  const sendMagicCode = async (email) => {
    try {
      if (!db.auth || !db.auth.sendMagicCode) {
        return {
          success: false,
          error: 'Magic code autentifikacija neprieinama. Patikrinkite InstantDB Auth nustatymus.',
        };
      }

      await db.auth.sendMagicCode({ email });
      return { success: true };
    } catch (error) {
      console.error('Error sending magic code:', error);
      return {
        success: false,
        error: error.message || 'Klaida siunčiant kodą el. paštu',
      };
    }
  };

  const loginWithMagicCode = async (email, code) => {
    try {
      if (!db.auth || !db.auth.signInWithMagicCode) {
        return {
          success: false,
          error: 'Magic code autentifikacija neprieinama. Patikrinkite InstantDB Auth nustatymus.',
        };
      }

      const result = await db.auth.signInWithMagicCode({
        email,
        code,
      });

      if (result && result.user) {
        // Get user role from InstantDB users table
        let userRole = 'viewer'; // default
        try {
          if (db.query) {
            const userResult = await db.query({
              users: {
                $: {
                  where: {
                    email: { $eq: email },
                  },
                },
              },
            });
            const usersData = userResult?.data?.users || userResult?.users || [];
            if (usersData.length > 0) {
              userRole = usersData[0].role || 'viewer';
            }
          }
        } catch (roleError) {
          console.warn('Could not fetch user role:', roleError);
        }

        const userData = {
          id: result.user.id,
          email: result.user.email || email,
          role: userRole,
        };

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      }

      return {
        success: false,
        error: 'Neteisingas kodas',
      };
    } catch (error) {
      console.error('Magic code login error:', error);
      return {
        success: false,
        error: error.message || 'Neteisingas kodas arba klaida prisijungiant',
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAdmin = () => user?.role === 'admin';
  const isViewer = () => user?.role === 'viewer';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        sendMagicCode,
        loginWithMagicCode,
        isAdmin,
        isViewer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
