import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, GradientCard } from '../../src/components';
import { colors, spacing, fontSize, borderRadius } from '../../src/constants/theme';

export default function PhilosophyScreen() {
  const { t } = useTranslation();

  const tips = [
    { emoji: '🎬', text: t('onboarding.philosophy.tip1') },
    { emoji: '📰', text: t('onboarding.philosophy.tip2') },
    { emoji: '🎧', text: t('onboarding.philosophy.tip3') },
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
          <Animated.View 
            style={styles.illustrationWrapper} 
            entering={ZoomIn.delay(200).duration(600).springify()}
          >
            <View style={styles.illustration}>
              <Text style={styles.emoji}>🌟</Text>
            </View>
          </Animated.View>

          <Animated.Text 
            style={styles.title} 
            entering={FadeInUp.delay(300).duration(500)}
          >
            {t('onboarding.philosophy.title')}
          </Animated.Text>
          
          <Animated.Text 
            style={styles.subtitle}
            entering={FadeInUp.delay(400).duration(500)}
          >
            {t('onboarding.philosophy.subtitle')}
          </Animated.Text>

          <View style={styles.tipsContainer}>
            {tips.map((tip, index) => (
              <Animated.View
                key={index}
                entering={FadeInUp.delay(500 + index * 100).duration(400).springify()}
              >
                <GradientCard variant="subtle" style={styles.tipCard}>
                  <View style={styles.tipContent}>
                    <Text style={styles.tipEmoji}>{tip.emoji}</Text>
                    <Text style={styles.tipText}>{tip.text}</Text>
                  </View>
                </GradientCard>
              </Animated.View>
            ))}
          </View>
        </View>

        <Animated.View style={styles.footer} entering={FadeIn.delay(900).duration(500)}>
          <View style={styles.pagination}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          <Button
            title={t('common.continue')}
            onPress={() => router.push('/onboarding/method')}
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
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  illustrationWrapper: {
    marginBottom: spacing.lg,
  },
  illustration: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
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
    marginBottom: spacing.lg,
  },
  tipsContainer: {
    width: '100%',
    gap: spacing.sm,
  },
  tipCard: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  tipEmoji: {
    fontSize: 28,
  },
  tipText: {
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
