
import React from "react";
import { Stack } from "expo-router";

import AddMemberScreen from "@/components/gym/add-member-screen";

export default function GymAddMemberPage() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AddMemberScreen />
    </>
  );
}
