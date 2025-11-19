import React, { createContext, useState, useContext, ReactNode } from 'react';
import { authService } from '../services/authService';
interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const rs = await authService.handleLogin(email, password);
      setUser({
        id: Date.now().toString(),
        email,
        username: rs.user.username,
        displayName: rs.user.displayName,
        avatarUrl: rs.user.avatarUrl,
        coverUrl: rs.user.coverUrl,
        bio: rs.user.bio || 'Chào mừng bạn đến với PinYourWord! 🚀',
      });       
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string, displayName: string) => {
    setIsLoading(true);
    try {
      const rs = await authService.handleRegister(email, password, username, displayName);
      setUser({
        id: Date.now().toString(),
        email,
        username,
        displayName: username.charAt(0).toUpperCase() + username.slice(1),
        avatarUrl: `https://i.pravatar.cc/150?u=${username}`,
        bio: 'Người dùng mới của PinYourWord 🎉',
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Mock social login
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        id: 'google_' + Date.now(),
        email: 'user@gmail.com',
        username: 'googleuser',
        displayName: 'Google User',
        avatarUrl: 'https://i.pravatar.cc/150?u=google',
        bio: 'Đăng nhập qua Google 📧',
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithApple = async () => {
    setIsLoading(true);
    try {
      // Mock social login
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        id: 'apple_' + Date.now(),
        email: 'user@icloud.com',
        username: 'appleuser',
        displayName: 'Apple User',
        avatarUrl: 'https://i.pravatar.cc/150?u=apple',
        bio: 'Đăng nhập qua Apple 🍎',
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        loginWithGoogle,
        loginWithApple,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
