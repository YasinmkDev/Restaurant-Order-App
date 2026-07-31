import React from 'react';
import {
  View,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { AppText } from '../ui/AppText';
import { IconButton } from '../ui/IconButton';
import { Divider } from '../ui/Divider';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';
import { useOrderStore } from '../../store/order.store';
import { DEMO_ADDRESSES } from '../../data/addresses';
import { DeliveryAddress } from '../../types/order';

interface AddressSelectorModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AddressSelectorModal({ visible, onClose }: AddressSelectorModalProps) {
  const { colors } = useTheme();
  const selectedAddress = useOrderStore((s) => s.selectedAddress);
  const setSelectedAddress = useOrderStore((s) => s.setSelectedAddress);

  const handleSelect = (addr: DeliveryAddress) => {
    Haptics.selectionAsync().catch(() => {});
    setSelectedAddress(addr);
    onClose();
  };

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
            styles.sheet,
            { backgroundColor: colors.surface, borderColor: colors.borderSubtle },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <AppText variant="sectionTitle">Delivery location</AppText>
              <AppText variant="caption" color="secondary">
                Select an address in Islamabad
              </AppText>
            </View>
            <IconButton
              icon={<Ionicons name="close" size={18} color={colors.textPrimary} />}
              onPress={onClose}
              accessibilityLabel="Close address selector"
              size={36}
            />
          </View>

          <Divider style={styles.headerDivider} />

          {/* Clean selection rows */}
          <View style={styles.list}>
            {DEMO_ADDRESSES.map((addr) => {
              const isSelected = selectedAddress.id === addr.id;
              return (
                <Pressable
                  key={addr.id}
                  onPress={() => handleSelect(addr)}
                  accessible={true}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={`${addr.title}, ${addr.fullAddress}`}
                  style={[
                    styles.row,
                    isSelected && {
                      backgroundColor: colors.accentSoft,
                      borderColor: colors.accent,
                    },
                    !isSelected && {
                      borderColor: colors.borderSubtle,
                    },
                  ]}
                >
                  <View style={styles.rowContent}>
                    <View style={styles.titleRow}>
                      <AppText variant="bodyMedium">{addr.title}</AppText>
                      {isSelected && (
                        <AppText variant="micro" style={{ color: colors.accent }}>
                          SELECTED
                        </AppText>
                      )}
                    </View>
                    <AppText
                      variant="caption"
                      color="secondary"
                      numberOfLines={2}
                      style={styles.addressText}
                    >
                      {addr.fullAddress}
                    </AppText>
                  </View>

                  <View
                    style={[
                      styles.radio,
                      {
                        borderColor: isSelected ? colors.accent : colors.borderSubtle,
                      },
                    ]}
                  >
                    {isSelected && (
                      <View
                        style={[
                          styles.radioDot,
                          { backgroundColor: colors.accent },
                        ]}
                      />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    padding: Spacing.md,
  },
  sheet: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerDivider: {
    marginVertical: Spacing.md,
  },
  list: {
    gap: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    minHeight: 56,
  },
  rowContent: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addressText: {
    marginTop: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
