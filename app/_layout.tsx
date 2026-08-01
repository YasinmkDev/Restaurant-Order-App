import React from 'react';
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';

export default function RootLayout() {
  const { colors } = useTheme();

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="checkout" options={{ title: 'Checkout' }} />
          <Stack.Screen
            name="product/[productId]"
            options={{
              presentation: 'modal',
              title: 'Item Details',
            }}
          />
          <Stack.Screen
            name="category/[categoryKey]"
            options={{
              title: 'Category',
            }}
          />
          <Stack.Screen
            name="products"
            options={{
              title: 'All Products',
            }}
          />
          <Stack.Screen
            name="tracking/[orderId]"
            options={{
              title: 'Live Tracking',
            }}
          />
          <Stack.Screen
            name="favorites"
            options={{
              title: 'Saved Favorites',
            }}
          />
          <Stack.Screen
            name="support"
            options={{
              title: 'Help Desk',
            }}
          />
          <Stack.Screen
            name="addresses"
            options={{
              title: 'Saved Addresses',
            }}
          />
          <Stack.Screen
            name="dietary"
            options={{
              title: 'Dietary Preferences',
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
