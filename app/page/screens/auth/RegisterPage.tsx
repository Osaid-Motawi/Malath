import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EyeIcon, EyeOffIcon } from "../components/CustomIcon";
import { LogoIcon } from "../components/CustomIcon";
import { useAuth } from "@/hooks/useAuth";

const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { loading, error, register } = useAuth();

  const handleRegister = async () => {
    await register(firstName, lastName, email, password, confirmPassword);
  };
  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.outer} showsVerticalScrollIndicator={false}>
          <View style={s.card}>

            <View style={s.left}>
              <Text style={s.welcome}>Welcome to</Text>
              <View style={s.logoCircle}>
              </View>
              <Text style={s.appName}>Malath</Text>
              <Text style={s.desc}>Your trusted platform for chalet bookings across the region.</Text>
            </View>

            <View style={s.right}>
              <Text style={s.formTitle}>Create your account</Text>

              <View style={s.nameRow}>
                <View style={{ flex: 1 }}>
                  <Text style={s.label}>First Name</Text>
                  <View style={s.inputRow}>
                    <TextInput style={s.input} placeholder="First name" placeholderTextColor="#aaa"
                      value={firstName} onChangeText={setFirstName} />
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.label}>Last Name</Text>
                  <View style={s.inputRow}>
                    <TextInput style={s.input} placeholder="Last name" placeholderTextColor="#aaa"
                      value={lastName} onChangeText={setLastName} />
                  </View>
                </View>
              </View>

              <Text style={s.label}>E-mail Address</Text>
              <View style={s.inputRow}>
                <TextInput style={s.input} placeholder="Enter your mail" placeholderTextColor="#aaa"
                  keyboardType="email-address" autoCapitalize="none"
                  value={email} onChangeText={setEmail} />
              </View>

              <Text style={s.label}>Password</Text>
              <View style={s.inputRow}>
                <TextInput style={s.input} placeholder="Enter your password" placeholderTextColor="#aaa"
                  secureTextEntry={!showPassword} value={password} onChangeText={setPassword} />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeIcon size={18} color="#aaa" /> : <EyeOffIcon size={18} color="#aaa" />}
                </TouchableOpacity>
              </View>

              <Text style={s.label}>Confirm Password</Text>
              <View style={s.inputRow}>
                <TextInput style={s.input} placeholder="Confirm your password" placeholderTextColor="#aaa"
                  secureTextEntry={!showConfirm} value={confirmPassword} onChangeText={setConfirmPassword} />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeIcon size={18} color="#aaa" /> : <EyeOffIcon size={18} color="#aaa" />}
                </TouchableOpacity>
              </View>

              {!!error && <Text style={s.error}>{error}</Text>}

              <View style={s.btnRow}>
                <TouchableOpacity style={[s.btnPrimary, loading && s.btnDisabled]} onPress={handleRegister} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={s.btnPrimaryText}>Sign Up</Text>}
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#e8f0fb" },
  outer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    flexDirection: "row",
    width: "100%",
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  left: {
    flex: 1,
    backgroundColor: "#4F2396",
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  welcome: { fontSize: 18, color: "#fff", fontWeight: "500" },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  appName: { fontSize: 28, color: "#fff", fontWeight: "bold" },
  desc: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    lineHeight: 18,
  },
  right: {
    flex: 1.3,
    padding: 24,
    gap: 8,
    justifyContent: "center",
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  nameRow: { flexDirection: "row", gap: 10 },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 2,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1.5,
    borderBottomColor: "#4F2396",
    paddingBottom: 4,
    marginBottom: 6,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: "#1a1a1a",
    paddingVertical: 4,
    outlineStyle: "none" as any, 
  },
  error: {
    color: "#DC2626",
    fontSize: 12,
    textAlign: "center",
  },
  btnRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: "#4F2396",
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
  },
  btnDisabled: {
    backgroundColor: "#6B7280",
  },
  btnPrimaryText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  switchText: {
    marginTop: 12,
    textAlign: "center",
    color: "#4F2396",
    fontWeight: "600",
  },
});
export default RegisterPage;