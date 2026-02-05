import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../src/store/useStore';
import { colors, spacing, fontSize, borderRadius } from '../../src/constants/theme';

export default function ReadyScreen() {
  const { t } = useTranslation();
  const completeOnboarding = useStore((s) => s.completeOnboarding);

  const handleStart = () => {
    completeOnboarding();
    router.replace('/(tabs)/sentences');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.illustration}>
          <Text style={styles.emoji}>🚀</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{t('onboarding.ready.title')}</Text>
          <Text style={styles.subtitle}>{t('onboarding.ready.subtitle')}</Text>
        </View>

        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>📝</Text>
            <Text style={styles.featureText}>Add sentences from movies, books, songs</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🔊</Text>
            <Text style={styles.featureText}>Listen to pronunciation</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🎯</Text>
            <Text style={styles.featureText}>Review at your own pace</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
        </View>

        <Pressable style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>{t('onboarding.ready.button')}</Text>
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
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  emoji: {
    fontSize: 64,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxl,
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
    paddingHorizontal: spacing.md,
  },
  features: {
    width: '100%',
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.md,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.text,
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
