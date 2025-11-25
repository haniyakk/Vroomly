import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../backend/supabaseClient';
import { Screen, Role, User, Notification } from '../types';

interface AppContextType {
  screen: Screen;
  setScreen: (screen: Screen) => void;
  role: Role | null;
  setRole: (role: Role | null) => void;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [screen, setScreen] = useState<Screen>(Screen.SPLASH);
  const [role, setRole] = useState<Role | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const login = (userData: User) => {
    const formatDisplayName = (u: User) => {
      try {
        if (u.role === 'Driver') {
          const current = u.fullName || '';
          if (/^Mr\.\s+/i.test(current)) return u;
          return { ...u, fullName: `Mr. ${current}` };
        }
      } catch (e) {
        // fallback to original
      }
      return u;
    };

    const formatted = formatDisplayName(userData);
    setUser(formatted);
    setRole(formatted.role);
    setScreen(Screen.DASHBOARD);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setScreen(Screen.LAUNCH);
  };

  // Listen for Supabase auth events (e.g. password recovery link clicks)
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setScreen(Screen.RESET_PASSWORD);
      }

      // keep basic sign-out handling so the app state stays in sync
      if (event === 'SIGNED_OUT') {
        logout();
      }
    });

    return () => {
      // unsubscribe if available
      try {
        // listener may be undefined in some runtimes
        // @ts-ignore
        listener?.subscription?.unsubscribe?.();
      } catch (e) {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification = { ...notification, id: Date.now() };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(note => note.id !== id));
  };

  const value = { screen, setScreen, role, setRole, user, login, logout, notifications, addNotification, removeNotification };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};