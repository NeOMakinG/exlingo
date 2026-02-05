import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PressableScale } from './PressableScale';
import { colors, spacing, fontSize, borderRadius } from '../constants/theme';

interface SentenceCardProps {
  original: string;
  translation: string;
  notes?: string;
  onSpeak?: () => void;
  onDelete?: () => void;
  index?: number;
}

export function SentenceCard({
  original,
  translation,
  notes,
  onSpeak,
  onDelete,
  index = 0,
}: SentenceCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).duration(400).springify()}
      style={[styles.container, shadowStyle]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.original} numberOfLines={3}>
            {original}
          </Text>
          {onSpeak && (
            <PressableScale onPress={onSpeak} style={styles.iconButton}>
              <Text style={styles.icon}>🔊</Text>
            </PressableScale>
          )}
        </View>
        <Text style={styles.translation} numberOfLines={2}>
          {translation}
        </Text>
        {notes && (
          <Text style={styles.notes} numberOfLines={1}>
            💡 {notes}
          </Text>
        )}
      </View>
      {onDelete && (
        <View style={styles.actions}>
          <PressableScale onPress={onDelete} style={styles.deleteButton}>
            <Text style={styles.deleteIcon}>🗑️</Text>
          </PressableScale>
        </View>
      )}
    </Animated.View>
  );
}

const shadowStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  android: {
    elevation: 3,
  },
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  original: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 24,
  },
  iconButton: {
    padding: spacing.xs,
  },
  icon: {
    fontSize: 20,
  },
  translation: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  notes: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  deleteIcon: {
    fontSize: 16,
    opacity: 0.7,
  },
});
