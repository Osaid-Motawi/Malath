import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/hooks/useAuth";
export default function ResetPasswordPage() {
  const { email } = useLocalSearchParams();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const { resetUserPassword, error, loading } = useAuth();
  const confirmRef = useRef<TextInput>(null);
const handleReset = async () => {
  const success =
    await resetUserPassword(
      email as string,
      password,
      confirm
    );

  if (success) {
    Alert.alert(
      "Success",
      "Password updated"
    );

    router.replace("/login");
  }
};

  return (
<View style={styles.container}>

<View style={styles.header}>
  <TouchableOpacity onPress={() => router.back()}>
    <Ionicons name="arrow-back" size={24} color="#4F2396" />
  </TouchableOpacity>

  <Text style={styles.headerTitle}>Forgot Password</Text>

  <View style={{ width: 24 }} />
</View>

  <Text style={styles.subtitle}>
    Create a new password
  </Text>

  <Text style={styles.label}>
    New Password
  </Text>

<TextInput
  style={styles.input}
  placeholder="Enter new password"
  placeholderTextColor="#999"
  secureTextEntry
  value={password}
  onChangeText={setPassword}
  returnKeyType="next"
  onSubmitEditing={() => confirmRef.current?.focus()}
/>

  <Text style={styles.label}>
    Confirm Password
  </Text>

  <TextInput
  ref={confirmRef}
  style={styles.input}
  placeholder="Confirm password"
  placeholderTextColor="#999"
  secureTextEntry
  value={confirm}
  onChangeText={setConfirm}
  returnKeyType="done"
  onSubmitEditing={handleReset}
/>
    {!!error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}
  <TouchableOpacity
    style={[
          styles.button,
          loading && styles.disabledButton,
        ]}
    onPress={handleReset}
    disabled={loading}
  >
            {loading ? (
          <ActivityIndicator
            color="#fff"
          />
        ) : (
    <Text style={styles.buttonText}>
      Save Password
    </Text>
        )}
  </TouchableOpacity>
</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#F4F3F8",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#4F2396",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 30,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4F2396",
    marginBottom: 8,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4F2396",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 15,
    marginBottom: 20,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  error: {
    color: "#DC2626",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "600",
  },

  button: {
    backgroundColor: "#4F2396",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 10,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});