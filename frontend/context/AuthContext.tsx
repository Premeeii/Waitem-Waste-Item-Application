import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const t = await AsyncStorage.getItem('token');
    const uid = await AsyncStorage.getItem('userId');
    const uname = await AsyncStorage.getItem('username');
    const r = await AsyncStorage.getItem('role');
    if (t) {
      setToken(t);
      setUserId(uid ? parseInt(uid) : null);
      setUsername(uname);
      setRole(r);
    }
  };

  const login = async (t: string, uid: number, uname: string, r: string) => {
    await AsyncStorage.setItem('token', t);
    await AsyncStorage.setItem('userId', uid.toString());
    await AsyncStorage.setItem('username', uname);
    await AsyncStorage.setItem('role', r);
    setToken(t);
    setUserId(uid);
    setUsername(uname);
    setRole(r);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('username');
    await AsyncStorage.removeItem('role');
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
