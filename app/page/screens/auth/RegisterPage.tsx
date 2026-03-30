import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { registerUser } from "../../services/authService";

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
    if (!firstName.trim() || !lastName.trim()) { setError("يرجى إدخال الاسم الأول والأخير"); return; }
    if (!email.trim()) { setError("يرجى إدخال البريد الإلكتروني"); return; }
    if (password.length < 8) { setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل"); return; }
    if (password !== confirmPassword) { setError("كلمة المرور غير متطابقة"); return; }

    setLoading(true);
    try {
      await registerUser(email.trim(), password);
      router.replace("/(tabs)");
    } catch (e: any) {
      if (e.code === "auth/email-already-in-use") {
        setError("البريد الإلكتروني مستخدم مسبقاً");
      } else if (e.code === "auth/invalid-email") {
        setError("صيغة البريد الإلكتروني غير صحيحة");
      } else {
        setError("حدث خطأ، حاول مجدداً");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Register</Text>

          <View style={styles.row}>
            <View style={[styles.inputWrapper, { flex: 1 }]}>
              <Text style={styles.label}>First Name</Text>
              <TextInput style={styles.input} placeholder="First Name" placeholderTextColor="#aaa" value={firstName} onChangeText={setFirstName} />
            </View>
            <View style={[styles.inputWrapper, { flex: 1 }]}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput style={styles.input} placeholder="Last Name" placeholderTextColor="#aaa" value={lastName} onChangeText={setLastName} />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput style={styles.input} placeholder="Enter your email" placeholderTextColor="#aaa" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput style={styles.passwordInput} placeholder="••••••••" placeholderTextColor="#aaa" secureTextEntry={!showPassword} value={password} onChangeText={setPassword} />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.eyeIcon}>{showPassword ? "🙈" : "👁️"}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.hint}>must contain 8 char.</Text>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput style={styles.passwordInput} placeholder="••••••••" placeholderTextColor="#aaa" secureTextEntry={!showConfirm} value={confirmPassword} onChangeText={setConfirmPassword} />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Text style={styles.eyeIcon}>{showConfirm ? "🙈" : "👁️"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {!!error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}

          <TouchableOpacity style={[styles.registerBtn, loading && styles.btnDisabled]} onPress={handleRegister} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerBtnText}>Create Account</Text>}
          </TouchableOpacity>

          <Text style={styles.terms}>
            By continuing, you agree to our <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F0EB" },
  container: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 40, gap: 16 },
  backBtn: { alignSelf: "flex-start", padding: 4 },
  backIcon: { fontSize: 22, color: "#1a1a1a" },
  title: {
    fontSize: 28, fontWeight: "bold", color: "#1a1a1a",
    textAlign: "center", marginBottom: 8,
  },
  row: { flexDirection: "row", gap: 12 },
  inputWrapper: { gap: 6 },
  label: { fontSize: 13, fontWeight: "600", color: "#374151" },
  input: {
    borderWidth: 1, borderColor: "#E2D9D0", borderRadius: 10,
    padding: 14, fontSize: 15, color: "#1a1a1a", backgroundColor: "#fff",
  },
  passwordContainer: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: "#E2D9D0", borderRadius: 10,
    paddingHorizontal: 14, backgroundColor: "#fff",
  },
  passwordInput: { flex: 1, padding: 14, fontSize: 15, color: "#1a1a1a" },
  eyeIcon: { fontSize: 18 },
  hint: { fontSize: 12, color: "#7C5C3E", marginTop: 2 },
  errorBox: { backgroundColor: "#FEE2E2", borderRadius: 8, padding: 10 },
  errorText: { color: "#DC2626", fontSize: 13, textAlign: "center" },
  registerBtn: {
    backgroundColor: "#2C1A12", borderRadius: 12,
    padding: 16, alignItems: "center", marginTop: 4,
  },
  btnDisabled: { backgroundColor: "#6B7280" },
  registerBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  terms: { fontSize: 12, color: "#6B7280", textAlign: "center", lineHeight: 18 },
  termsLink: { color: "#7C5C3E", fontWeight: "600" },
});