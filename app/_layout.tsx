import { Stack } from "expo-router";
import { ChaletProvider } from "./page/screens/components/ChaletContext";

export default function RootLayout() {
  return (
    <ChaletProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="chalet-details" />
      </Stack>
    </ChaletProvider>
  );
}