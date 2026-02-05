import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../src/store/useStore';
import { getLanguageName } from '../../src/utils/languages';
import { SocialPost, LanguageCode } from '../../src/types';
import { colors, spacing, fontSize, borderRadius } from '../../src/constants/theme';

// Curated social accounts and content for language learning
const SOCIAL_CONTENT: Record<LanguageCode, SocialPost[]> = {
  es: [
    { id: '1', platform: 'instagram', url: 'https://instagram.com/holaespanhol', title: '@holaespanhol', description: 'Daily Spanish vocabulary', language: 'es' },
    { id: '2', platform: 'tiktok', url: 'https://tiktok.com/@spanishwithvicente', title: '@spanishwithvicente', description: 'Fun Spanish lessons', language: 'es' },
    { id: '3', platform: 'twitter', url: 'https://twitter.com/SpanishDict', title: '@SpanishDict', description: 'Word of the day', language: 'es' },
  ],
  fr: [
    { id: '1', platform: 'instagram', url: 'https://instagram.com/frenchwords', title: '@frenchwords', description: 'Beautiful French expressions', language: 'fr' },
    { id: '2', platform: 'tiktok', url: 'https://tiktok.com/@french.mornings', title: '@french.mornings', description: 'Quick French tips', language: 'fr' },
    { id: '3', platform: 'twitter', url: 'https://twitter.com/French_Moments', title: '@French_Moments', description: 'French culture & language', language: 'fr' },
  ],
  de: [
    { id: '1', platform: 'instagram', url: 'https://instagram.com/german.learning', title: '@german.learning', description: 'German vocabulary', language: 'de' },
    { id: '2', platform: 'tiktok', url: 'https://tiktok.com/@germanyinnutshell', title: '@germanyinnutshell', description: 'German culture & words', language: 'de' },
  ],
  ja: [
    { id: '1', platform: 'instagram', url: 'https://instagram.com/japanesepod101', title: '@japanesepod101', description: 'Daily Japanese', language: 'ja' },
    { id: '2', platform: 'tiktok', url: 'https://tiktok.com/@nihongo.learning', title: '@nihongo.learning', description: 'Japanese phrases', language: 'ja' },
  ],
  ko: [
    { id: '1', platform: 'instagram', url: 'https://instagram.com/talktomeinkorean', title: '@talktomeinkorean', description: 'Korean learning', language: 'ko' },
    { id: '2', platform: 'tiktok', url: 'https://tiktok.com/@koreanclass101', title: '@koreanclass101', description: 'Korean tips', language: 'ko' },
  ],
  zh: [
    { id: '1', platform: 'instagram', url: 'https://instagram.com/chineseclass101', title: '@chineseclass101', description: 'Learn Chinese', language: 'zh' },
    { id: '2', platform: 'tiktok', url: 'https://tiktok.com/@mandarin.learning', title: '@mandarin.learning', description: 'Mandarin phrases', language: 'zh' },
  ],
  // Minimal for other languages
  en: [],
  it: [],
  pt: [],
  nl: [],
  ru: [],
  ar: [],
  hi: [],
  tr: [],
  pl: [],
  vi: [],
};

const PLATFORM_ICONS: Record<string, string> = {
  instagram: '📷',
  tiktok: '🎵',
  twitter: '🐦',
  youtube: '▶️',
};

const PLATFORM_COLORS: Record<string, string> = {
  instagram: '#E4405F',
  tiktok: '#000000',
  twitter: '#1DA1F2',
  youtube: '#FF0000',
};

export default function SocialScreen() {
  const { t } = useTranslation();
  const { languageSheets, currentSheetId } = useStore();
  
  const currentSheet = languageSheets.find(s => s.id === currentSheetId);
  const targetLanguage = currentSheet?.targetLanguage;
  
  const posts = targetLanguage ? SOCIAL_CONTENT[targetLanguage] ?? [] : [];

  const handleOpenPost = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('social.title')}</Text>
        {targetLanguage && (
          <Text style={styles.subtitle}>{t('social.subtitle')}</Text>
        )}
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {!targetLanguage ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🌍</Text>
            <Text style={styles.emptyText}>Select a language sheet first</Text>
          </View>
        ) : posts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📱</Text>
            <Text style={styles.emptyText}>{t('social.empty')}</Text>
          </View>
        ) : (
          posts.map((post) => (
            <Pressable
              key={post.id}
              style={styles.postCard}
              onPress={() => handleOpenPost(post.url)}
            >
              <View style={[styles.platformIcon, { backgroundColor: PLATFORM_COLORS[post.platform] || colors.primary }]}>
                <Text style={styles.platformIconText}>{PLATFORM_ICONS[post.platform] || '🔗'}</Text>
              </View>
              <View style={styles.postInfo}>
                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.postDescription}>{post.description}</Text>
                <Text style={styles.platformName}>{post.platform}</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  postCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.md,
  },
  platformIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  platformIconText: {
    fontSize: 20,
  },
  postInfo: {
    flex: 1,
  },
  postTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  postDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  platformName: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textTransform: 'capitalize',
  },
  arrow: {
    fontSize: fontSize.lg,
    color: colors.textMuted,
  },
});
