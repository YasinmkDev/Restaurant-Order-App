import React from 'react';
import { View, Modal, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { PrimaryButton } from './PrimaryButton';
import { IconButton } from './IconButton';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from './theme';

interface HonestNoticeModalProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export function HonestNoticeModal({
  visible,
  title,
  message,
  onClose,
}: HonestNoticeModalProps) {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.borderSubtle,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={colors.accent}
                style={{ marginRight: Spacing.xs }}
              />
              <AppText variant="sectionTitle">{title}</AppText>
            </View>
            <IconButton
              icon={<Ionicons name="close" size={18} color={colors.textPrimary} />}
              onPress={onClose}
              accessibilityLabel="Dismiss notice"
              size={36}
            />
          </View>

          <AppText variant="body" color="secondary" style={styles.message}>
            {message}
          </AppText>

          <PrimaryButton
            label="Understood"
            onPress={onClose}
            size="sm"
            style={styles.button}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    padding: Spacing.md,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  message: {
    marginVertical: Spacing.sm,
    lineHeight: 20,
  },
  button: {
    marginTop: Spacing.sm,
    width: '100%',
  },
});
