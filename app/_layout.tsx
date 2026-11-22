// app/_layout.tsx

import React from "react";
import { Stack } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import HeaderRight from "@/components/HeaderRight";
import HeaderLeft from "@/components/HeaderLeft";
import { AuthProvider, useAuth } from "../context/AuthContext";

function RootLayoutNav() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6E9ECF" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        title: "",
        headerLeft: () => <HeaderLeft />,
        headerRight: () => <HeaderRight />,
        headerTitleStyle: { fontWeight: "bold" },
        headerStyle: {
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
        }
      }}
    />
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}