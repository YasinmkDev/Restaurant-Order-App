import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';

const INSTRUCTION_TAGS = [
  'No Onions',
  'Extra Spicy 🔥',
  'Mild / Low Spice',
  'Separate Sauce',
  'Include Cutlery 🍴',
  'Extra Napkins',
];

interface QuickInstructionPillsProps {
  currentNotes: string;
  onAppendNote: (tag: string) => void;
}

export function QuickInstructionPills({
  currentNotes,
  onAppendNote,
}: QuickInstructionPillsProps) {
  const { colors, isDark } = useTheme();

  const handleTagPress = (tag: string) => {
    Haptics.selectionAsync().catch(() => {});
    onAppendNote(tag);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>QUICK KITCHEN REQUESTS</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {INSTRUCTION_TAGS.map((tag) => {
          const isIncluded = currentNotes.includes(tag);

          return (
            <Pressable
              key={tag}
              onPress={() => handleTagPress(tag)}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Add note: ${tag}`}
              style={({ pressed }) => [
                styles.pill,
                {
                  backgroundColor: isIncluded
                    ? isDark
                      ? 'rgba(255, 107, 0, 0.15)'
                      : 'rgba(255, 107, 0, 0.1)'
                    : isDark
                    ? 'rgba(255,255,255,0.06)'
                    : '#F1F5F9',
                  borderColor: isIncluded
                    ? colors.accent
                    : isDark
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(0,0,0,0.06)',
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  {
                    color: isIncluded
                      ? colors.accent
                      : isDark
                      ? colors.textSecondary
                      : '#475569',
                    fontWeight: isIncluded ? '800' : '600',
                  },
                ]}
              >
                {isIncluded ? `✓ ${tag}` : `+ ${tag}`}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  scrollList: {
    gap: 8,
    paddingBottom: 4,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 12,
    letterSpacing: -0.1,
  },
});
