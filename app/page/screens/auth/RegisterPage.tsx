import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { registerUser } from "../../services/authService";
import { EyeIcon, EyeOffIcon } from "../components/CustomIcon";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");
    if (!firstName.trim() || !lastName.trim()) { setError("Please enter your first and last name"); return; }
    if (!email.trim()) { setError("Please enter your email"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }

    setLoading(true);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      await registerUser(fullName, email.trim(), password);
      router.replace("/(tabs)");
    } catch (e: any) {
      setError(e.message || "Something went wrong, try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>

          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Text style={s.backIcon}>←</Text>
          </TouchableOpacity>

          <Text style={s.welcome}>Welcome to MALATH</Text>
          <Text style={s.title}>Create Account</Text>

          <View style={s.row}>
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={s.label}>First Name</Text>
              <TextInput style={s.input} placeholder="Mohammed" placeholderTextColor="#aaa"
                value={firstName} onChangeText={setFirstName} />
            </View>
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={s.label}>Last Name</Text>
              <TextInput style={s.input} placeholder="Ahmad" placeholderTextColor="#aaa"
                value={lastName} onChangeText={setLastName} />
            </View>
          </View>

          <Text style={s.label}>E-mail</Text>
          <TextInput style={s.input} placeholder="Enter your email" placeholderTextColor="#aaa"
            keyboardType="email-address" autoCapitalize="none"
            value={email} onChangeText={setEmail} />

          <Text style={s.label}>Password</Text>
          <View style={s.passwordRow}>
            <TextInput style={[s.input, { flex: 1, borderWidth: 0 }]} placeholder="Enter your password"
              placeholderTextColor="#aaa" secureTextEntry={!showPassword}
              value={password} onChangeText={setPassword} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={s.eyeBtn}>
              {showPassword ? <EyeIcon size={20} color="#aaa" /> : <EyeOffIcon size={20} color="#aaa" />}
            </TouchableOpacity>
          </View>
          <Text style={s.hint}>At least 8 characters</Text>

          <Text style={s.label}>Confirm Password</Text>
          <View style={s.passwordRow}>
            <TextInput style={[s.input, { flex: 1, borderWidth: 0 }]} placeholder="Confirm your password"
              placeholderTextColor="#aaa" secureTextEntry={!showConfirm}
              value={confirmPassword} onChangeText={setConfirmPassword} />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={s.eyeBtn}>
              {showConfirm ? <EyeIcon size={20} color="#aaa" /> : <EyeOffIcon size={20} color="#aaa" />}
            </TouchableOpacity>
          </View>

          {!!error && <Text style={s.error}>{error}</Text>}

          <TouchableOpacity style={[s.btn, loading && s.btnDisabled]} onPress={handleRegister} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Create Account</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace("/login")}>
            <Text style={s.link}>Already have an account? <Text style={s.linkBold}>Login</Text></Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: "#F5F0EB" },
  container:   { paddingHorizontal: 28, paddingTop: 12, paddingBottom: 40, gap: 12 },
  backBtn:     { alignSelf: "flex-start", padding: 4 },
  backIcon:    { fontSize: 22, color: "#1a1a1a" },
  welcome:     { fontSize: 22, fontWeight: "bold", color: "#18251D", textAlign: "center" },
  title:       { fontSize: 28, fontWeight: "bold", color: "#18251D", textAlign: "center", marginBottom: 8 },
  row:         { flexDirection: "row", gap: 12 },
  label:       { fontSize: 13, fontWeight: "600", color: "#374151" },
  input:       { borderWidth: 1, borderColor: "#E2D9D0", borderRadius: 10,
                 padding: 14, fontSize: 15, color: "#1a1a1a", backgroundColor: "#fff" },
  passwordRow: { flexDirection: "row", alignItems: "center", borderWidth: 1,
                 borderColor: "#E2D9D0", borderRadius: 10, paddingHorizontal: 14, backgroundColor: "#fff" },
  eyeBtn:      { padding: 8 },
  hint:        { fontSize: 12, color: "#7C5C3E" },
  error:       { color: "#DC2626", fontSize: 13, textAlign: "center" },
  btn:         { backgroundColor: "#2C1A12", borderRadius: 25, padding: 16, alignItems: "center", marginTop: 8 },
  btnDisabled: { backgroundColor: "#6B7280" },
  btnText:     { color: "#fff", fontSize: 16, fontWeight: "bold" },
  link:        { fontSize: 14, color: "#6B7280", textAlign: "center" },
  linkBold:    { color: "#7C5C3E", fontWeight: "bold" },
});