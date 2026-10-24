
import React from "react";
import { Stack } from "expo-router";

import GymDashboard from "@/components/gym/gym-dashboard";

export default function GymDashboardPage() {
  return (
    <>
      <Stack.Screen
        options={{ headerShown: false }}
      />
      <GymDashboard />
    </>
  );
}
