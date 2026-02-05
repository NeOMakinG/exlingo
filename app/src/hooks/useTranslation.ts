import { useMutation } from '@tanstack/react-query';
import { translate } from '../services/api';

export const useAITranslate = () => {
  return useMutation({
    mutationFn: ({ text, from, to }: { text: string; from: string; to: string }) =>
      translate.text(text, from, to),
  });
};

export const useTranslationSuggestions = () => {
  return useMutation({
    mutationFn: ({ sentence, targetLanguage }: { sentence: string; targetLanguage: string }) =>
      translate.suggest(sentence, targetLanguage),
  });
};
