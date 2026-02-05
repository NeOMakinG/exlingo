import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, GradientCard } from '../../src/components';
import { colors, spacing, fontSize, borderRadius } from '../../src/constants/theme';

export default function MethodScreen() {
  const { t } = useTranslation();

  const steps = [
    { number: 1, emoji: '🔍', text: t('onboarding.method.step1') },
    { number: 2, emoji: '✍️', text: t('onboarding.method.step2') },
    { number: 3, emoji: '🔄', text: t('onboarding.method.step3') },
  ];

  return (
    <LinearGradient
      colors={['#0f0f1a', '#1a1a2e', '#0f0f1a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('onboarding.method.title')}</Text>
            <Text style={styles.subtitle}>{t('onboarding.method.subtitle')}</Text>
          </View>

          <View style={styles.stepsContainer}>
            {steps.map((step, index) => (
              <Animated.View
                key={step.number}
                entering={SlideInRight.delay(300 + index * 150).duration(500).springify()}
              >
                <GradientCard 
                  variant={index === 0 ? 'primary' : 'subtle'} 
                  style={styles.stepCard}
                >
                  <View style={styles.stepContent}>
                    <View style={[
                      styles.stepNumber,
                      index === 0 && styles.stepNumberActive
                    ]}>
                      <Text style={styles.stepNumberText}>{step.number}</Text>
                    </View>
                    <View style={styles.stepTextContainer}>
                      <Text style={styles.stepEmoji}>{step.emoji}</Text>
                      <Text style={styles.stepText}>{step.text}</Text>
                    </View>
                  </View>
                </GradientCard>
              </Animated.View>
            ))}
          </View>
        </View>

        <Animated.View style={styles.footer} entering={FadeIn.delay(800).duration(500)}>
          <View style={styles.pagination}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          <Button
            title={t('common.continue')}
            onPress={() => router.push('/onboarding/language')}
            size="lg"
            fullWidth
          />
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
  },
  header: {
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
  },
  stepsContainer: {
    gap: spacing.md,
  },
  stepCard: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  stepNumberText: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  stepTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stepEmoji: {
    fontSize: 24,
  },
  stepText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.text,
    lineHeight: 22,
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
});
