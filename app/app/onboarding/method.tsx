import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors, spacing, fontSize, borderRadius } from '../../src/constants/theme';

export default function MethodScreen() {
  const { t } = useTranslation();

  const steps = [
    { number: '1', text: t('onboarding.method.step1'), emoji: '🌍' },
    { number: '2', text: t('onboarding.method.step2'), emoji: '✍️' },
    { number: '3', text: t('onboarding.method.step3'), emoji: '🔄' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.illustration}>
          <Text style={styles.emoji}>🧠</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{t('onboarding.method.title')}</Text>
          <Text style={styles.subtitle}>{t('onboarding.method.subtitle')}</Text>
        </View>

        <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepCard}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{step.number}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepText}>{step.text}</Text>
              </View>
              <Text style={styles.stepEmoji}>{step.emoji}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <Pressable
          style={styles.button}
          onPress={() => router.push('/onboarding/language')}
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
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emoji: {
    fontSize: 48,
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
  stepsContainer: {
    width: '100%',
    gap: spacing.md,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.md,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: fontSize.md,
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    fontSize: fontSize.sm,
    color: colors.text,
    lineHeight: 20,
  },
  stepEmoji: {
    fontSize: 24,
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
