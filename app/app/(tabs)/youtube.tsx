import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../src/store/useStore';
import { getLanguageName, getLanguageFlag } from '../../src/utils/languages';
import { YouTubeChannel, LanguageCode } from '../../src/types';
import { colors, spacing, fontSize, borderRadius } from '../../src/constants/theme';

// Curated YouTube channels for language learning
const YOUTUBE_CHANNELS: Record<LanguageCode, YouTubeChannel[]> = {
  es: [
    { id: '1', name: 'Dreaming Spanish', url: 'https://youtube.com/@DreamingSpanish', description: 'Comprehensible input for all levels', language: 'es' },
    { id: '2', name: 'SpanishPod101', url: 'https://youtube.com/@spanishpod101', description: 'Lessons from beginner to advanced', language: 'es' },
    { id: '3', name: 'Why Not Spanish?', url: 'https://youtube.com/@WhyNotSpanish', description: 'Colombian Spanish with cultural insights', language: 'es' },
  ],
  fr: [
    { id: '1', name: 'Français Authentique', url: 'https://youtube.com/@francaisauthentique', description: 'Natural French speaking practice', language: 'fr' },
    { id: '2', name: 'InnerFrench', url: 'https://youtube.com/@innerFrench', description: 'Intermediate French podcast style', language: 'fr' },
    { id: '3', name: 'Piece of French', url: 'https://youtube.com/@pieceoffrench', description: 'French culture and language', language: 'fr' },
  ],
  de: [
    { id: '1', name: 'Easy German', url: 'https://youtube.com/@EasyGerman', description: 'Street interviews with subtitles', language: 'de' },
    { id: '2', name: 'Learn German with Anja', url: 'https://youtube.com/@LearnGermanwithAnja', description: 'Fun lessons with native speaker', language: 'de' },
    { id: '3', name: 'Deutsch für Euch', url: 'https://youtube.com/@DeutschFuerEuch', description: 'German grammar explained clearly', language: 'de' },
  ],
  ja: [
    { id: '1', name: 'Japanese Ammo with Misa', url: 'https://youtube.com/@JapaneseAmmowithMisa', description: 'Grammar and conversation', language: 'ja' },
    { id: '2', name: 'Comprehensible Japanese', url: 'https://youtube.com/@ComprehensibleJapanese', description: 'Stories for learners', language: 'ja' },
    { id: '3', name: 'Nihongo no Mori', url: 'https://youtube.com/@nihaboreal', description: 'JLPT preparation', language: 'ja' },
  ],
  ko: [
    { id: '1', name: 'Talk To Me In Korean', url: 'https://youtube.com/@talktomeinkorean', description: 'Popular Korean learning channel', language: 'ko' },
    { id: '2', name: 'Korean Unnie', url: 'https://youtube.com/@koreanunnie', description: 'Practical Korean phrases', language: 'ko' },
    { id: '3', name: 'GO! Billy Korean', url: 'https://youtube.com/@GoBillyKorean', description: 'Grammar and vocabulary', language: 'ko' },
  ],
  zh: [
    { id: '1', name: 'ChinesePod', url: 'https://youtube.com/@ChinesePod', description: 'Structured Chinese lessons', language: 'zh' },
    { id: '2', name: 'Mandarin Corner', url: 'https://youtube.com/@MandarinCorner', description: 'Real Chinese conversations', language: 'zh' },
    { id: '3', name: 'Yoyo Chinese', url: 'https://youtube.com/@yoyochinese', description: 'Clear pronunciation guides', language: 'zh' },
  ],
  it: [
    { id: '1', name: 'Learn Italian with Lucrezia', url: 'https://youtube.com/@lucreziaoddone', description: 'Italian lessons and vlogs', language: 'it' },
    { id: '2', name: 'Italy Made Easy', url: 'https://youtube.com/@ItalyMadeEasy', description: 'Grammar and culture', language: 'it' },
  ],
  pt: [
    { id: '1', name: 'Speaking Brazilian', url: 'https://youtube.com/@SpeakingBrazilian', description: 'Brazilian Portuguese lessons', language: 'pt' },
    { id: '2', name: 'Portuguese With Leo', url: 'https://youtube.com/@PortugueseWithLeo', description: 'European Portuguese', language: 'pt' },
  ],
  // Minimal for other languages
  en: [],
  nl: [],
  ru: [],
  ar: [],
  hi: [],
  tr: [],
  pl: [],
  vi: [],
};

export default function YouTubeScreen() {
  const { t } = useTranslation();
  const { languageSheets, currentSheetId } = useStore();
  
  const currentSheet = languageSheets.find(s => s.id === currentSheetId);
  const targetLanguage = currentSheet?.targetLanguage;
  
  const channels = targetLanguage ? YOUTUBE_CHANNELS[targetLanguage] ?? [] : [];

  const handleOpenChannel = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('youtube.title')}</Text>
        {targetLanguage && (
          <Text style={styles.subtitle}>
            {t('youtube.subtitle', { language: getLanguageName(targetLanguage) })}
          </Text>
        )}
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {!targetLanguage ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🌍</Text>
            <Text style={styles.emptyText}>Select a language sheet first</Text>
          </View>
        ) : channels.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📺</Text>
            <Text style={styles.emptyText}>{t('youtube.empty')}</Text>
          </View>
        ) : (
          channels.map((channel) => (
            <Pressable
              key={channel.id}
              style={styles.channelCard}
              onPress={() => handleOpenChannel(channel.url)}
            >
              <View style={styles.channelIcon}>
                <Text style={styles.channelIconText}>▶️</Text>
              </View>
              <View style={styles.channelInfo}>
                <Text style={styles.channelName}>{channel.name}</Text>
                <Text style={styles.channelDescription}>{channel.description}</Text>
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
  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.md,
  },
  channelIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  channelIconText: {
    fontSize: 20,
  },
  channelInfo: {
    flex: 1,
  },
  channelName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  channelDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  arrow: {
    fontSize: fontSize.lg,
    color: colors.textMuted,
  },
});
