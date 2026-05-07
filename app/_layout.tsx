import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { ChaletProvider } from "./page/screens/components/ChaletContext";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChaletProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="booking" />
          <Stack.Screen name="chalet-details" />
          <Stack.Screen name="add-edit-chalet" />
        </Stack>
      </ChaletProvider>
    </QueryClientProvider>
  );
}