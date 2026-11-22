// context/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, getUserData } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data including role
        const userData = await getUserData(firebaseUser.uid);
        setUser(firebaseUser);
        setUserRole(userData?.role || 'user');
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const isAdmin = () => {
    return userRole === 'admin';
  };

  const value = {
    user,
    loading,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};