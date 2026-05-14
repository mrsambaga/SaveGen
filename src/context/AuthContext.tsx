import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import uuid from 'react-native-uuid';
import { User } from '../constants/types';
import {
  fetchCurrentUser,
  login as apiLogin,
  loginAsGuest as apiGuestLogin,
  loginWithGoogle as apiGoogleLogin,
  register as apiRegister,
} from '../service/AuthService';
import { setUnauthorizedHandler } from '../service/apiClient';
import { tokenStorage } from '../service/tokenStorage';

export type AuthStatus = 'loading' | 'unauthenticated' | 'authenticated';

type AuthContextValue = {
  status: AuthStatus;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signInWithGoogle: (idToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const generateGuestCredentials = () => {
  const id = String(uuid.v4()).replace(/-/g, '');
  const email = `guest_${id}@savegen.local`;
  const password =
    String(uuid.v4()).replace(/-/g, '') +
    String(uuid.v4()).replace(/-/g, '');
  return { email, password };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUserState] = useState<User | null>(null);

  const signOut = useCallback(async () => {
    await tokenStorage.clearAll();
    setUserState(null);
    setStatus('unauthenticated');
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUserState(null);
      setStatus('unauthenticated');
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const bootstrap = async () => {
      try {
        const token = await tokenStorage.getToken();
        if (!token) {
          if (!cancelled) setStatus('unauthenticated');
          return;
        }
        const me = await fetchCurrentUser();
        if (cancelled) return;
        setUserState(me);
        setStatus('authenticated');
      } catch {
        if (cancelled) return;
        await tokenStorage.clearAll();
        setUserState(null);
        setStatus('unauthenticated');
      }
    };
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    await tokenStorage.setToken(res.token);
    setUserState(res.user);
    setStatus('authenticated');
  }, []);

  const signUp = useCallback(
    async (username: string, email: string, password: string) => {
      const res = await apiRegister(username, email, password);
      await tokenStorage.setToken(res.token);
      setUserState(res.user);
      setStatus('authenticated');
    },
    [],
  );

  const signInAsGuest = useCallback(async () => {
    const existing = await tokenStorage.getGuestCredentials();
    const creds = existing ?? generateGuestCredentials();

    const res = await apiGuestLogin('Guest', creds.email, creds.password);
    await tokenStorage.setToken(res.token);
    if (!existing) {
      await tokenStorage.setGuestCredentials(creds);
    }
    setUserState(res.user);
    setStatus('authenticated');
  }, []);

  const signInWithGoogle = useCallback(async (idToken: string) => {
    const res = await apiGoogleLogin(idToken);
    await tokenStorage.setToken(res.token);
    setUserState(res.user);
    setStatus('authenticated');
  }, []);

  const setUser = useCallback((next: User) => {
    setUserState(next);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      signIn,
      signUp,
      signInAsGuest,
      signInWithGoogle,
      signOut,
      setUser,
    }),
    [status, user, signIn, signUp, signInAsGuest, signInWithGoogle, signOut, setUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
