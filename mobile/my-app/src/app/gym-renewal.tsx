
import React from "react";
import { Stack } from "expo-router";

import MembershipRenewalScreen from "@/components/gym/membership-renewal-screen";

export default function GymRenewalPage() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MembershipRenewalScreen />
    </>
  );
}
