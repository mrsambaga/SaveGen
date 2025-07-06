import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User } from '../constants/types';
import { fetchUser, updateUser } from '../service/UserService';

type UserContextProps = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  refreshUser: () => Promise<void>;
  updateUserData: (userData: Partial<User>) => Promise<void>;
};

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const refreshUser = async () => {
    const fetched = await fetchUser('sam@gmail.com');
    setUser(fetched);
  };

  const updateUserData = async (userData: Partial<User>) => {
    if (!user) return;
    const updated = await updateUser(user.email, userData);
    setUser(updated);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, refreshUser, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a User Provider');
  return context;
};
