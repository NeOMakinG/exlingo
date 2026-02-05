import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

let authToken: string | null = null;

// Initialize token from secure storage
export const initAuth = async () => {
  try {
    authToken = await SecureStore.getItemAsync('authToken');
  } catch (error) {
    console.error('Failed to load auth token:', error);
  }
};

// Set auth token
export const setAuthToken = async (token: string | null) => {
  authToken = token;
  try {
    if (token) {
      await SecureStore.setItemAsync('authToken', token);
    } else {
      await SecureStore.deleteItemAsync('authToken');
    }
  } catch (error) {
    console.error('Failed to save auth token:', error);
  }
};

// Generic API request
const request = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }
  
  return response.json();
};

// Auth endpoints
export const auth = {
  signInWithGoogle: (idToken: string) =>
    request<{ token: string; user: any }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    }),
    
  signInWithApple: (idToken: string, user?: any) =>
    request<{ token: string; user: any }>('/auth/apple', {
      method: 'POST',
      body: JSON.stringify({ idToken, user }),
    }),
    
  verify: () => request<{ valid: boolean; user: any }>('/auth/verify'),
};

// Translation endpoints (Premium)
export const translate = {
  text: (text: string, from: string, to: string) =>
    request<{ translation: string }>('/translate', {
      method: 'POST',
      body: JSON.stringify({ text, from, to }),
    }),
    
  suggest: (sentence: string, targetLanguage: string) =>
    request<{
      translation: string;
      grammarNote: string;
      similarSentences: string[];
    }>('/translate/suggest', {
      method: 'POST',
      body: JSON.stringify({ sentence, targetLanguage }),
    }),
};

// Sync endpoints (Premium)
export const sync = {
  get: () => request<{ data: any; lastSync: number }>('/sync'),
  
  push: (data: { languageSheets: any[]; settings: any; lastLocalUpdate: number }) =>
    request<{ success: boolean; data: any; conflict?: boolean }>('/sync', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  delete: () => request<{ success: boolean }>('/sync', { method: 'DELETE' }),
};

// Subscription endpoints
export const subscription = {
  status: () =>
    request<{ status: 'free' | 'premium'; expiresAt?: number }>('/subscription'),
    
  verify: (platform: 'ios' | 'android', receipt: string, productId: string) =>
    request<{ success: boolean; subscription: any }>('/subscription/verify', {
      method: 'POST',
      body: JSON.stringify({ platform, receipt, productId }),
    }),
};
