import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';

interface SupportWidgetProps {
  onContactSupport?: () => void;
}

export function SupportWidget({ onContactSupport }: SupportWidgetProps) {
  const { colors, isDark } = useTheme();

  const handleSupportPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (onContactSupport) {
      onContactSupport();
    } else {
      Linking.openURL('tel:+925111179438').catch(() => {});
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        },
      ]}
    >
      <View style={styles.contentRow}>
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: isDark ? 'rgba(255, 107, 0, 0.15)' : 'rgba(255, 107, 0, 0.1)' },
          ]}
        >
          <Ionicons name="headset" size={22} color={colors.accent} />
        </View>

        <View style={styles.textWrap}>
          <Text
            style={[
              styles.title,
              { color: isDark ? colors.textPrimary : '#1E293B' },
            ]}
          >
            24/7 Order Support
          </Text>
          <Text style={styles.subtitle}>
            Have an issue with an item, refund or delivery rider?
          </Text>
        </View>
      </View>

      <Pressable
        onPress={handleSupportPress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Chat with live customer support"
        style={({ pressed }) => [
          styles.actionBtn,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
            opacity: pressed ? 0.75 : 1,
          },
        ]}
      >
        <Text
          style={[
            styles.btnText,
            { color: isDark ? '#FFFFFF' : '#1E293B' },
          ]}
        >
          Get Help
        </Text>
        <Ionicons
          name="chevron-forward"
          size={14}
          color={isDark ? '#94A3B8' : '#64748B'}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 11.5,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
    lineHeight: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  btnText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
});
