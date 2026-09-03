import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginAdmin, logoutAdmin, subscribeToAuth } from '../firebase/auth';
import { checkIsAdminStatus } from '../firebase/admins';

const AuthContext = createContext({
  currentUser: null,
  isAdmin: false,
  loading: true,
  login: async () => {},
  logout: async () => {},
  refreshAdminStatus: async () => {},
});

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const verifyUserAdminStatus = async (user) => {
    if (!user) {
      setIsAdmin(false);
      return false;
    }
    try {
      const adminStatus = await checkIsAdminStatus(user);
      setIsAdmin(adminStatus);
      return adminStatus;
    } catch (error) {
      console.warn('Admin status verification failed:', error);
      setIsAdmin(false);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (user) => {
      setCurrentUser(user);
      if (user) {
        await verifyUserAdminStatus(user);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (email, password) => {
    const user = await loginAdmin(email, password);
    setCurrentUser(user);
    const authorized = await verifyUserAdminStatus(user);
    return { user, isAdmin: authorized };
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setCurrentUser(null);
    setIsAdmin(false);
  };

  const refreshAdminStatus = async () => {
    if (currentUser) {
      return await verifyUserAdminStatus(currentUser);
    }
    return false;
  };

  const value = {
    currentUser,
    isAdmin,
    loading,
    login: handleLogin,
    logout: handleLogout,
    refreshAdminStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
