import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'task-manager-token';
const USER_KEY = 'task-manager-user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const response = await authApi.me();
        setUser(response.data.user);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
      } catch (requestError) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrap();
  }, [token]);

  const persistSession = (session) => {
    setUser(session.user);
    setToken(session.token);
    localStorage.setItem(TOKEN_KEY, session.token);
    localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  };

  const login = async (credentials) => {
    setError('');

    try {
      const response = await authApi.login(credentials);
      persistSession(response.data);
      return response.data.user;
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Unable to log in';
      setError(message);
      throw new Error(message);
    }
  };

  const register = async (payload) => {
    setError('');

    try {
      const response = await authApi.register(payload);
      persistSession(response.data);
      return response.data.user;
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Unable to create account';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isBootstrapping,
      error,
      setError,
      login,
      register,
      logout,
      updateUser,
      isAuthenticated: Boolean(user),
    }),
    [user, token, isBootstrapping, error, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};
