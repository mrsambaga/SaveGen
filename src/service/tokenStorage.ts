import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'savegen.authToken';
const GUEST_CREDENTIALS_KEY = 'savegen.guestCredentials';

export type GuestCredentials = {
  email: string;
  password: string;
};

export const tokenStorage = {
  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(TOKEN_KEY);
  },
  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },
  async clearToken(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);
  },

  async getGuestCredentials(): Promise<GuestCredentials | null> {
    const raw = await AsyncStorage.getItem(GUEST_CREDENTIALS_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as GuestCredentials;
    } catch {
      return null;
    }
  },
  async setGuestCredentials(creds: GuestCredentials): Promise<void> {
    await AsyncStorage.setItem(GUEST_CREDENTIALS_KEY, JSON.stringify(creds));
  },
  async clearGuestCredentials(): Promise<void> {
    await AsyncStorage.removeItem(GUEST_CREDENTIALS_KEY);
  },

  async clearAll(): Promise<void> {
    await Promise.all([
      AsyncStorage.removeItem(TOKEN_KEY),
      AsyncStorage.removeItem(GUEST_CREDENTIALS_KEY),
    ]);
  },
};
