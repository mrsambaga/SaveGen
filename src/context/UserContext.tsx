import React, { createContext, ReactNode, useContext } from 'react';
import { User } from '../constants/types';
import { updateUser } from '../service/UserService';
import { useAuth } from './AuthContext';

type UserContextProps = {
  user: User | null;
  setUser: (user: User) => void;
  refreshUser: () => Promise<void>;
  updateUserData: (userData: Partial<User>) => Promise<void>;
};

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user, setUser } = useAuth();

  const refreshUser = async () => {

  };

  const updateUserData = async (userData: Partial<User>) => {
    if (!user) return;
    const updated = await updateUser(user.email, userData);
    setUser(updated);
  };

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a User Provider');
  return context;
};
