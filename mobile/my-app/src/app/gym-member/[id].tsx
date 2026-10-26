import GymFeatureGate from '@/components/gym-feature-gate';

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

import MemberProfileScreen from "@/components/gym/member-profile-screen";
import { gymMembers } from "@/components/gym/members-data";

export default function GymMemberProfilePage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const member = gymMembers.find(
    (item) => item.id === id
  );

  if (!member) {
    return (
      <View style={styles.emptyContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.emptyText}>
          Member not found
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <GymFeatureGate feature="members"><MemberProfileScreen
        key={member.id}
        member={member}
      /></GymFeatureGate>
    </>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F9FC",
  },
  emptyText: {
    fontSize: 17,
    color: "#475467",
  },
});
