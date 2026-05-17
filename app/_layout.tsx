import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { ChaletProvider } from "./page/screens/components/ChaletContext";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  useEffect(() => {
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };

    hideSplash();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ChaletProvider>

        <Stack screenOptions={{ headerShown: false }}>

          <Stack.Screen name="index" />

          <Stack.Screen name="(tabs)" />

          <Stack.Screen name="login" />

          <Stack.Screen name="register" />

          <Stack.Screen name="chalet-details" />

          <Stack.Screen name="add-edit-chalet" />

          <Stack.Screen name="ownerdashboard" />

        </Stack>

      </ChaletProvider>
    </QueryClientProvider>
  );
}