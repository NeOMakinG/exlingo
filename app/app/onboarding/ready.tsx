import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn, FadeInUp, ZoomIn, BounceIn } from 'react-native-reanimated';
import { useStore } from '../../src/store/useStore';
import { colors, spacing, fontSize, borderRadius } from '../../src/constants/theme';

export default function ReadyScreen() {
  const { t } = useTranslation();
  const completeOnboarding = useStore((s) => s.completeOnboarding);

  const handleStart = () => {
    completeOnboarding();
    router.replace('/(tabs)/sentences');
  };

  const features = [
    { emoji: '📝', text: 'Add sentences from movies, books, songs' },
    { emoji: '🔊', text: 'Listen to pronunciation' },
    { emoji: '🎯', text: 'Review at your own pace' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={styles.illustration} entering={BounceIn.delay(200).duration(600)}>
          <Text style={styles.emoji}>🚀</Text>
        </Animated.View>

        <View style={styles.textContainer}>
          <Animated.Text style={styles.title} entering={FadeInUp.delay(400).duration(500)}>
            {t('onboarding.ready.title')}
          </Animated.Text>
          <Animated.Text style={styles.subtitle} entering={FadeInUp.delay(550).duration(500)}>
            {t('onboarding.ready.subtitle')}
          </Animated.Text>
        </View>

        <View style={styles.features}>
          {features.map((feature, index) => (
            <Animated.View 
              key={index} 
              style={styles.featureItem}
              entering={FadeInUp.delay(700 + index * 100).duration(400)}
            >
              <Text style={styles.featureEmoji}>{feature.emoji}</Text>
              <Text style={styles.featureText}>{feature.text}</Text>
            </Animated.View>
          ))}
        </View>
      </View>

      <Animated.View style={styles.footer} entering={FadeIn.delay(1100).duration(400)}>
        <View style={styles.pagination}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
        </View>

        <Animated.View entering={ZoomIn.delay(1200).duration(300)}>
          <Pressable style={styles.button} onPress={handleStart}>
            <Text style={styles.buttonText}>{t('onboarding.ready.button')}</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
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
