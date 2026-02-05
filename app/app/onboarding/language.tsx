import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn, FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useStore } from '../../src/store/useStore';
import { SUPPORTED_LANGUAGES } from '../../src/utils/languages';
import { LanguageCode } from '../../src/types';
import { colors, spacing, fontSize, borderRadius } from '../../src/constants/theme';
import i18n from '../../src/i18n';

export default function LanguageScreen() {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en');
  const updateUser = useStore((s) => s.updateUser);
  const setUser = useStore((s) => s.setUser);
  const user = useStore((s) => s.user);

  const handleContinue = () => {
    // Create user if doesn't exist
    if (!user) {
      setUser({
        id: Math.random().toString(36).substring(2, 15),
        email: '',
        nativeLanguage: selectedLanguage,
        hasCompletedOnboarding: false,
        subscriptionStatus: 'free',
        createdAt: Date.now(),
      });
    } else {
      updateUser({ nativeLanguage: selectedLanguage });
    }
    
    // Update app language
    if (i18n.language !== selectedLanguage) {
      i18n.changeLanguage(selectedLanguage);
    }
    
    router.push('/onboarding/ready');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={styles.header} entering={FadeInDown.delay(100).duration(400)}>
        <Text style={styles.title}>{t('onboarding.language.title')}</Text>
        <Text style={styles.subtitle}>{t('onboarding.language.subtitle')}</Text>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.languageGrid}
        showsVerticalScrollIndicator={false}
      >
        {SUPPORTED_LANGUAGES.map((lang, index) => (
          <Animated.View 
            key={lang.code}
            entering={FadeInUp.delay(200 + index * 50).duration(300)}
          >
            <Pressable
              style={[
                styles.languageCard,
                selectedLanguage === lang.code && styles.languageCardSelected,
              ]}
              onPress={() => setSelectedLanguage(lang.code)}
            >
              <Text style={styles.flag}>{lang.flag}</Text>
              <View style={styles.languageInfo}>
                <Text style={styles.languageName}>{lang.nativeName}</Text>
                <Text style={styles.languageNameEnglish}>{lang.name}</Text>
              </View>
              {selectedLanguage === lang.code && (
                <Animated.View style={styles.checkmark} entering={FadeIn.duration(200)}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </Animated.View>
              )}
            </Pressable>
          </Animated.View>
        ))}
      </ScrollView>

      <Animated.View style={styles.footer} entering={FadeIn.delay(800).duration(400)}>
        <View style={styles.pagination}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
        </View>

        <Pressable style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>{t('common.continue')}</Text>
        </Pressable>
      </Animated.View>
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
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
  },
  scrollView: {
    flex: 1,
  },
  languageGrid: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: spacing.md,
  },
  languageCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.backgroundSecondary,
  },
  flag: {
    fontSize: 32,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  languageNameEnglish: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: colors.text,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
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
