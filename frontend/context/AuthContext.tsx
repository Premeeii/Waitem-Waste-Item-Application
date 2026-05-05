import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const setStorageItem = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    try { localStorage.setItem(key, value); } catch (e) { console.error(e); }
  } else {
    await AsyncStorage.setItem(key, value);
  }
};

const getStorageItem = async (key: string) => {
  if (Platform.OS === 'web') {
    try { return localStorage.getItem(key); } catch (e) { console.error(e); return null; }
  } else {
    return await AsyncStorage.getItem(key);
  }
};

const removeStorageItem = async (key: string) => {
  if (Platform.OS === 'web') {
    try { localStorage.removeItem(key); } catch (e) { console.error(e); }
  } else {
    await AsyncStorage.removeItem(key);
  }
};

type AuthContextType = {
  token: string | null;
  userId: number | null;
  username: string | null;
  role: string | null;
  isLoggedIn: boolean;
  login: (token: string, userId: number, username: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  token: null, userId: null, username: null, role: null, isLoggedIn: false,
  login: async () => {}, logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    loadAuth();
  }, []);

  const loadAuth = async () => {
    const t = await getStorageItem('token');
    const uid = await getStorageItem('userId');
    const uname = await getStorageItem('username');
    const r = await getStorageItem('role');
    if (t) {
      setToken(t);
      setUserId(uid ? parseInt(uid) : null);
      setUsername(uname);
      setRole(r);
    }
  };

  const login = async (t: string, uid: number, uname: string, r: string) => {
    await setStorageItem('token', t);
    await setStorageItem('userId', uid.toString());
    await setStorageItem('username', uname);
    await setStorageItem('role', r);
    setToken(t);
    setUserId(uid);
    setUsername(uname);
    setRole(r);
  };

  const logout = async () => {
    if (Platform.OS === 'web') {
      try { localStorage.clear(); } catch (e) { console.error(e); }
    } else {
      await AsyncStorage.clear();
    }
    setToken(null);
    setUserId(null);
    setUsername(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, userId, username, role, isLoggedIn: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
