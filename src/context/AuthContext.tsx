import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'student' | 'tpo' | 'company';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  provider?: 'local' | 'google';
  companyName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  loginWithGoogle: (idToken: string, role: UserRole) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole, companyName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  type StoredUser = { id: string; name: string; email: string; role: UserRole; passwordHash?: string; avatar?: string; provider?: 'local' | 'google'; companyName?: string };
  const [users, setUsers] = useState<StoredUser[]>(() => {
    try {
      const saved = localStorage.getItem('users');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const sha256 = async (text: string): Promise<string> => {
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    const bytes = Array.from(new Uint8Array(buf));
    return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    if (!email || !password) return false;
    if (password.length < 8) return false; // >= 8 required
    const hash = await sha256(password);
    const normEmail = email.trim().toLowerCase();
    const existing = users.find(u => u.email === normEmail && u.role === role);
    if (existing && existing.passwordHash === hash) {
      const loggedIn: User = { id: existing.id, name: existing.name, email: existing.email, role: existing.role, avatar: existing.avatar, provider: existing.provider || 'local', companyName: existing.companyName };
      setUser(loggedIn);
      localStorage.setItem('user', JSON.stringify(loggedIn));
      return true;
    }
    return false;
  };

  // Decode a JWT without verifying signature (for client-only profile extraction)
  const decodeJwt = (token: string): any | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Failed to decode JWT', e);
      return null;
    }
  };

  const loginWithGoogle = async (idToken: string, role: UserRole): Promise<boolean> => {
    const payload = decodeJwt(idToken);
    if (!payload) return false;

    const audOk = import.meta?.env?.VITE_GOOGLE_CLIENT_ID ? payload.aud === import.meta.env.VITE_GOOGLE_CLIENT_ID : true;
    const issOk = payload.iss === 'https://accounts.google.com' || payload.iss === 'accounts.google.com';
    const notExpired = typeof payload.exp === 'number' ? Date.now() < payload.exp * 1000 : true;
    if (!issOk || !notExpired || !audOk) {
      console.warn('Google ID token basic checks failed');
      return false;
    }

    const emailLc = String(payload.email || '').toLowerCase();
    const id = `google:${payload.sub || emailLc}`;
    const profile: StoredUser = {
      id,
      name: payload.name || payload.given_name || (emailLc ? emailLc.split('@')[0] : 'Google User'),
      email: emailLc,
      role,
      avatar: payload.picture,
      provider: 'google',
    };

    // upsert into users (no password)
    setUsers(prev => {
      const idx = prev.findIndex(u => u.email === profile.email);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...profile };
        return copy;
      }
      return [profile, ...prev];
    });

    const loggedIn: User = { id: profile.id, name: profile.name, email: profile.email, role: profile.role, avatar: profile.avatar, provider: 'google' };
    setUser( loggedIn );
    localStorage.setItem('user', JSON.stringify(loggedIn));
    return true;
  };

  const register = async (name: string, email: string, password: string, role: UserRole, companyName?: string): Promise<{ success: boolean; error?: string }> => {
    if (!name || !email || !password) return { success: false, error: 'All fields are required.' };
    if (password.length < 8) return { success: false, error: 'Password must be at least 8 characters.' };
    const normEmail = email.trim().toLowerCase();
    const exists = users.some(u => u.email === normEmail);
    if (exists) return { success: false, error: 'This email is already registered.' };

    const id = Math.random().toString(36).substring(2, 10);
    const passwordHash = await sha256(password);
    const newUser: StoredUser = { id, name, email: normEmail, role, passwordHash, provider: 'local', companyName: companyName?.trim() };
    setUsers(prev => [newUser, ...prev]);

    const loggedIn: User = { id, name, email: normEmail, role, provider: 'local', companyName: companyName?.trim() };
    setUser(loggedIn);
    localStorage.setItem('user', JSON.stringify(loggedIn));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    loginWithGoogle,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};