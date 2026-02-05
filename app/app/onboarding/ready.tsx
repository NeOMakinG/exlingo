import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { BounceIn, FadeIn, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, GradientCard } from '../../src/components';
import { useStore } from '../../src/store/useStore';
import { colors, spacing, fontSize, borderRadius } from '../../src/constants/theme';

export default function ReadyScreen() {
  const { t } = useTranslation();
  const completeOnboarding = useStore((state) => state.completeOnboarding);

  const handleStart = () => {
    completeOnboarding();
    router.replace('/(tabs)/sentences');
  };

  const features = [
    { emoji: '✨', text: 'AI-powered translations' },
    { emoji: '🔊', text: 'Text-to-speech' },
    { emoji: '☁️', text: 'Cloud sync' },
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
            entering={BounceIn.delay(200).duration(800)}
          >
            <LinearGradient
              colors={['#22c55e', '#16a34a', '#15803d']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.illustrationGradient}
            >
              <Text style={styles.emoji}>🚀</Text>
            </LinearGradient>
          </Animated.View>

          <Animated.Text 
            style={styles.title} 
            entering={FadeInUp.delay(400).duration(500)}
          >
            {t('onboarding.ready.title')}
          </Animated.Text>
          
          <Animated.Text 
            style={styles.subtitle}
            entering={FadeInUp.delay(500).duration(500)}
          >
            {t('onboarding.ready.subtitle')}
          </Animated.Text>

          <Animated.View 
            style={styles.featuresContainer}
            entering={FadeIn.delay(600).duration(500)}
          >
            {features.map((feature, index) => (
              <Animated.View
                key={index}
                entering={FadeInUp.delay(700 + index * 100).duration(400)}
              >
                <View style={styles.feature}>
                  <Text style={styles.featureEmoji}>{feature.emoji}</Text>
                  <Text style={styles.featureText}>{feature.text}</Text>
                </View>
              </Animated.View>
            ))}
          </Animated.View>
        </View>

        <Animated.View style={styles.footer} entering={ZoomIn.delay(1000).duration(400).springify()}>
          <View style={styles.pagination}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotActive]} />
          </View>

          <GradientCard variant="primary" onPress={handleStart}>
            <Text style={styles.buttonText}>{t('onboarding.ready.button')}</Text>
          </GradientCard>
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
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  illustrationWrapper: {
    marginBottom: spacing.xl,
  },
  illustrationGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 56,
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
    marginBottom: spacing.xl,
  },
  featuresContainer: {
    gap: spacing.md,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureEmoji: {
    fontSize: 20,
  },
  featureText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
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
  buttonText: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
    textAlign: 'center',
  },
});
