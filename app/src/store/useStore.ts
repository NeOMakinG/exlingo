import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LanguageSheet, Sentence, LanguageCode } from '../types';

interface AppStore {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  
  // Onboarding
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  
  // Language sheets
  languageSheets: LanguageSheet[];
  currentSheetId: string | null;
  
  // Sheet actions
  createSheet: (targetLanguage: LanguageCode) => string;
  deleteSheet: (sheetId: string) => void;
  setCurrentSheet: (sheetId: string | null) => void;
  getCurrentSheet: () => LanguageSheet | undefined;
  
  // Sentence actions
  addSentence: (sheetId: string, sentence: Omit<Sentence, 'id' | 'createdAt' | 'updatedAt' | 'reviewCount'>) => void;
  updateSentence: (sheetId: string, sentenceId: string, updates: Partial<Sentence>) => void;
  deleteSentence: (sheetId: string, sentenceId: string) => void;
  
  // Utility
  reset: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      hasCompletedOnboarding: false,
      languageSheets: [],
      currentSheetId: null,
      
      // User actions
      setUser: (user) => set({ user }),
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),
      
      // Onboarding
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      
      // Sheet actions
      createSheet: (targetLanguage) => {
        const id = generateId();
        const now = Date.now();
        const newSheet: LanguageSheet = {
          id,
          targetLanguage,
          sentences: [],
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          languageSheets: [...state.languageSheets, newSheet],
          currentSheetId: id,
        }));
        return id;
      },
      
      deleteSheet: (sheetId) => set((state) => ({
        languageSheets: state.languageSheets.filter(s => s.id !== sheetId),
        currentSheetId: state.currentSheetId === sheetId ? null : state.currentSheetId,
      })),
      
      setCurrentSheet: (sheetId) => set({ currentSheetId: sheetId }),
      
      getCurrentSheet: () => {
        const { languageSheets, currentSheetId } = get();
        return languageSheets.find(s => s.id === currentSheetId);
      },
      
      // Sentence actions
      addSentence: (sheetId, sentenceData) => {
        const now = Date.now();
        const sentence: Sentence = {
          ...sentenceData,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
          reviewCount: 0,
        };
        set((state) => ({
          languageSheets: state.languageSheets.map(sheet =>
            sheet.id === sheetId
              ? { ...sheet, sentences: [...sheet.sentences, sentence], updatedAt: now }
              : sheet
          ),
        }));
      },
      
      updateSentence: (sheetId, sentenceId, updates) => {
        const now = Date.now();
        set((state) => ({
          languageSheets: state.languageSheets.map(sheet =>
            sheet.id === sheetId
              ? {
                  ...sheet,
                  sentences: sheet.sentences.map(s =>
                    s.id === sentenceId ? { ...s, ...updates, updatedAt: now } : s
                  ),
                  updatedAt: now,
                }
              : sheet
          ),
        }));
      },
      
      deleteSentence: (sheetId, sentenceId) => {
        const now = Date.now();
        set((state) => ({
          languageSheets: state.languageSheets.map(sheet =>
            sheet.id === sheetId
              ? {
                  ...sheet,
                  sentences: sheet.sentences.filter(s => s.id !== sentenceId),
                  updatedAt: now,
                }
              : sheet
          ),
        }));
      },
      
      // Reset
      reset: () => set({
        user: null,
        hasCompletedOnboarding: false,
        languageSheets: [],
        currentSheetId: null,
      }),
    }),
    {
      name: 'lingo-notes-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
