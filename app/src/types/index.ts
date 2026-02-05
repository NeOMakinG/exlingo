// Language codes
export type LanguageCode = 
  | 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'nl' | 'ru' 
  | 'zh' | 'ja' | 'ko' | 'ar' | 'hi' | 'tr' | 'pl' | 'vi';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export interface Sentence {
  id: string;
  original: string;
  translation: string;
  targetLanguage: LanguageCode;
  sourceLanguage: LanguageCode;
  notes?: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
  reviewCount: number;
  lastReviewedAt?: number;
  aiGenerated?: boolean;
}

export interface LanguageSheet {
  id: string;
  targetLanguage: LanguageCode;
  sentences: Sentence[];
  createdAt: number;
  updatedAt: number;
}

export interface YouTubeChannel {
  id: string;
  name: string;
  url: string;
  description: string;
  language: LanguageCode;
  thumbnailUrl?: string;
}

export interface SocialPost {
  id: string;
  platform: 'twitter' | 'instagram' | 'tiktok' | 'youtube';
  url: string;
  title: string;
  description?: string;
  language: LanguageCode;
  thumbnailUrl?: string;
}

export interface User {
  id: string;
  email: string;
  nativeLanguage: LanguageCode;
  hasCompletedOnboarding: boolean;
  subscriptionStatus: 'free' | 'premium';
  subscriptionExpiresAt?: number;
  createdAt: number;
}

export interface AppState {
  user: User | null;
  languageSheets: LanguageSheet[];
  currentSheetId: string | null;
  isLoading: boolean;
}
