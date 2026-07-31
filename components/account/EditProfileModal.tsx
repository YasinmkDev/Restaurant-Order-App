import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';

interface EditProfileModalProps {
  visible: boolean;
  initialName: string;
  initialPhone: string;
  initialEmail: string;
  onClose: () => void;
  onSave: (data: { name: string; phone: string; email: string }) => void;
}

export function EditProfileModal({
  visible,
  initialName,
  initialPhone,
  initialEmail,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const { colors, isDark } = useTheme();

  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [email, setEmail] = useState(initialEmail);

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    onSave({ name, phone, email });
    onClose();
  };

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
          {/* Header */}
          <View style={styles.sheetHeader}>
            <Text
              style={[
                styles.sheetTitle,
                { color: isDark ? colors.textPrimary : '#1E293B' },
              ]}
            >
              Edit Profile
            </Text>

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
            {/* Field 1: Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>FULL NAME</Text>
              <View
                style={[
                  styles.inputBox,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F8FAFC',
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                  },
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={16}
                  color={isDark ? '#94A3B8' : '#64748B'}
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter full name"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  style={[
                    styles.inputField,
                    { color: isDark ? colors.textPrimary : '#1E293B' },
                  ]}
                />
              </View>
            </View>

            {/* Field 2: Phone */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>MOBILE PHONE</Text>
              <View
                style={[
                  styles.inputBox,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F8FAFC',
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                  },
                ]}
              >
                <Ionicons
                  name="call-outline"
                  size={16}
                  color={isDark ? '#94A3B8' : '#64748B'}
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+92 300 1234567"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  keyboardType="phone-pad"
                  style={[
                    styles.inputField,
                    { color: isDark ? colors.textPrimary : '#1E293B' },
                  ]}
                />
              </View>
            </View>

            {/* Field 3: Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
              <View
                style={[
                  styles.inputBox,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F8FAFC',
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                  },
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={16}
                  color={isDark ? '#94A3B8' : '#64748B'}
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@example.com"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={[
                    styles.inputField,
                    { color: isDark ? colors.textPrimary : '#1E293B' },
                  ]}
                />
              </View>
            </View>

            {/* Save Button */}
            <Pressable
              onPress={handleSave}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Save profile changes"
              style={[styles.saveBtn, { backgroundColor: colors.accent }]}
            >
              <Text style={styles.saveBtnText}>Save Profile Changes</Text>
            </Pressable>
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
    paddingBottom: 28,
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
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
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
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  inputField: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  saveBtn: {
    paddingVertical: 13,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
