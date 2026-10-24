
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { Stack, router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

import FeeManagementScreen from "@/components/school/fee-management-screen";

export default function FeeManagementPage() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color="#222222"
          />
        </Pressable>

        <Text style={styles.title}>
          Fee Management
        </Text>

        <View style={styles.spacer} />

        <Pressable
          onPress={() => {}}
          style={styles.iconButton}
        >
          <Ionicons
            name="search-outline"
            size={20}
            color="#222222"
          />
        </Pressable>

        <Pressable
          onPress={() => {}}
          style={styles.iconButton}
        >
          <Ionicons
            name="person-circle-outline"
            size={21}
            color="#222222"
          />
        </Pressable>
      </View>

      <FeeManagementScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 3,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#171717",
  },
  spacer: {
    flex: 1,
  },
  iconButton: {
    padding: 3,
  },
});
