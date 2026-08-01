import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Radius } from '../ui/theme';

interface CourierMarkerProps {
  bearing?: number;
}

export function CourierMarker({ bearing = 0 }: CourierMarkerProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Outer vehicle container with bearing rotation */}
      <View
        style={[
          styles.marker,
          {
            backgroundColor: '#1E1E1B',
            borderColor: colors.accent,
            transform: [{ rotate: `${bearing}deg` }],
          },
        ]}
      >
        <Ionicons name="bicycle" size={16} color="#FFFFFF" />
        {/* Subtle Swift Orange direction pointer */}
        <View style={[styles.headingPointer, { backgroundColor: colors.accent }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  headingPointer: {
    position: 'absolute',
    top: -3,
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
});
