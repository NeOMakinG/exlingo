import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Speech from 'expo-speech';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../src/store/useStore';
import { SUPPORTED_LANGUAGES, getLanguageFlag, getTTSLanguageCode } from '../../src/utils/languages';
import { LanguageCode, Sentence } from '../../src/types';
import { colors, spacing, fontSize, borderRadius } from '../../src/constants/theme';
import { useAITranslate } from '../../src/hooks';

export default function SentencesScreen() {
  const { t } = useTranslation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNewSheetModal, setShowNewSheetModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [original, setOriginal] = useState('');
  const [translation, setTranslation] = useState('');
  const [notes, setNotes] = useState('');
  
  const {
    languageSheets,
    currentSheetId,
    setCurrentSheet,
    createSheet,
    addSentence,
    deleteSentence,
    user,
  } = useStore();

  // AI Translation hook
  const aiTranslate = useAITranslate();
  const isPremium = user?.subscriptionStatus === 'premium';

  const handleAITranslate = () => {
    if (!original.trim() || !currentSheet) return;
    
    aiTranslate.mutate(
      {
        text: original,
        from: currentSheet.targetLanguage,
        to: user?.nativeLanguage ?? 'en',
      },
      {
        onSuccess: (data) => {
          setTranslation(data.translation);
        },
        onError: (error) => {
          Alert.alert('Translation Error', error.message);
        },
      }
    );
  };

  const currentSheet = languageSheets.find(s => s.id === currentSheetId);
  
  const filteredSentences = currentSheet?.sentences.filter(s =>
    s.original.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.translation.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? [];

  const handleSpeak = useCallback((text: string, language: LanguageCode) => {
    Speech.speak(text, {
      language: getTTSLanguageCode(language),
      rate: 0.9,
    });
  }, []);

  const handleAddSentence = () => {
    if (!currentSheetId || !original.trim() || !translation.trim()) return;
    
    addSentence(currentSheetId, {
      original: original.trim(),
      translation: translation.trim(),
      notes: notes.trim() || undefined,
      targetLanguage: currentSheet!.targetLanguage,
      sourceLanguage: user?.nativeLanguage ?? 'en',
    });
    
    setOriginal('');
    setTranslation('');
    setNotes('');
    setShowAddModal(false);
  };

  const handleDeleteSentence = (sentenceId: string) => {
    if (!currentSheetId) return;
    Alert.alert(
      t('common.delete'),
      'Are you sure you want to delete this sentence?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('common.delete'), 
          style: 'destructive',
          onPress: () => deleteSentence(currentSheetId, sentenceId),
        },
      ]
    );
  };

  const handleCreateSheet = (language: LanguageCode) => {
    createSheet(language);
    setShowNewSheetModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('sentences.title')}</Text>
      </View>

      {/* Language Sheets Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {languageSheets.map((sheet) => (
            <Pressable
              key={sheet.id}
              style={[
                styles.tab,
                currentSheetId === sheet.id && styles.tabActive,
              ]}
              onPress={() => setCurrentSheet(sheet.id)}
            >
              <Text style={styles.tabFlag}>
                {getLanguageFlag(sheet.targetLanguage)}
              </Text>
              <Text style={[
                styles.tabText,
                currentSheetId === sheet.id && styles.tabTextActive,
              ]}>
                {sheet.sentences.length}
              </Text>
            </Pressable>
          ))}
          <Pressable
            style={styles.addTabButton}
            onPress={() => setShowNewSheetModal(true)}
          >
            <Text style={styles.addTabText}>+</Text>
          </Pressable>
        </ScrollView>
      </View>

      {/* Search */}
      {currentSheet && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={t('common.search')}
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}

      {/* Content */}
      {currentSheet ? (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {filteredSentences.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📝</Text>
              <Text style={styles.emptyTitle}>{t('sentences.empty.title')}</Text>
              <Text style={styles.emptySubtitle}>{t('sentences.empty.subtitle')}</Text>
            </View>
          ) : (
            filteredSentences.map((sentence) => (
              <View key={sentence.id} style={styles.sentenceCard}>
                <View style={styles.sentenceHeader}>
                  <Text style={styles.sentenceOriginal}>{sentence.original}</Text>
                  <Pressable
                    style={styles.speakButton}
                    onPress={() => handleSpeak(sentence.original, sentence.targetLanguage)}
                  >
                    <Text style={styles.speakIcon}>🔊</Text>
                  </Pressable>
                </View>
                <Text style={styles.sentenceTranslation}>{sentence.translation}</Text>
                {sentence.notes && (
                  <Text style={styles.sentenceNotes}>{sentence.notes}</Text>
                )}
                <View style={styles.sentenceActions}>
                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => handleDeleteSentence(sentence.id)}
                  >
                    <Text style={styles.deleteText}>🗑️</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      ) : (
        <View style={styles.noSheetState}>
          <Text style={styles.emptyEmoji}>🌍</Text>
          <Text style={styles.emptyTitle}>Choose a language to start</Text>
          <Pressable
            style={styles.createButton}
            onPress={() => setShowNewSheetModal(true)}
          >
            <Text style={styles.createButtonText}>{t('sentences.sheet.new')}</Text>
          </Pressable>
        </View>
      )}

      {/* FAB */}
      {currentSheet && (
        <Pressable
          style={styles.fab}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      )}

      {/* Add Sentence Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalCancel}>{t('common.cancel')}</Text>
            </Pressable>
            <Text style={styles.modalTitle}>{t('sentences.add.title')}</Text>
            <Pressable onPress={handleAddSentence}>
              <Text style={styles.modalSave}>{t('common.save')}</Text>
            </Pressable>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.inputLabel}>{t('sentences.add.original')}</Text>
            <TextInput
              style={styles.textInput}
              placeholder={t('sentences.add.originalPlaceholder')}
              placeholderTextColor={colors.textMuted}
              value={original}
              onChangeText={setOriginal}
              multiline
            />
            
            <Text style={styles.inputLabel}>{t('sentences.add.translation')}</Text>
            <TextInput
              style={styles.textInput}
              placeholder={t('sentences.add.translationPlaceholder')}
              placeholderTextColor={colors.textMuted}
              value={translation}
              onChangeText={setTranslation}
              multiline
            />
            
            <Text style={styles.inputLabel}>{t('sentences.add.notes')}</Text>
            <TextInput
              style={styles.textInput}
              placeholder={t('sentences.add.notesPlaceholder')}
              placeholderTextColor={colors.textMuted}
              value={notes}
              onChangeText={setNotes}
              multiline
            />

            <Pressable 
              style={[
                styles.aiFeature,
                isPremium && styles.aiFeatureEnabled,
                aiTranslate.isPending && styles.aiFeatureLoading,
              ]}
              onPress={isPremium ? handleAITranslate : undefined}
              disabled={!isPremium || aiTranslate.isPending || !original.trim()}
            >
              {aiTranslate.isPending ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={styles.aiFeatureText}>🤖 {t('sentences.add.aiTranslate')}</Text>
              )}
              {!isPremium && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumBadgeText}>{t('sentences.add.premiumRequired')}</Text>
                </View>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </Modal>

      {/* New Sheet Modal */}
      <Modal
        visible={showNewSheetModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNewSheetModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setShowNewSheetModal(false)}>
              <Text style={styles.modalCancel}>{t('common.cancel')}</Text>
            </Pressable>
            <Text style={styles.modalTitle}>{t('sentences.sheet.new')}</Text>
            <View style={{ width: 50 }} />
          </View>
          
          <ScrollView style={styles.modalContent}>
            {SUPPORTED_LANGUAGES.filter(
              l => !languageSheets.some(s => s.targetLanguage === l.code)
            ).map((lang) => (
              <Pressable
                key={lang.code}
                style={styles.languageOption}
                onPress={() => handleCreateSheet(lang.code)}
              >
                <Text style={styles.languageFlag}>{lang.flag}</Text>
                <View style={styles.languageInfo}>
                  <Text style={styles.languageName}>{lang.nativeName}</Text>
                  <Text style={styles.languageNameEn}>{lang.name}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Modal>
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
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
  },
  tabsContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
    gap: spacing.xs,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabFlag: {
    fontSize: 20,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.text,
  },
  addTabButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTabText: {
    color: colors.textSecondary,
    fontSize: fontSize.xl,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  searchInput: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text,
    fontSize: fontSize.md,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  noSheetState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  createButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  createButtonText: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  sentenceCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  sentenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  sentenceOriginal: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 24,
  },
  speakButton: {
    padding: spacing.xs,
  },
  speakIcon: {
    fontSize: 20,
  },
  sentenceTranslation: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.xs,
  },
  sentenceNotes: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  sentenceActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  deleteText: {
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '400',
    marginTop: -2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  modalCancel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  modalSave: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: spacing.lg,
  },
  inputLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  textInput: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text,
    fontSize: fontSize.md,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  aiFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.xl,
    opacity: 0.6,
  },
  aiFeatureEnabled: {
    opacity: 1,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  aiFeatureLoading: {
    opacity: 0.8,
  },
  aiFeatureText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  premiumBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  premiumBadgeText: {
    color: colors.background,
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  languageFlag: {
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
  languageNameEn: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
