import { LanguageCode } from '../types';

interface ExampleSentence {
  original: string;
  translations: Partial<Record<LanguageCode, string>>;
}

// Common useful sentences with translations
export const EXAMPLE_SENTENCES: Record<LanguageCode, ExampleSentence[]> = {
  es: [
    {
      original: '¿Podrías hablar más despacio, por favor?',
      translations: {
        en: 'Could you speak more slowly, please?',
        fr: 'Pourriez-vous parler plus lentement, s\'il vous plaît ?',
      },
    },
    {
      original: 'No entiendo, ¿me lo puedes explicar de otra manera?',
      translations: {
        en: 'I don\'t understand, can you explain it another way?',
        fr: 'Je ne comprends pas, pouvez-vous l\'expliquer autrement ?',
      },
    },
    {
      original: '¿Qué significa esta palabra?',
      translations: {
        en: 'What does this word mean?',
        fr: 'Que signifie ce mot ?',
      },
    },
  ],
  fr: [
    {
      original: 'Ça ne me dit rien.',
      translations: {
        en: 'That doesn\'t ring a bell. / I\'m not interested.',
        es: 'No me suena. / No me apetece.',
      },
    },
    {
      original: 'J\'ai eu un coup de foudre.',
      translations: {
        en: 'I fell in love at first sight.',
        es: 'Fue amor a primera vista.',
      },
    },
    {
      original: 'C\'est pas la mer à boire.',
      translations: {
        en: 'It\'s not that hard. (lit. It\'s not the sea to drink)',
        es: 'No es para tanto.',
      },
    },
  ],
  de: [
    {
      original: 'Das ist mir Wurst.',
      translations: {
        en: 'I don\'t care. (lit. That\'s sausage to me)',
        fr: 'Ça m\'est égal.',
      },
    },
    {
      original: 'Ich verstehe nur Bahnhof.',
      translations: {
        en: 'I don\'t understand anything. (lit. I only understand train station)',
        fr: 'Je n\'y comprends rien.',
      },
    },
    {
      original: 'Da liegt der Hund begraben.',
      translations: {
        en: 'That\'s the crux of the matter. (lit. That\'s where the dog is buried)',
        fr: 'C\'est là le problème.',
      },
    },
  ],
  it: [
    {
      original: 'In bocca al lupo!',
      translations: {
        en: 'Good luck! (lit. In the mouth of the wolf)',
        fr: 'Bonne chance !',
      },
    },
    {
      original: 'Non vedo l\'ora!',
      translations: {
        en: 'I can\'t wait!',
        fr: 'J\'ai hâte !',
      },
    },
    {
      original: 'Meglio tardi che mai.',
      translations: {
        en: 'Better late than never.',
        fr: 'Mieux vaut tard que jamais.',
      },
    },
  ],
  ja: [
    {
      original: 'お疲れ様です。',
      translations: {
        en: 'Thank you for your hard work. (greeting)',
        fr: 'Merci pour votre travail.',
      },
    },
    {
      original: 'しょうがない。',
      translations: {
        en: 'It can\'t be helped. / Oh well.',
        fr: 'On n\'y peut rien.',
      },
    },
    {
      original: 'よろしくお願いします。',
      translations: {
        en: 'Please treat me well. / Nice to meet you.',
        fr: 'Je compte sur vous. / Enchanté.',
      },
    },
  ],
  ko: [
    {
      original: '화이팅!',
      translations: {
        en: 'Fighting! / You can do it!',
        fr: 'Courage ! / Tu peux le faire !',
      },
    },
    {
      original: '눈치 없다.',
      translations: {
        en: 'You\'re oblivious. / You can\'t read the room.',
        fr: 'Tu ne comprends pas la situation.',
      },
    },
    {
      original: '밥 먹었어요?',
      translations: {
        en: 'Have you eaten? (common greeting)',
        fr: 'Tu as mangé ? (salutation courante)',
      },
    },
  ],
  zh: [
    {
      original: '加油！',
      translations: {
        en: 'Keep going! / You can do it!',
        fr: 'Courage ! / Tu peux le faire !',
      },
    },
    {
      original: '慢走。',
      translations: {
        en: 'Take care. (when someone leaves)',
        fr: 'Faites attention. (quand quelqu\'un part)',
      },
    },
    {
      original: '没关系。',
      translations: {
        en: 'It\'s okay. / No problem.',
        fr: 'Ce n\'est rien. / Pas de problème.',
      },
    },
  ],
  pt: [
    {
      original: 'Tudo bem?',
      translations: {
        en: 'How are you? / Is everything okay?',
        fr: 'Comment ça va ? / Tout va bien ?',
      },
    },
    {
      original: 'Fica à vontade.',
      translations: {
        en: 'Make yourself at home.',
        fr: 'Fais comme chez toi.',
      },
    },
    {
      original: 'Não esquenta!',
      translations: {
        en: 'Don\'t worry about it!',
        fr: 'Ne t\'en fais pas !',
      },
    },
  ],
  // Add minimal entries for other languages
  en: [],
  nl: [],
  ru: [],
  ar: [],
  hi: [],
  tr: [],
  pl: [],
  vi: [],
};

export const getExampleSentences = (
  targetLanguage: LanguageCode,
  nativeLanguage: LanguageCode
) => {
  const examples = EXAMPLE_SENTENCES[targetLanguage] ?? [];
  return examples.map(ex => ({
    original: ex.original,
    translation: ex.translations[nativeLanguage] ?? ex.translations.en ?? '',
  }));
};
