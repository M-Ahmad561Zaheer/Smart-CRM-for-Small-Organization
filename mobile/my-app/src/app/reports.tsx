
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
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </Pressable>

        <Text style={styles.title}>Reports</Text>

        <View style={styles.spacer} />

        <Pressable>
          <Ionicons name="search-outline" size={20} color="#374151" />
        </Pressable>

        <Pressable style={styles.avatar}>
          <Ionicons name="person-outline" size={15} color="#2863ED" />
        </Pressable>
      </View>

      <ReportsScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    height: 52,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0755CC',
  },
  spacer: {
    flex: 1,
  },
  avatar: {
    height: 28,
    width: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D8DEEB',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
