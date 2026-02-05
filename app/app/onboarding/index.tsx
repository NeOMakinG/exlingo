import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../../src/components';
import { colors, spacing, fontSize, borderRadius } from '../../src/constants/theme';

export default function WelcomeScreen() {
  const { t } = useTranslation();

  return (
    <LinearGradient
      colors={['#0f0f1a', '#1a1a2e', '#0f0f1a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Hero illustration with gradient glow */}
          <Animated.View 
            style={styles.illustrationWrapper} 
            entering={ZoomIn.delay(200).duration(600).springify()}
          >
            <LinearGradient
              colors={['#6366f1', '#4f46e5', '#4338ca']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.illustrationGlow}
            />
            <View style={styles.illustration}>
              <Text style={styles.emoji}>📝</Text>
            </View>
          </Animated.View>

          <View style={styles.textContainer}>
            <Animated.Text 
              style={styles.title} 
              entering={FadeInUp.delay(400).duration(500)}
            >
              {t('onboarding.welcome.title')}
            </Animated.Text>
            <Animated.Text 
              style={styles.subtitle}
              entering={FadeInUp.delay(600).duration(500)}
            >
              {t('onboarding.welcome.subtitle')}
            </Animated.Text>
          </View>
        </View>

        <Animated.View style={styles.footer} entering={FadeIn.delay(800).duration(500)}>
          <View style={styles.pagination}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          <Button
            title={t('common.continue')}
            onPress={() => router.push('/onboarding/philosophy')}
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  illustrationWrapper: {
    marginBottom: spacing.xl,
    position: 'relative',
  },
  illustrationGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    opacity: 0.3,
    transform: [{ scale: 1.1 }],
  },
  illustration: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  emoji: {
    fontSize: 72,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: spacing.md,
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
