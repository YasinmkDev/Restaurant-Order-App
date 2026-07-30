import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';
import { ActivityFeedItem } from './ActivityCard';

interface ActivityDetailModalProps {
  item: ActivityFeedItem | null;
  visible: boolean;
  onClose: () => void;
  onAction?: (item: ActivityFeedItem) => void;
}

export function ActivityDetailModal({
  item,
  visible,
  onClose,
  onAction,
}: ActivityDetailModalProps) {
  const { colors, isDark } = useTheme();

  if (!item) return null;

  const handleAction = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onClose();
    if (onAction) onAction(item);
  };

  const defaultBg =
    item.category === 'orders'
      ? 'rgba(249, 115, 22, 0.12)'
      : item.category === 'payments'
      ? 'rgba(16, 185, 129, 0.12)'
      : item.category === 'rewards'
      ? 'rgba(245, 158, 11, 0.12)'
      : 'rgba(59, 130, 246, 0.12)';

  const defaultColor =
    item.category === 'orders'
      ? colors.accent
      : item.category === 'payments'
      ? '#10B981'
      : item.category === 'rewards'
      ? '#F59E0B'
      : '#3B82F6';

  const iconBg = item.iconBg || defaultBg;
  const iconColor = item.iconColor || defaultColor;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.scrimOverlay}>
        <Pressable style={styles.backdropTouch} onPress={onClose} />

        <View
          style={[
            styles.sheetContainer,
            {
              backgroundColor: isDark ? colors.surfaceRaised : '#FFFFFF',
              borderColor: isDark ? colors.borderSubtle : 'rgba(0,0,0,0.08)',
            },
          ]}
        >
          {/* ── Top Bar ── */}
          <View style={styles.sheetHeader}>
            <View style={styles.categoryPill}>
              <Text style={[styles.categoryText, { color: iconColor }]}>
                {item.category.toUpperCase()}
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              hitSlop={10}
              style={[
                styles.closeButton,
                { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9' },
              ]}
            >
              <Ionicons name="close" size={18} color={isDark ? '#E2E8F0' : '#475569'} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* ── Icon & Title Header ── */}
            <View style={styles.heroBox}>
              <View style={[styles.largeIconCircle, { backgroundColor: iconBg }]}>
                <Ionicons name={item.icon} size={32} color={iconColor} />
              </View>
              <Text
                style={[
                  styles.titleText,
                  { color: isDark ? colors.textPrimary : '#1E293B' },
                ]}
              >
                {item.title}
              </Text>
              <Text style={styles.timestampText}>{item.timestamp}</Text>
            </View>

            {/* ── Subtitle / Details description ── */}
            <View
              style={[
                styles.descriptionBox,
                {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
                },
              ]}
            >
              <Text
                style={[
                  styles.descriptionText,
                  { color: isDark ? colors.textSecondary : '#475569' },
                ]}
              >
                {item.subtitle}
              </Text>
            </View>

            {/* ── Metadata details (if present) ── */}
            {item.metadata && (
              <View style={styles.metaSection}>
                {item.metadata.referenceId && (
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Reference ID</Text>
                    <Text
                      style={[
                        styles.metaValue,
                        { color: isDark ? colors.textPrimary : '#1E293B' },
                      ]}
                    >
                      {item.metadata.referenceId}
                    </Text>
                  </View>
                )}

                {item.amountText && (
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Amount</Text>
                    <Text
                      style={[
                        styles.metaValue,
                        {
                          color:
                            item.amountType === 'credit'
                              ? '#10B981'
                              : isDark
                              ? colors.textPrimary
                              : '#1E293B',
                          fontWeight: '800',
                        },
                      ]}
                    >
                      {item.amountText}
                    </Text>
                  </View>
                )}

                {item.metadata.details?.map((detail, idx) => (
                  <View key={`detail-${idx}`} style={styles.detailBulletRow}>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={14}
                      color="#10B981"
                      style={{ marginRight: 6, marginTop: 2 }}
                    />
                    <Text style={styles.detailBulletText}>{detail}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* ── Action Buttons ── */}
            <View style={styles.buttonStack}>
              {item.actionLabel && (
                <Pressable
                  onPress={handleAction}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={item.actionLabel}
                  style={[
                    styles.primaryActionBtn,
                    { backgroundColor: colors.accent },
                  ]}
                >
                  <Text style={styles.primaryActionText}>{item.actionLabel}</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </Pressable>
              )}

              <Pressable
                onPress={onClose}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Close notification details"
                style={[
                  styles.dismissBtn,
                  { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9' },
                ]}
              >
                <Text
                  style={[
                    styles.dismissBtnText,
                    { color: isDark ? '#E2E8F0' : '#475569' },
                  ]}
                >
                  Dismiss
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrimOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  backdropTouch: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheetContainer: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderWidth: 1,
    maxHeight: '80%',
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  heroBox: {
    alignItems: 'center',
    marginBottom: 16,
  },
  largeIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  titleText: {
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  timestampText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  descriptionBox: {
    padding: 14,
    borderRadius: Radius.lg,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  metaSection: {
    gap: 8,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  metaLabel: {
    fontSize: 12.5,
    color: '#94A3B8',
    fontWeight: '600',
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  detailBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 3,
  },
  detailBulletText: {
    flex: 1,
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
  },
  buttonStack: {
    gap: 10,
    paddingTop: 8,
    paddingBottom: 8,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: Radius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  dismissBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: Radius.lg,
  },
  dismissBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
