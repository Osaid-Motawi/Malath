import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator, KeyboardAvoidingView, Platform,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { loginUser, logoutUser } from "../../services/authService";
import { EyeIcon, EyeOffIcon, LogoutIcon } from "../components/CustomIcon";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email.trim()) { setError("Please enter your email"); return; }
    if (!password.trim()) { setError("Please enter your password"); return; }

    setLoading(true);
    try {
      await loginUser(email.trim(), password);
      router.replace("/(tabs)");
    } catch (e: any) {
      setError(e.message || "Something went wrong, try again");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/");
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={s.container}>

        <Text style={s.welcome}>Welcome to MALATH</Text>
        <Text style={s.title}>Login</Text>

        <Text style={s.label}>E-mail</Text>
        <TextInput
          style={s.input}
          placeholder="Enter your email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={s.label}>Password</Text>
        <View style={s.passwordRow}>
          <TextInput
            style={[s.input, { flex: 1, borderWidth: 0 }]}
            placeholder="Enter your password"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={s.eyeBtn}>
            {showPassword ? <EyeIcon size={20} color="#aaa" /> : <EyeOffIcon size={20} color="#aaa" />}
          </TouchableOpacity>
        </View>


        <TouchableOpacity style={[s.btn, loading && s.btnDisabled]} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Login</Text>}
        </TouchableOpacity>



        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={s.link}>Don't have an account? <Text style={s.linkBold}>Sign up</Text></Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
          <LogoutIcon size={18} color="#EF4444" />
          <Text style={s.logoutText}>Logout</Text>
        </TouchableOpacity>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: "#F5F0EB" },
  container:   { flex: 1, paddingHorizontal: 28, justifyContent: "center", gap: 10 },
  welcome:     { fontSize: 22, fontWeight: "bold", color: "#18251D", textAlign: "center" },
  title:       { fontSize: 28, fontWeight: "bold", color: "#18251D", textAlign: "center", marginBottom: 8 },
  label:       { fontSize: 13, fontWeight: "600", color: "#374151" },
  input:       { borderWidth: 1, borderColor: "#E2D9D0", borderRadius: 10,
                 padding: 14, fontSize: 15, color: "#1a1a1a", backgroundColor: "#fff" },
  passwordRow: { flexDirection: "row", alignItems: "center", borderWidth: 1,
                 borderColor: "#E2D9D0", borderRadius: 10, paddingHorizontal: 14, backgroundColor: "#fff" },
  eyeBtn:      { padding: 8 },
  forgotBtn:   { alignSelf: "flex-end" },
  forgotText:  { fontSize: 13, color: "#7C5C3E", fontWeight: "500" },
  error:       { color: "#DC2626", fontSize: 13, textAlign: "center" },
  btn:         { backgroundColor: "#2C1A12", borderRadius: 25, padding: 16, alignItems: "center", marginTop: 4 },
  btnDisabled: { backgroundColor: "#6B7280" },
  btnText:     { color: "#fff", fontSize: 16, fontWeight: "bold" },
  orText:      { textAlign: "center", color: "#9CA3AF", fontSize: 13, marginVertical: 4 },
  googleBtn:   { flexDirection: "row", alignItems: "center", justifyContent: "center",
                 borderWidth: 1.5, borderColor: "#4285F4", borderRadius: 25,
                 padding: 14, backgroundColor: "#fff" },
  googleText:  { fontSize: 15, color: "#4285F4", fontWeight: "600" },
  link:        { fontSize: 14, color: "#6B7280", textAlign: "center", marginTop: 4 },
  linkBold:    { color: "#7C5C3E", fontWeight: "bold" },
  logoutBtn:   { flexDirection: "row", alignItems: "center", justifyContent: "center",
                 gap: 8, padding: 12, borderWidth: 1, borderColor: "#EF4444",
                 borderRadius: 25, marginTop: 4 },
  logoutText:  { color: "#EF4444", fontWeight: "bold", fontSize: 14 },
});