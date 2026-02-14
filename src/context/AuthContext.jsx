import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + '/me', {
          withCredentials: true // sends the cookie to backend
        });

        if (res.data?.isStatus) {
          setUser(res.data.data);
        } else if (res.data?.user) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }

      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // 2. Login Helper - refetch user data after login for consistency
  const login = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/me', {
        withCredentials: true
      });

      if (res.data?.isStatus) {
        setUser(res.data.data);
      } else if (res.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    }
    setLoading(false);
  };

  // 3. Logout Helper
  const logout = async () => {
    try {
      await axios.post(import.meta.env.VITE_API_URL + '/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error(error);
    }
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);