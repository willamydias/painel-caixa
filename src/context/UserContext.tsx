'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfileDB } from '@/lib/db';

interface UserContextType {
  currentUser: UserProfileDB;
  allUsers: UserProfileDB[];
  isAuthenticated: boolean;
  isAuthLoaded: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  switchUser: (userId: string) => void;
  updateUserProfile: (data: Partial<UserProfileDB>) => Promise<boolean>;
  addUserProfile: (data: Omit<UserProfileDB, 'created_at'>) => Promise<boolean>;
  isDbConnected: boolean;
  isAdmin: boolean;
  isInvestor: boolean;
  isAnalyst: boolean;
}

const defaultUsers: UserProfileDB[] = [
  {
    id: 'usr_willamy',
    full_name: 'Willamy Mamede',
    email: 'willamy.dias@gmail.com',
    phone: '(61) 98156-2715',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    created_at: new Date().toISOString(),
  },
  {
    id: 'usr_wagner',
    full_name: 'Wagner Junior',
    email: 'wagner.investor@gmail.com',
    phone: '(61) 99234-5678',
    role: 'investor',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    created_at: new Date().toISOString(),
  },
  {
    id: 'usr_ana',
    full_name: 'Dra. Ana Paula',
    email: 'ana.juridico@gmail.com',
    phone: '(61) 98877-6655',
    role: 'analyst',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    created_at: new Date().toISOString(),
  },
];

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [allUsers, setAllUsers] = useState<UserProfileDB[]>(defaultUsers);
  const [currentUser, setCurrentUser] = useState<UserProfileDB>(defaultUsers[0]);
  
  // Inicialização síncrona do estado de autenticação para evitar o loop de redirecionamento
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('caixa_is_authenticated') === 'true';
    }
    return false;
  });
  
  const [isAuthLoaded, setIsAuthLoaded] = useState<boolean>(false);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(true);

  // Garantir a restauração consistente da sessão e do usuário no cliente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('caixa_is_authenticated') === 'true';
      setIsAuthenticated(auth);

      const savedId = localStorage.getItem('caixa_active_user_id');
      if (savedId) {
        const found = allUsers.find((u) => u.id === savedId);
        if (found) setCurrentUser(found);
      }
      setIsAuthLoaded(true);
    }
  }, []);

  // Carregar lista de usuários do banco ao inicializar
  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch('/api/users');
        if (res.ok) {
          const data = await res.json();
          if (data.users && Array.isArray(data.users) && data.users.length > 0) {
            setAllUsers(data.users);
            setIsDbConnected(data.isDbSynced ?? true);
            const savedId = localStorage.getItem('caixa_active_user_id');
            const found = data.users.find((u: UserProfileDB) => u.id === savedId) || data.users[0];
            setCurrentUser(found);
          }
        }
      } catch (err) {
        console.warn('Fallback ativado no UserContext:', err);
      }
    }
    loadUsers();
  }, []);

  const login = async (emailInput: string, passInput: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = emailInput.trim().toLowerCase();
    const target = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!target) {
      return { success: false, error: 'E-mail de investidor não encontrado.' };
    }

    if (!passInput || passInput.length < 3) {
      return { success: false, error: 'Senha inválida.' };
    }

    // Gravação síncrona de sessão no localStorage e estado
    if (typeof window !== 'undefined') {
      localStorage.setItem('caixa_is_authenticated', 'true');
      localStorage.setItem('caixa_active_user_id', target.id);
    }
    setCurrentUser(target);
    setIsAuthenticated(true);
    setIsAuthLoaded(true);

    return { success: true };
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('caixa_is_authenticated', 'true');
      localStorage.setItem('caixa_active_user_id', allUsers[0].id);
    }
    setCurrentUser(allUsers[0]);
    setIsAuthenticated(true);
    setIsAuthLoaded(true);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('caixa_is_authenticated');
      localStorage.removeItem('caixa_active_user_id');
      window.location.href = '/login';
    }
  };

  const switchUser = (userId: string) => {
    const target = allUsers.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      if (typeof window !== 'undefined') {
        localStorage.setItem('caixa_active_user_id', target.id);
      }
    }
  };

  const updateUserProfile = async (data: Partial<UserProfileDB>): Promise<boolean> => {
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setAllUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const addUserProfile = async (data: Omit<UserProfileDB, 'created_at'>): Promise<boolean> => {
    const newUser: UserProfileDB = {
      ...data,
      created_at: new Date().toISOString(),
    };
    setAllUsers((prev) => [...prev, newUser]);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        allUsers,
        isAuthenticated,
        isAuthLoaded,
        login,
        loginWithGoogle,
        logout,
        switchUser,
        updateUserProfile,
        addUserProfile,
        isDbConnected,
        isAdmin: currentUser.role === 'admin',
        isInvestor: currentUser.role === 'investor',
        isAnalyst: currentUser.role === 'analyst',
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
}
