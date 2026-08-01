import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';
import { OrderStatus } from '../../types/order';
import {
  ORDER_STATUS_ORDER,
  ORDER_STATUS_METADATA,
  getStatusStepIndex,
} from '../../lib/orderStatus';

interface DeliveryTimelineProps {
  currentStatus: OrderStatus;
}

export function DeliveryTimeline({ currentStatus }: DeliveryTimelineProps) {
  const { colors, isDark } = useTheme();
  const currentStep = getStatusStepIndex(currentStatus);

  return (
    <View style={styles.container}>
      {ORDER_STATUS_ORDER.map((stageKey, idx) => {
        const meta = ORDER_STATUS_METADATA[stageKey];
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep;
        const isUpcoming = idx > currentStep;
        const isLast = idx === ORDER_STATUS_ORDER.length - 1;

        return (
          <View key={stageKey} style={styles.stepRow}>
            {/* ── Indicator column ── */}
            <View style={styles.indicatorCol}>
              <View
                style={[
                  styles.circle,
                  {
                    backgroundColor: isCompleted
                      ? '#10B981'
                      : isCurrent
                      ? colors.accent
                      : isDark
                      ? 'rgba(255,255,255,0.06)'
                      : '#F1F5F9',
                    borderColor: isCompleted
                      ? '#10B981'
                      : isCurrent
                      ? colors.accent
                      : isDark
                      ? 'rgba(255,255,255,0.1)'
                      : '#CBD5E1',
                  },
                ]}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                ) : isCurrent ? (
                  <View style={styles.activeDot} />
                ) : (
                  <View style={styles.pendingDot} />
                )}
              </View>

              {!isLast && (
                <View
                  style={[
                    styles.line,
                    {
                      backgroundColor: isCompleted
                        ? '#10B981'
                        : isDark
                        ? 'rgba(255,255,255,0.1)'
                        : '#E2E8F0',
                    },
                  ]}
                />
              )}
            </View>

            {/* ── Content column ── */}
            <View style={styles.contentCol}>
              <View style={styles.labelRow}>
                <Text
                  style={[
                    styles.stageTitle,
                    {
                      color: isCurrent
                        ? colors.accent
                        : isCompleted
                        ? isDark
                          ? colors.textPrimary
                          : '#1E293B'
                        : '#94A3B8',
                      fontWeight: isCurrent ? '800' : isCompleted ? '700' : '600',
                    },
                  ]}
                >
                  {meta.label}
                </Text>

                {isCurrent && (
                  <View style={[styles.activeBadge, { backgroundColor: 'rgba(255, 107, 0, 0.12)' }]}>
                    <View style={[styles.pulseBeacon, { backgroundColor: colors.accent }]} />
                    <Text style={[styles.activeBadgeText, { color: colors.accent }]}>
                      IN PROGRESS
                    </Text>
                  </View>
                )}
              </View>

              <Text
                style={[
                  styles.desc,
                  {
                    color: isUpcoming ? '#94A3B8' : isDark ? '#94A3B8' : '#64748B',
                  },
                ]}
              >
                {meta.description}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.xs,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 52,
  },
  indicatorCol: {
    width: 24,
    alignItems: 'center',
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FFFFFF',
  },
  pendingDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#94A3B8',
  },
  line: {
    width: 2,
    flex: 1,
    marginVertical: 3,
    borderRadius: 1,
  },
  contentCol: {
    flex: 1,
    marginLeft: 12,
    paddingBottom: Spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  stageTitle: {
    fontSize: 13.5,
    letterSpacing: -0.2,
    flex: 1,
    marginRight: 6,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  pulseBeacon: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  activeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  desc: {
    fontSize: 11.5,
    lineHeight: 16,
  },
});
