import GymFeatureGate from '@/components/gym-feature-gate';

import React from "react";
import { Stack } from "expo-router";

import GymMembersScreen from "@/components/gym/gym-members-screen";

export default function GymMembersPage() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <GymFeatureGate feature="members"><GymMembersScreen /></GymFeatureGate>
    </>
  );
}
