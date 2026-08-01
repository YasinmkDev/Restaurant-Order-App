import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Screen } from '../components/ui/Screen';
import { AppText } from '../components/ui/AppText';
import { IconButton } from '../components/ui/IconButton';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { useSafeRouter } from '../hooks/useSafeRouter';
import { useTheme } from '../hooks/useTheme';
import { Radius, Spacing } from '../components/ui/theme';
import { useOrderStore } from '../store/order.store';
import { DEMO_ADDRESSES } from '../data/addresses';
import { DeliveryAddress } from '../types/order';

const ADDRESS_TYPES = [
  { id: 'Home', icon: 'home-outline' as const },
  { id: 'Work', icon: 'briefcase-outline' as const },
  { id: 'Apartment', icon: 'business-outline' as const },
  { id: 'Other', icon: 'location-outline' as const },
];

export default function AddressesScreen() {
  const router = useSafeRouter();
  const { colors, isDark } = useTheme();

  const selectedAddress = useOrderStore((s) => s.selectedAddress);
  const setSelectedAddress = useOrderStore((s) => s.setSelectedAddress);

  const [addresses, setAddresses] = useState<DeliveryAddress[]>(DEMO_ADDRESSES);
  const [modalVisible, setModalVisible] = useState(false);

  // New address form state
  const [newTitle, setNewTitle] = useState('Home');
  const [newStreet, setNewStreet] = useState('');
  const [newSector, setNewSector] = useState('');
  const [newNote, setNewNote] = useState('');

  const handleSelectAddress = (addr: DeliveryAddress) => {
    Haptics.selectionAsync().catch(() => {});
    setSelectedAddress(addr);
  };

  const handleDeleteAddress = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    Alert.alert(
      'Remove Address',
      'Are you sure you want to remove this saved delivery address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setAddresses((prev) => prev.filter((a) => a.id !== id));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          },
        },
      ]
    );
  };

  const handleSaveNewAddress = () => {
    if (!newStreet.trim()) {
      Alert.alert('Address Required', 'Please enter your street / building details.');
      return;
    }

    const full = `${newStreet.trim()}, ${newSector.trim() || 'Islamabad'}`;
    const newAddr: DeliveryAddress = {
      id: `addr-${Date.now()}`,
      title: newTitle,
      fullAddress: full,
      coordinates: {
        latitude: 33.6844 + (Math.random() - 0.5) * 0.05,
        longitude: 73.0479 + (Math.random() - 0.5) * 0.05,
      },
    };

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setAddresses((prev) => [newAddr, ...prev]);
    setSelectedAddress(newAddr);
    setModalVisible(false);
    setNewStreet('');
    setNewSector('');
    setNewNote('');
  };

  return (
    <Screen safeBottom>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.topHeader, { borderBottomColor: colors.borderSubtle }]}>
        <View style={styles.headerLeft}>
          <IconButton
            icon={<Ionicons name="arrow-back" size={20} color={colors.textPrimary} />}
            onPress={() => router.back()}
            accessibilityLabel="Go back"
            size={40}
          />
          <View style={styles.headerTitleCol}>
            <AppText variant="title" style={styles.headerTitle}>
              Saved Addresses
            </AppText>
            <AppText variant="micro" color="secondary">
              Manage your drop-off coordinates in Islamabad
            </AppText>
          </View>
        </View>

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            setModalVisible(true);
          }}
          style={[styles.addBtn, { backgroundColor: colors.accent }]}
        >
          <Ionicons name="add" size={16} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add New</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Active Tip Card */}
        <View
          style={[
            styles.tipCard,
            {
              backgroundColor: isDark ? 'rgba(255, 107, 0, 0.12)' : 'rgba(255, 107, 0, 0.06)',
              borderColor: isDark ? 'rgba(255, 107, 0, 0.28)' : 'rgba(255, 107, 0, 0.16)',
            },
          ]}
        >
          <Ionicons name="navigate-circle-outline" size={22} color={colors.accent} />
          <View style={styles.tipTextCol}>
            <Text style={[styles.tipTitle, { color: colors.textPrimary }]}>
              High-Precision Telemetry
            </Text>
            <Text style={[styles.tipDesc, { color: colors.textSecondary }]}>
              Tap any location below to set it as your immediate delivery destination for restaurants and parcel couriers.
            </Text>
          </View>
        </View>

        {/* Addresses List */}
        <View style={styles.listSection}>
          {addresses.map((item) => {
            const isSelected = selectedAddress.id === item.id;
            const iconName =
              item.title.toLowerCase().includes('home')
                ? 'home'
                : item.title.toLowerCase().includes('work')
                ? 'briefcase'
                : 'location';

            return (
              <Pressable
                key={item.id}
                onPress={() => handleSelectAddress(item)}
                style={({ pressed }) => [
                  styles.addressCard,
                  {
                    backgroundColor: colors.surfaceRaised,
                    borderColor: isSelected ? colors.accent : colors.borderSubtle,
                    opacity: pressed ? 0.92 : 1,
                  },
                ]}
              >
                <View style={styles.cardTopRow}>
                  <View style={styles.cardHeaderLeft}>
                    <View
                      style={[
                        styles.iconCircle,
                        {
                          backgroundColor: isSelected
                            ? colors.accent
                            : isDark
                            ? 'rgba(255,255,255,0.08)'
                            : '#F1F5F9',
                        },
                      ]}
                    >
                      <Ionicons
                        name={iconName}
                        size={18}
                        color={isSelected ? '#FFFFFF' : colors.textPrimary}
                      />
                    </View>
                    <View>
                      <View style={styles.titleBadgeRow}>
                        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                          {item.title}
                        </Text>
                        {isSelected && (
                          <View
                            style={[
                              styles.defaultBadge,
                              { backgroundColor: isDark ? 'rgba(255, 107, 0, 0.25)' : 'rgba(255, 107, 0, 0.12)' },
                            ]}
                          >
                            <Text style={[styles.defaultBadgeText, { color: colors.accent }]}>
                              Active Destination
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={[styles.coordsText, { color: colors.textTertiary }]}>
                        GPS: {item.coordinates.latitude.toFixed(4)}, {item.coordinates.longitude.toFixed(4)}
                      </Text>
                    </View>
                  </View>

                  {/* Radio checkmark */}
                  <View
                    style={[
                      styles.radioCircle,
                      {
                        borderColor: isSelected ? colors.accent : colors.borderSubtle,
                        backgroundColor: isSelected ? colors.accent : 'transparent',
                      },
                    ]}
                  >
                    {isSelected && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
                  </View>
                </View>

                {/* Address text */}
                <Text style={[styles.cardAddress, { color: colors.textSecondary }]}>
                  {item.fullAddress}
                </Text>

                {/* Footer action buttons */}
                <View style={styles.cardFooter}>
                  <View style={styles.deliveryNoteRow}>
                    <Ionicons name="bicycle-outline" size={14} color="#10B981" />
                    <Text style={styles.deliveryNoteText}>Standard dispatch available</Text>
                  </View>

                  {addresses.length > 1 && (
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(item.id);
                      }}
                      hitSlop={8}
                      style={styles.deleteBtn}
                    >
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </Pressable>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* ── Add New Address Modal ── */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.borderSubtle }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                Add Delivery Address
              </Text>
              <Pressable onPress={() => setModalVisible(false)} hitSlop={8}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </Pressable>
            </View>

            {/* Type selector */}
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Label</Text>
            <View style={styles.typeRow}>
              {ADDRESS_TYPES.map((t) => {
                const isSelected = newTitle === t.id;
                return (
                  <Pressable
                    key={t.id}
                    onPress={() => setNewTitle(t.id)}
                    style={[
                      styles.typePill,
                      {
                        backgroundColor: isSelected ? colors.accent : isDark ? '#1E2330' : '#F1F5F9',
                        borderColor: isSelected ? colors.accent : colors.borderSubtle,
                      },
                    ]}
                  >
                    <Ionicons
                      name={t.icon}
                      size={14}
                      color={isSelected ? '#FFFFFF' : colors.textPrimary}
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      style={[
                        styles.typePillText,
                        { color: isSelected ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    >
                      {t.id}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Street input */}
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Street & Building</Text>
            <TextInput
              value={newStreet}
              onChangeText={setNewStreet}
              placeholder="e.g. House 18, Street 45"
              placeholderTextColor={colors.textTertiary}
              style={[styles.modalInput, { color: colors.textPrimary, borderColor: colors.borderSubtle }]}
            />

            {/* Sector input */}
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Sector / Area</Text>
            <TextInput
              value={newSector}
              onChangeText={setNewSector}
              placeholder="e.g. Sector F-7/2, Islamabad"
              placeholderTextColor={colors.textTertiary}
              style={[styles.modalInput, { color: colors.textPrimary, borderColor: colors.borderSubtle }]}
            />

            {/* Note input */}
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Rider Note (Optional)</Text>
            <TextInput
              value={newNote}
              onChangeText={setNewNote}
              placeholder="e.g. Ring bell twice, leave with guard"
              placeholderTextColor={colors.textTertiary}
              style={[styles.modalInput, { color: colors.textPrimary, borderColor: colors.borderSubtle }]}
            />

            <View style={styles.modalActions}>
              <PrimaryButton label="Save & Use Address" onPress={handleSaveNewAddress} />
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitleCol: {
    marginLeft: Spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    gap: 4,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  tipCard: {
    flexDirection: 'row',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    gap: 12,
    marginBottom: Spacing.md,
    alignItems: 'flex-start',
  },
  tipTextCol: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  tipDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  listSection: {
    gap: Spacing.md,
  },
  addressCard: {
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1.5,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  coordsText: {
    fontSize: 10,
    marginTop: 1,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardAddress: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150,150,150,0.15)',
    paddingTop: 8,
  },
  deliveryNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  deliveryNoteText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  deleteBtn: {
    padding: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: Spacing.sm,
    marginBottom: 4,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.xs,
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  typePillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 10,
    fontSize: 14,
  },
  modalActions: {
    marginTop: Spacing.lg,
  },
});
