import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  StatusBar,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Screen } from '../components/ui/Screen';
import { AppText } from '../components/ui/AppText';
import { IconButton } from '../components/ui/IconButton';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { StylishToggle } from '../components/ui/StylishToggle';
import { useSafeRouter } from '../hooks/useSafeRouter';
import { useTheme } from '../hooks/useTheme';
import { Radius, Spacing } from '../components/ui/theme';

const FAQS = [
  {
    q: 'How does live rider tracking work in Islamabad?',
    a: 'Our dispatch engine tracks your courier via high-frequency GPS telemetry updated every 2 seconds. You can monitor the rider approaching your gate in real time from the tracking map.',
  },
  {
    q: 'What should I do if an item is missing or cold?',
    a: 'Tap "Report an Issue" below or chat directly with dispatch. We issue an instant Swift Wallet credit or dispatch a replacement courier within 15 minutes.',
  },
  {
    q: 'Can I change my delivery address while the rider is on the way?',
    a: 'Yes, if the new location is within the same sector (e.g. F-10/2 to F-10/4), dispatch reroutes the courier automatically without extra charges.',
  },
  {
    q: 'How does the Handover Security PIN work?',
    a: 'When enabled in settings, you receive a 4-digit security PIN in your app. The rider cannot mark the delivery complete until they verify this PIN with you in person.',
  },
];

export default function SupportScreen() {
  const router = useSafeRouter();
  const { colors, isDark } = useTheme();

  // State
  const [priorityEscalation, setPriorityEscalation] = useState(false);
  const [autoSmsUpdates, setAutoSmsUpdates] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDetails, setTicketDetails] = useState('');

  const handleCallSupport = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    Linking.openURL('tel:+925111179438').catch(() => {
      Alert.alert('Dispatch Hotline', 'Please dial +92 (51) 111-79438 for Islamabad 24/7 priority dispatch.');
    });
  };

  const handleWhatsApp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    Linking.openURL('https://wa.me/923015558942').catch(() => {
      Alert.alert('WhatsApp Support', 'Direct WhatsApp line: +92 301 555-8942');
    });
  };

  const handleSubmitTicket = () => {
    if (!ticketDetails.trim()) {
      Alert.alert('Details Required', 'Please describe your inquiry or order issue.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    Alert.alert(
      'Dispatch Ticket Filed',
      `Ticket #${Math.floor(100000 + Math.random() * 900000)} created. A dispatch supervisor will call or message your registered phone number within 3 minutes.`,
      [{ text: 'Understood', onPress: () => { setTicketSubject(''); setTicketDetails(''); } }]
    );
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
              24/7 Help Desk
            </AppText>
            <AppText variant="micro" color="secondary">
              Islamabad Central Dispatch & Resolutions
            </AppText>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Live Status Card */}
        <View
          style={[
            styles.liveStatusCard,
            {
              backgroundColor: isDark ? '#161922' : '#FFFFFF',
              borderColor: colors.borderSubtle,
            },
          ]}
        >
          <View style={styles.liveStatusHeader}>
            <View style={styles.pulseContainer}>
              <View style={styles.pulseDot} />
              <Text style={styles.pulseText}>Live Dispatch Active</Text>
            </View>
            <Text style={[styles.avgWaitText, { color: colors.textSecondary }]}>
              Avg response: &lt; 2 mins
            </Text>
          </View>
          <Text style={[styles.liveStatusTitle, { color: colors.textPrimary }]}>
            Need immediate assistance with an ongoing order?
          </Text>
          <Text style={[styles.liveStatusDesc, { color: colors.textSecondary }]}>
            Our Islamabad telemetry desk has live radio and GPS communication with all active riders in F, G, and E sectors.
          </Text>

          {/* Quick Call & Chat Buttons */}
          <View style={styles.channelRow}>
            <Pressable
              onPress={handleCallSupport}
              style={[styles.channelBtn, { backgroundColor: colors.accent }]}
            >
              <Ionicons name="call" size={16} color="#FFFFFF" />
              <Text style={styles.channelBtnText}>Call Hotline</Text>
            </Pressable>

            <Pressable
              onPress={handleWhatsApp}
              style={[styles.channelBtn, { backgroundColor: '#10B981' }]}
            >
              <Ionicons name="logo-whatsapp" size={16} color="#FFFFFF" />
              <Text style={styles.channelBtnText}>WhatsApp</Text>
            </Pressable>
          </View>
        </View>

        {/* ── Support Preferences with StylishToggle ── */}
        <View style={styles.section}>
          <AppText variant="sectionTitle" style={styles.sectionTitle}>
            Dispatch Preferences
          </AppText>

          <View style={[styles.card, { backgroundColor: colors.surfaceRaised, borderColor: colors.borderSubtle }]}>
            {/* Priority Escalation Toggle */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleTextCol}>
                <Text style={[styles.toggleTitle, { color: colors.textPrimary }]}>
                  🚨 Priority SOS Escalation
                </Text>
                <Text style={[styles.toggleDesc, { color: colors.textSecondary }]}>
                  Tag your account tickets for immediate supervisor intervention during rush hours
                </Text>
              </View>
              <StylishToggle
                value={priorityEscalation}
                onValueChange={setPriorityEscalation}
                activeColor="#EF4444"
                icon="warning"
              />
            </View>

            <View style={[styles.rowDivider, { backgroundColor: colors.borderSubtle }]} />

            {/* Auto SMS Updates Toggle */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleTextCol}>
                <Text style={[styles.toggleTitle, { color: colors.textPrimary }]}>
                  📱 Dispatch SMS Telemetry Alerts
                </Text>
                <Text style={[styles.toggleDesc, { color: colors.textSecondary }]}>
                  Receive real-time carrier arrival SMS updates even when your phone is offline
                </Text>
              </View>
              <StylishToggle
                value={autoSmsUpdates}
                onValueChange={setAutoSmsUpdates}
                activeColor="#10B981"
                icon="chatbox-ellipses"
              />
            </View>
          </View>
        </View>

        {/* ── Quick Issue Shortcuts ── */}
        <View style={styles.section}>
          <AppText variant="sectionTitle" style={styles.sectionTitle}>
            Quick Resolution Shortcuts
          </AppText>

          <View style={styles.shortcutsGrid}>
            <Pressable
              onPress={() => router.navigate('/tracking/order-sw-9842' as any)}
              style={[styles.shortcutCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.borderSubtle }]}
            >
              <View style={[styles.shortcutIconCircle, { backgroundColor: 'rgba(255, 107, 0, 0.12)' }]}>
                <Ionicons name="bicycle" size={20} color={colors.accent} />
              </View>
              <Text style={[styles.shortcutTitle, { color: colors.textPrimary }]}>Where is my Rider?</Text>
              <Text style={[styles.shortcutDesc, { color: colors.textSecondary }]}>Open active GPS tracker</Text>
            </Pressable>

            <Pressable
              onPress={() => setTicketSubject('Missing or Damaged Item')}
              style={[styles.shortcutCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.borderSubtle }]}
            >
              <View style={[styles.shortcutIconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.12)' }]}>
                <Ionicons name="cube-outline" size={20} color="#EF4444" />
              </View>
              <Text style={[styles.shortcutTitle, { color: colors.textPrimary }]}>Missing / Damaged</Text>
              <Text style={[styles.shortcutDesc, { color: colors.textSecondary }]}>Claim instant wallet refund</Text>
            </Pressable>

            <Pressable
              onPress={() => setTicketSubject('Wrong Drop-off Address')}
              style={[styles.shortcutCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.borderSubtle }]}
            >
              <View style={[styles.shortcutIconCircle, { backgroundColor: 'rgba(59, 130, 246, 0.12)' }]}>
                <Ionicons name="location-outline" size={20} color="#3B82F6" />
              </View>
              <Text style={[styles.shortcutTitle, { color: colors.textPrimary }]}>Address Change</Text>
              <Text style={[styles.shortcutDesc, { color: colors.textSecondary }]}>Reroute active courier</Text>
            </Pressable>

            <Pressable
              onPress={() => setTicketSubject('Payment & Raast Inquiry')}
              style={[styles.shortcutCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.borderSubtle }]}
            >
              <View style={[styles.shortcutIconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
                <Ionicons name="card-outline" size={20} color="#10B981" />
              </View>
              <Text style={[styles.shortcutTitle, { color: colors.textPrimary }]}>Payment Dispute</Text>
              <Text style={[styles.shortcutDesc, { color: colors.textSecondary }]}>JazzCash / Bank reconciliation</Text>
            </Pressable>
          </View>
        </View>

        {/* ── Frequently Asked Questions ── */}
        <View style={styles.section}>
          <AppText variant="sectionTitle" style={styles.sectionTitle}>
            Frequently Answered Questions
          </AppText>

          <View style={styles.faqList}>
            {FAQS.map((faq, index) => {
              const isExpanded = expandedFaq === index;
              return (
                <Pressable
                  key={index}
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    setExpandedFaq(isExpanded ? null : index);
                  }}
                  style={[
                    styles.faqCard,
                    {
                      backgroundColor: colors.surfaceRaised,
                      borderColor: colors.borderSubtle,
                    },
                  ]}
                >
                  <View style={styles.faqHeader}>
                    <Text style={[styles.faqQuestion, { color: colors.textPrimary }]}>
                      {faq.q}
                    </Text>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={colors.textSecondary}
                    />
                  </View>
                  {isExpanded && (
                    <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                      {faq.a}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ── File a Dispatch Ticket ── */}
        <View style={styles.section}>
          <AppText variant="sectionTitle" style={styles.sectionTitle}>
            Message Dispatch Directly
          </AppText>

          <View style={[styles.ticketCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.borderSubtle }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Subject</Text>
            <TextInput
              value={ticketSubject}
              onChangeText={setTicketSubject}
              placeholder="e.g. Order #SW-9842 rider issue"
              placeholderTextColor={colors.textTertiary}
              style={[styles.ticketInput, { color: colors.textPrimary, borderColor: colors.borderSubtle }]}
            />

            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Details & Location</Text>
            <TextInput
              value={ticketDetails}
              onChangeText={setTicketDetails}
              multiline
              numberOfLines={4}
              placeholder="Describe what happened or what you need assistance with..."
              placeholderTextColor={colors.textTertiary}
              style={[
                styles.ticketInput,
                styles.textArea,
                { color: colors.textPrimary, borderColor: colors.borderSubtle },
              ]}
            />

            <View style={{ marginTop: Spacing.md }}>
              <PrimaryButton label="Submit to Dispatch" onPress={handleSubmitTicket} />
            </View>
          </View>
        </View>
      </ScrollView>
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
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  liveStatusCard: {
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1.5,
    marginBottom: Spacing.lg,
  },
  liveStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pulseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  pulseText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
  avgWaitText: {
    fontSize: 11,
  },
  liveStatusTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  liveStatusDesc: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: Spacing.md,
  },
  channelRow: {
    flexDirection: 'row',
    gap: 10,
  },
  channelBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: Radius.full,
    gap: 6,
  },
  channelBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
  },
  card: {
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  toggleTextCol: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  toggleTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  toggleDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 10,
  },
  shortcutsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  shortcutCard: {
    width: '48%',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
  },
  shortcutIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  shortcutTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  shortcutDesc: {
    fontSize: 10,
  },
  faqList: {
    gap: 8,
  },
  faqCard: {
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    paddingRight: Spacing.sm,
  },
  faqAnswer: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150,150,150,0.15)',
    paddingTop: 8,
  },
  ticketCard: {
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 6,
  },
  ticketInput: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 8,
    fontSize: 13,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
});
