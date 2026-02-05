import { View, Text, StyleSheet, Pressable, SafeAreaView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { colors, spacing, fontSize, borderRadius } from '../../src/constants/theme';
import { useAppleSignIn, useGoogleSignIn } from '../../src/hooks/useAuth';

// Needed for Google Auth session
WebBrowser.maybeCompleteAuthSession();

// You'll need to add these to your Google Cloud Console
const GOOGLE_CLIENT_ID_IOS = 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_CLIENT_ID_ANDROID = 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_CLIENT_ID_WEB = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';

export default function SignInScreen() {
  const { t } = useTranslation();
  const appleSignIn = useAppleSignIn();
  const googleSignIn = useGoogleSignIn();

  // Google Auth Session
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_CLIENT_ID_WEB,
    iosClientId: GOOGLE_CLIENT_ID_IOS,
    androidClientId: GOOGLE_CLIENT_ID_ANDROID,
  });

  // Handle Google auth response
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      googleSignIn.mutate(id_token, {
        onSuccess: () => {
          router.replace('/(tabs)/sentences');
        },
        onError: (error) => {
          Alert.alert(
            t('auth.error'),
            error.message || t('auth.googleError')
          );
        },
      });
    }
  }, [response]);

  // Handle Apple sign in
  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        appleSignIn.mutate(
          {
            idToken: credential.identityToken,
            user: {
              email: credential.email,
              fullName: credential.fullName,
            },
          },
          {
            onSuccess: () => {
              router.replace('/(tabs)/sentences');
            },
            onError: (error) => {
              Alert.alert(
                t('auth.error'),
                error.message || t('auth.appleError')
              );
            },
          }
        );
      }
    } catch (error: any) {
      if (error.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert(t('auth.error'), t('auth.appleError'));
      }
    }
  };

  // Handle Google sign in
  const handleGoogleSignIn = () => {
    promptAsync();
  };

  const isLoading = appleSignIn.isPending || googleSignIn.isPending;

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={styles.content} entering={FadeIn.duration(600)}>
        {/* Header */}
        <Animated.View entering={FadeInUp.delay(200).duration(500)}>
          <View style={styles.illustration}>
            <Text style={styles.emoji}>🔐</Text>
          </View>
        </Animated.View>

        <Animated.View style={styles.textContainer} entering={FadeInUp.delay(400).duration(500)}>
          <Text style={styles.title}>{t('auth.signIn.title')}</Text>
          <Text style={styles.subtitle}>{t('auth.signIn.subtitle')}</Text>
        </Animated.View>

        {/* Auth Buttons */}
        <Animated.View style={styles.buttonContainer} entering={FadeInUp.delay(600).duration(500)}>
          {/* Apple Sign In - iOS only */}
          {Platform.OS === 'ios' && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
              cornerRadius={borderRadius.md}
              style={styles.appleButton}
              onPress={handleAppleSignIn}
            />
          )}

          {/* Google Sign In */}
          <Pressable
            style={[styles.googleButton, isLoading && styles.buttonDisabled]}
            onPress={handleGoogleSignIn}
            disabled={!request || isLoading}
          >
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleButtonText}>
              {t('auth.signIn.continueWithGoogle')}
            </Text>
          </Pressable>
        </Animated.View>

        {/* Terms */}
        <Animated.View entering={FadeInUp.delay(800).duration(500)}>
          <Text style={styles.terms}>
            {t('auth.signIn.termsPrefix')}{' '}
            <Text style={styles.termsLink}>{t('auth.signIn.terms')}</Text>
            {' '}{t('auth.signIn.and')}{' '}
            <Text style={styles.termsLink}>{t('auth.signIn.privacy')}</Text>
          </Text>
        </Animated.View>
      </Animated.View>

      {/* Footer */}
      <Animated.View style={styles.footer} entering={FadeIn.delay(1000).duration(500)}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.skipText}>{t('auth.signIn.skip')}</Text>
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
    marginBottom: spacing.xl,
  },
  emoji: {
    fontSize: 56,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
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
  buttonContainer: {
    width: '100%',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  appleButton: {
    width: '100%',
    height: 50,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4285F4',
  },
  googleButtonText: {
    color: '#1f1f1f',
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  terms: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: spacing.lg,
  },
  termsLink: {
    color: colors.primary,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  skipText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
});
