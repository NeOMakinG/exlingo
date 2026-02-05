# Exlingo 🌐

A proactive language learning app where YOU choose what to learn.

## Philosophy

Traditional language apps feed you random sentences. You forget 90% of them.

LingoNotes is different:
- **You** find sentences in movies, songs, books, conversations
- **You** add them with translations
- **You** review at your own pace

Sentences you choose stick. That's the proactive method.

## Features

### Free
- 📝 Add unlimited sentences with translations
- 🔊 Listen to pronunciation (native TTS)
- 🔍 Search your sentence collection
- 📚 One sheet per language you're learning
- 🎬 Curated YouTube channels for learning
- 📱 Social accounts to follow

### Premium
- 🤖 AI-powered translations (OpenAI)
- ☁️ Cloud sync across devices
- 🔐 Google & Apple Sign In

## Tech Stack

### Mobile App (Expo)
- React Native with Expo SDK 54
- expo-router for navigation
- Zustand for state management
- i18next for internationalization
- expo-speech for text-to-speech

### Backend (Hono)
- Hono framework (fast, lightweight)
- JWT authentication
- OpenAI for translations
- Deployable to Railway

## Getting Started

### Prerequisites
- Node.js 20+
- iOS Simulator or Android Emulator (or physical device)

### Mobile App

```bash
cd app
npm install
npx expo start
```

Scan the QR code with Expo Go app or press `i` for iOS simulator.

### Backend

```bash
cd api
npm install
npm run dev
```

API runs on `http://localhost:3000`

### Environment Variables

**API** (create `.env`):
```
JWT_SECRET=your-secure-secret-key
OPENAI_API_KEY=sk-...
```

**App** (create `.env`):
```
EXPO_PUBLIC_API_URL=http://localhost:3000
```

## Deployment

### Railway (Backend)
1. Connect your repo to Railway
2. Set environment variables
3. Deploy!

The `railway.json` config is included.

### App Stores
```bash
cd app
eas build --platform ios
eas build --platform android
eas submit
```

## Project Structure

```
lingo-notes/
├── app/                    # Expo mobile app
│   ├── app/                # expo-router pages
│   │   ├── (tabs)/         # Main tab screens
│   │   └── onboarding/     # Onboarding flow
│   └── src/
│       ├── components/     # Reusable components
│       ├── constants/      # Theme, config
│       ├── hooks/          # Custom hooks
│       ├── i18n/           # Translations
│       ├── services/       # API calls
│       ├── store/          # Zustand store
│       ├── types/          # TypeScript types
│       └── utils/          # Helpers
│
└── api/                    # Hono backend
    └── src/
        ├── middleware/     # Auth, subscription checks
        ├── routes/         # API endpoints
        └── services/       # Business logic
```

## Adding a New Language

1. Add translations to `app/src/i18n/translations/[lang].json`
2. Add language to `SUPPORTED_LANGUAGES` in `utils/languages.ts`
3. Add example sentences to `utils/exampleSentences.ts`
4. Add YouTube channels to `(tabs)/youtube.tsx`
5. Add social accounts to `(tabs)/social.tsx`

## License

MIT
