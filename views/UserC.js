
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const storedToken = await AsyncStorage.getItem('token');

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedToken) {
        setToken(storedToken);
      }
    };

    loadUserData();
  }, []);

  const login = async (userData, token) => {
    setUser(userData);
    setToken(token);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    await AsyncStorage.setItem('token', token);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

