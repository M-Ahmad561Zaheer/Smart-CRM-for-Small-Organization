import GymFeatureGate from '@/components/gym-feature-gate';

import React from "react";
import { Stack } from "expo-router";

import GymReportsScreen from "@/components/gym/gym-reports-screen";

export default function GymReportsPage() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <GymFeatureGate feature="reports"><GymReportsScreen /></GymFeatureGate>
    </>
  );
}
