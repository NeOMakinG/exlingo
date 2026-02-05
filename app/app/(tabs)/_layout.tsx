import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, fontSize } from '../../src/constants/theme';

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return (
    <Text style={[styles.icon, focused && styles.iconFocused]}>{icon}</Text>
  );
}

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="sentences"
        options={{
          title: t('tabs.sentences'),
          tabBarIcon: ({ focused }) => <TabIcon icon="📝" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="youtube"
        options={{
          title: t('tabs.youtube'),
          tabBarIcon: ({ focused }) => <TabIcon icon="▶️" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="social"
        options={{
          title: t('tabs.social'),
          tabBarIcon: ({ focused }) => <TabIcon icon="📱" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          tabBarIcon: ({ focused }) => <TabIcon icon="⚙️" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.backgroundSecondary,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 85,
    paddingTop: 8,
    paddingBottom: 25,
  },
  tabBarLabel: {
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
  icon: {
    fontSize: 24,
    opacity: 0.6,
  },
  iconFocused: {
    opacity: 1,
  },
});
