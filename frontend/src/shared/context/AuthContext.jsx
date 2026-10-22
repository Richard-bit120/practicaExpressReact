import { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../constants/storage';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = storageService.getToken();
    const storedUser = storageService.getUser();
    if (token && storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, admin } = response.data;
    storageService.setToken(token);
    storageService.setUser(admin);
    setUser(admin);
    return admin;
  };

  const logout = () => {
    storageService.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);