import { schoolTheme } from '@/components/school/theme';

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import ReportsScreen from '@/components/school/reports-screen';

export default function ReportsPage() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={schoolTheme.primary} />
        </Pressable>

        <Text style={styles.title}>Reports</Text>

        <View style={styles.spacer} />

        <Pressable>
          <Ionicons name="search-outline" size={20} color={schoolTheme.primary} />
        </Pressable>

        <Pressable accessibilityLabel="Open student profiles" onPress={() => router.push('/profile')} style={styles.avatar}>
          <Ionicons name="person-outline" size={15} color={schoolTheme.primary} />
        </Pressable>
      </View>

      <ReportsScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: schoolTheme.background,
  },
  header: {
    height: 52,
    backgroundColor: schoolTheme.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: schoolTheme.border,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: schoolTheme.primary,
  },
  spacer: {
    flex: 1,
  },
  avatar: {
    height: 28,
    width: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: schoolTheme.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
