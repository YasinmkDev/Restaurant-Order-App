import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Screen } from '../../components/ui/Screen';
import { Divider } from '../../components/ui/Divider';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { HonestNoticeModal } from '../../components/ui/HonestNoticeModal';
import { AddressSelectorModal } from '../../components/checkout/AddressSelectorModal';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../../components/ui/theme';
import { useOrderStore } from '../../store/order.store';
import { UserProfileCard } from '../../components/account/UserProfileCard';
import { SwiftPassBanner } from '../../components/account/SwiftPassBanner';
import { WalletCard } from '../../components/account/WalletCard';
import { QuickActionGrid } from '../../components/account/QuickActionGrid';
import { EditProfileModal } from '../../components/account/EditProfileModal';
import { VouchersModal } from '../../components/account/VouchersModal';

export default function AccountScreen() {
  const router = useRouter();
  const { colors, isDark, mode, setMode } = useTheme();

  const selectedAddress = useOrderStore((s) => s.selectedAddress);
  const selectedPaymentMethod = useOrderStore((s) => s.selectedPaymentMethod);

  // User profile state
  const [profile, setProfile] = useState({
    name: 'Max Khan',
    phone: '+92 301 555-8942',
    email: 'maxkhan599@gmail.com',
    tier: 'Gold' as const,
  });

  // Modals & toggles
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [vouchersVisible, setVouchersVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [noticeVisible, setNoticeVisible] = useState(false);
  const [noticeContent, setNoticeContent] = useState({ title: '', message: '' });

  // Settings toggles
  const [pushNotifications, setPushNotifications] = useState(true);
  const [promoAlerts, setPromoAlerts] = useState(true);
  const [biometricPin, setBiometricPin] = useState(true);

  const handleThemeChange = (newMode: 'light' | 'dark') => {
    if (mode === newMode) return;
    Haptics.selectionAsync().catch(() => {});
    setMode(newMode);
  };

  const handleNotice = (title: string, message: string) => {
    Haptics.selectionAsync().catch(() => {});
    setNoticeContent({ title, message });
    setNoticeVisible(true);
  };

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of your Swift Delivery account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
            Alert.alert('Logged Out', 'You have been safely signed out.', [{ text: 'OK' }]);
          },
        },
      ]
    );
  };

  return (
    <Screen safeBottom>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* ── Top Header ── */}
      <View
        style={[
          styles.header,
          {
            borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            backgroundColor: isDark ? colors.background : '#FFFFFF',
          },
        ]}
      >
        <View>
          <Text
            style={[
              styles.screenTitle,
              { color: isDark ? colors.textPrimary : '#1E293B' },
            ]}
          >
            Account & Hub
          </Text>
          <Text style={styles.screenSubtitle}>
            Membership, wallet, security & preferences
          </Text>
        </View>

        <Pressable
          onPress={() => setEditProfileVisible(true)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Edit profile"
          style={[
            styles.settingsHeaderBtn,
            { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9' },
          ]}
        >
          <Ionicons
            name="settings-outline"
            size={18}
            color={isDark ? colors.textPrimary : '#1E293B'}
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── 1. User Profile VIP Card ── */}
        <UserProfileCard
          name={profile.name}
          phone={profile.phone}
          email={profile.email}
          tier={profile.tier}
          onEditPress={() => setEditProfileVisible(true)}
        />

        {/* ── 2. Quick Action Grid (Favorites, Vouchers, Orders, Support) ── */}
        <QuickActionGrid
          onPressFavorites={() =>
            handleNotice(
              'Saved Favorites',
              'Your 8 saved restaurants including Cheezious F-7, Savour Foods, and Chaaye Khana are bookmarked for instant reordering.'
            )
          }
          onPressVouchers={() => setVouchersVisible(true)}
          onPressOrders={() => router.push('/(tabs)/orders' as any)}
          onPressHelp={() =>
            handleNotice(
              '24/7 Swift Dispatch Desk',
              'Instant assistance available for live route changes, missing order items, and rider verification across Islamabad.'
            )
          }
        />

        {/* ── 3. Swift Pass VIP Banner ── */}
        <SwiftPassBanner
          onLearnMore={() =>
            handleNotice(
              'Swift Pass VIP Benefits',
              'Enjoy Unlimited Rs. 0 delivery on all orders over Rs. 799, 5% wallet cashback, priority courier dispatch during rush hours, and bad-weather priority.'
            )
          }
        />

        {/* ── 4. Swift Wallet & Payment Methods ── */}
        <WalletCard
          balance={450}
          onTopUp={() =>
            handleNotice(
              'Wallet Top-Up',
              'Top up seamlessly via JazzCash, EasyPaisa, or any 1Link / Raast supported Pakistani bank account.'
            )
          }
          onManageMethods={() =>
            handleNotice(
              'Payment Preferences',
              'Defaulted to Cash on Delivery & JazzCash. Biometric wallet tokenization is enabled for instant checkout.'
            )
          }
        />

        {/* ── 5. Appearance Selection ── */}
        <View style={styles.section}>
          <SectionHeader title="Appearance" />
          <View
            style={[
              styles.themeSwitchTrack,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              },
            ]}
          >
            <Pressable
              onPress={() => handleThemeChange('light')}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Light theme"
              style={[
                styles.themeTab,
                !isDark && [
                  styles.themeTabActive,
                  { backgroundColor: colors.surfaceRaised },
                ],
              ]}
            >
              <Ionicons
                name="sunny"
                size={16}
                color={!isDark ? colors.accent : '#94A3B8'}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.themeTabText,
                  {
                    color: !isDark ? colors.accent : '#94A3B8',
                    fontWeight: !isDark ? '800' : '600',
                  },
                ]}
              >
                Light
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handleThemeChange('dark')}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Dark theme"
              style={[
                styles.themeTab,
                isDark && [
                  styles.themeTabActive,
                  { backgroundColor: colors.surfaceRaised },
                ],
              ]}
            >
              <Ionicons
                name="moon"
                size={16}
                color={isDark ? colors.accent : '#94A3B8'}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.themeTabText,
                  {
                    color: isDark ? colors.accent : '#94A3B8',
                    fontWeight: isDark ? '800' : '600',
                  },
                ]}
              >
                Dark
              </Text>
            </Pressable>
          </View>
        </View>

        <Divider spacing={Spacing.md} />

        {/* ── 6. Delivery & Account Preferences ── */}
        <View style={styles.section}>
          <SectionHeader title="Delivery & Addresses" />

          {/* Saved Delivery Address */}
          <Pressable
            onPress={() => setAddressModalVisible(true)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Change delivery address"
            style={styles.settingRow}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(255, 107, 0, 0.1)' }]}>
                <Ionicons name="location" size={17} color={colors.accent} />
              </View>
              <View style={styles.settingTextCol}>
                <Text
                  style={[
                    styles.settingTitle,
                    { color: isDark ? colors.textPrimary : '#1E293B' },
                  ]}
                >
                  Saved Addresses
                </Text>
                <Text numberOfLines={1} style={styles.settingSub}>
                  {selectedAddress.title} · {selectedAddress.fullAddress}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </Pressable>

          <Divider style={styles.rowDivider} />

          {/* Dietary Preferences */}
          <Pressable
            onPress={() =>
              handleNotice(
                'Dietary & Allergy Filter',
                'Your preferences: 100% Certified Halal, Medium Spice, Nut Allergy alerts enabled.'
              )
            }
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Dietary preferences"
            style={styles.settingRow}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                <MaterialCommunityIcons name="leaf" size={17} color="#10B981" />
              </View>
              <View style={styles.settingTextCol}>
                <Text
                  style={[
                    styles.settingTitle,
                    { color: isDark ? colors.textPrimary : '#1E293B' },
                  ]}
                >
                  Dietary Preferences
                </Text>
                <Text style={styles.settingSub}>100% Halal • Medium Spice</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </Pressable>
        </View>

        <Divider spacing={Spacing.md} />

        {/* ── 7. Notifications & Security Controls ── */}
        <View style={styles.section}>
          <SectionHeader title="Security & Notifications" />

          {/* Order Notifications Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                <Ionicons name="notifications" size={17} color="#3B82F6" />
              </View>
              <View style={styles.settingTextCol}>
                <Text
                  style={[
                    styles.settingTitle,
                    { color: isDark ? colors.textPrimary : '#1E293B' },
                  ]}
                >
                  Live Order Notifications
                </Text>
                <Text style={styles.settingSub}>Real-time delivery progress and rider alerts</Text>
              </View>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={(val) => {
                Haptics.selectionAsync().catch(() => {});
                setPushNotifications(val);
              }}
              trackColor={{ false: '#94A3B8', true: colors.accent }}
              thumbColor="#FFFFFF"
            />
          </View>

          <Divider style={styles.rowDivider} />

          {/* Promo Deals Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                <Ionicons name="pricetag" size={17} color="#F59E0B" />
              </View>
              <View style={styles.settingTextCol}>
                <Text
                  style={[
                    styles.settingTitle,
                    { color: isDark ? colors.textPrimary : '#1E293B' },
                  ]}
                >
                  Exclusive Discounts & Deals
                </Text>
                <Text style={styles.settingSub}>SMS and push alerts for flash voucher drops</Text>
              </View>
            </View>
            <Switch
              value={promoAlerts}
              onValueChange={(val) => {
                Haptics.selectionAsync().catch(() => {});
                setPromoAlerts(val);
              }}
              trackColor={{ false: '#94A3B8', true: colors.accent }}
              thumbColor="#FFFFFF"
            />
          </View>

          <Divider style={styles.rowDivider} />

          {/* Handover Security PIN Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                <Ionicons name="shield-checkmark" size={17} color="#10B981" />
              </View>
              <View style={styles.settingTextCol}>
                <Text
                  style={[
                    styles.settingTitle,
                    { color: isDark ? colors.textPrimary : '#1E293B' },
                  ]}
                >
                  Rider Handover PIN
                </Text>
                <Text style={styles.settingSub}>Require 4-digit PIN for safe delivery confirmation</Text>
              </View>
            </View>
            <Switch
              value={biometricPin}
              onValueChange={(val) => {
                Haptics.selectionAsync().catch(() => {});
                setBiometricPin(val);
              }}
              trackColor={{ false: '#94A3B8', true: colors.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <Divider spacing={Spacing.md} />

        {/* ── 8. Information & Support ── */}
        <View style={styles.section}>
          <SectionHeader title="Support & About" />

          {/* 24/7 Help Desk */}
          <Pressable
            onPress={() =>
              handleNotice(
                'Help & Support Center',
                'Call our 24/7 Islamabad dispatch center at +92 (51) 111-79438 or chat live with a support representative.'
              )
            }
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Help and support"
            style={styles.settingRow}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                <Ionicons name="help-circle" size={17} color="#3B82F6" />
              </View>
              <View style={styles.settingTextCol}>
                <Text
                  style={[
                    styles.settingTitle,
                    { color: isDark ? colors.textPrimary : '#1E293B' },
                  ]}
                >
                  Help Desk & Contact
                </Text>
                <Text style={styles.settingSub}>Contact dispatch or report an issue</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </Pressable>

          <Divider style={styles.rowDivider} />

          {/* Architecture & Demo Info */}
          <Pressable
            onPress={() =>
              handleNotice(
                'About Swift Delivery App',
                'Swift Courier is a state-of-the-art commercial food and parcel dispatch application crafted for Islamabad, featuring autonomous waypoint telemetry, live courier map tracking, and instant reordering.'
              )
            }
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="About this app"
            style={styles.settingRow}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
                <Ionicons name="information-circle" size={17} color="#8B5CF6" />
              </View>
              <View style={styles.settingTextCol}>
                <Text
                  style={[
                    styles.settingTitle,
                    { color: isDark ? colors.textPrimary : '#1E293B' },
                  ]}
                >
                  About Swift Delivery
                </Text>
                <Text style={styles.settingSub}>v2.4.1 (Build 182) • Islamabad Hub</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </Pressable>
        </View>

        <Divider spacing={Spacing.lg} />

        {/* ── 9. Log Out Button ── */}
        <Pressable
          onPress={handleLogout}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Log out of account"
          style={({ pressed }) => [
            styles.logoutBtn,
            {
              backgroundColor: isDark ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.08)',
              borderColor: 'rgba(239, 68, 68, 0.25)',
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <Ionicons name="log-out-outline" size={18} color="#EF4444" />
          <Text style={styles.logoutBtnText}>Log Out Max Khan</Text>
        </Pressable>
      </ScrollView>

      {/* ── Edit Profile Modal ── */}
      <EditProfileModal
        visible={editProfileVisible}
        initialName={profile.name}
        initialPhone={profile.phone}
        initialEmail={profile.email}
        onClose={() => setEditProfileVisible(false)}
        onSave={(data) => {
          setProfile((prev) => ({
            ...prev,
            name: data.name,
            phone: data.phone,
            email: data.email,
          }));
        }}
      />

      {/* ── Vouchers & Promos Modal ── */}
      <VouchersModal
        visible={vouchersVisible}
        onClose={() => setVouchersVisible(false)}
        onApplyVoucher={(code) => {
          Alert.alert(
            'Voucher Applied!',
            `Voucher ${code} applied successfully to your upcoming orders.`,
            [{ text: 'Great' }]
          );
        }}
      />

      {/* ── Address Selector Modal ── */}
      <AddressSelectorModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
      />

      {/* ── Notice / Info Modal ── */}
      <HonestNoticeModal
        visible={noticeVisible}
        title={noticeContent.title}
        message={noticeContent.message}
        onClose={() => setNoticeVisible(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  screenSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
  },
  settingsHeaderBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: 160,
  },
  section: {
    marginVertical: Spacing.xs,
  },
  themeSwitchTrack: {
    flexDirection: 'row',
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: 3,
  },
  themeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: Radius.md,
    minHeight: 44,
  },
  themeTabActive: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  themeTabText: {
    fontSize: 13,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    minHeight: 52,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.md,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingTextCol: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  settingSub: {
    fontSize: 11.5,
    color: '#94A3B8',
    marginTop: 2,
  },
  rowDivider: {
    marginVertical: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginTop: Spacing.xs,
  },
  logoutBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#EF4444',
  },
});
