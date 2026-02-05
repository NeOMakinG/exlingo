import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors, spacing, fontSize, borderRadius } from '../../src/constants/theme';

export default function PhilosophyScreen() {
  const { t } = useTranslation();

  const tips = [
    { emoji: '🎬', text: t('onboarding.philosophy.tip1') },
    { emoji: '📰', text: t('onboarding.philosophy.tip2') },
    { emoji: '👂', text: t('onboarding.philosophy.tip3') },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.illustration}>
          <Text style={styles.emoji}>🔍</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{t('onboarding.philosophy.title')}</Text>
          <Text style={styles.subtitle}>{t('onboarding.philosophy.subtitle')}</Text>
        </View>

        <View style={styles.tipsContainer}>
          {tips.map((tip, index) => (
            <View key={index} style={styles.tipCard}>
              <Text style={styles.tipEmoji}>{tip.emoji}</Text>
              <Text style={styles.tipText}>{tip.text}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <Pressable
          style={styles.button}
          onPress={() => router.push('/onboarding/method')}
        >
          <Text style={styles.buttonText}>{t('common.continue')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  illustration: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emoji: {
    fontSize: 56,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.sm,
  },
  tipsContainer: {
    width: '100%',
    gap: spacing.md,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.md,
  },
  tipEmoji: {
    fontSize: 28,
  },
  tipText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.text,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
});
