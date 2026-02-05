import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { useStore } from '../../src/store/useStore';
import { getLanguageName, getLanguageFlag } from '../../src/utils/languages';
import { colors, spacing, fontSize, borderRadius } from '../../src/constants/theme';
import { useSubscriptionStatus, useSignOut, usePushSync } from '../../src/hooks';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { user, reset } = useStore();
  
  // React Query hooks
  const { data: subscriptionData, isLoading: isLoadingSubscription } = useSubscriptionStatus(!!user);
  const signOut = useSignOut();
  const pushSync = usePushSync();
  
  const isPremium = subscriptionData?.status === 'premium' || user?.subscriptionStatus === 'premium';

  const handleSignOut = () => {
    Alert.alert(
      t('auth.signOut'),
      'Are you sure you want to sign out?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('auth.signOut'),
          style: 'destructive',
          onPress: () => {
            signOut.mutate();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  const handleSyncNow = () => {
    pushSync.mutate(undefined, {
      onSuccess: () => {
        Alert.alert('Sync Complete', 'Your data has been synced to the cloud.');
      },
      onError: (error) => {
        Alert.alert('Sync Failed', error.message);
      },
    });
  };

  const handleUpgradeToPremium = () => {
    Alert.alert(
      'Coming Soon',
      'Premium subscription will be available soon with AI translations and cloud sync.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('settings.title')}</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.account')}</Text>
          
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>{t('settings.nativeLanguage')}</Text>
              <Text style={styles.rowValue}>
                {user?.nativeLanguage && (
                  <>
                    {getLanguageFlag(user.nativeLanguage)} {getLanguageName(user.nativeLanguage)}
                  </>
                )}
              </Text>
            </View>
          </View>
        </View>

        {/* Subscription Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.subscription')}</Text>
          
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Status</Text>
              {isLoadingSubscription ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <View style={[styles.badge, isPremium && styles.badgePremium]}>
                  <Text style={styles.badgeText}>
                    {t(`settings.subscriptionStatus.${isPremium ? 'premium' : 'free'}`)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {isPremium && (
            <Pressable 
              style={[styles.syncButton, pushSync.isPending && styles.syncButtonLoading]} 
              onPress={handleSyncNow}
              disabled={pushSync.isPending}
            >
              {pushSync.isPending ? (
                <ActivityIndicator size="small" color={colors.text} />
              ) : (
                <Text style={styles.syncButtonText}>☁️ Sync Now</Text>
              )}
            </Pressable>
          )}

          {!isPremium && (
            <Pressable style={styles.upgradeButton} onPress={handleUpgradeToPremium}>
              <Text style={styles.upgradeButtonText}>⭐ {t('settings.upgradeToPremium')}</Text>
            </Pressable>
          )}

          <View style={styles.premiumFeatures}>
            <Text style={styles.premiumTitle}>{t('settings.premiumFeatures.title')}</Text>
            <View style={styles.featureRow}>
              <Text style={styles.featureIcon}>🤖</Text>
              <Text style={styles.featureText}>{t('settings.premiumFeatures.aiTranslation')}</Text>
            </View>
            <View style={styles.featureRow}>
              <Text style={styles.featureIcon}>♾️</Text>
              <Text style={styles.featureText}>{t('settings.premiumFeatures.unlimited')}</Text>
            </View>
            <View style={styles.featureRow}>
              <Text style={styles.featureIcon}>☁️</Text>
              <Text style={styles.featureText}>{t('settings.premiumFeatures.sync')}</Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.about')}</Text>
          
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>{t('settings.version')}</Text>
              <Text style={styles.rowValue}>1.0.0</Text>
            </View>
          </View>
        </View>

        {/* Sign Out */}
        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>{t('settings.signOut')}</Text>
        </Pressable>
      </ScrollView>
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
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLabel: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  rowValue: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  badge: {
    backgroundColor: colors.backgroundTertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  badgePremium: {
    backgroundColor: colors.accent,
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.text,
  },
  upgradeButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  upgradeButtonText: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  syncButton: {
    backgroundColor: colors.backgroundTertiary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  syncButtonLoading: {
    opacity: 0.7,
  },
  syncButtonText: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '500',
  },
  premiumFeatures: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  premiumTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureIcon: {
    fontSize: 16,
  },
  featureText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  signOutButton: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  signOutText: {
    color: colors.error,
    fontSize: fontSize.md,
    fontWeight: '500',
  },
});
