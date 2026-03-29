import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { loginUser, logoutUser } from "../../services/authService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email.trim()) { setError("يرجى إدخال البريد الإلكتروني"); return; }
    if (!password.trim()) { setError("يرجى إدخال كلمة المرور"); return; }

    setLoading(true);
    try {
      await loginUser(email.trim(), password);
      router.replace("/(tabs)");
    } catch (e: any) {
      if (e.code === "auth/invalid-credential" || e.code === "auth/wrong-password") {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      } else if (e.code === "auth/invalid-email") {
        setError("صيغة البريد الإلكتروني غير صحيحة");
      } else {
        setError("حدث خطأ، حاول مجدداً");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.welcome}>Welcome to MALATH</Text>
          <Text style={styles.title}>Login</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { flex: 1, borderWidth: 0 }]}
                placeholder="Enter your password"
                placeholderTextColor="#aaa"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Text style={styles.eyeIcon}>{showPassword ? "🙈" : "👁️"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginBtnText}>Login</Text>}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or login with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google - مؤقتاً disabled */}
          <TouchableOpacity style={[styles.googleBtn, { opacity: 0.5 }]} disabled>
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleText}>Login with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.registerBtn} onPress={() => router.push("/register")}>
            <Text style={styles.registerText}>
              Don't have an account? <Text style={styles.registerLink}>Register</Text>
            </Text>
          </TouchableOpacity>

          {/* Logout للتجربة */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 36 },
  welcome: { fontSize: 22, fontWeight: "bold", color: "#1a1a1a" },
  title: { fontSize: 20, fontWeight: "600", color: "#1a1a1a", marginTop: 4 },
  form: { gap: 14 },
  inputWrapper: { gap: 6 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151" },
  input: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 10, padding: 14, fontSize: 15, color: "#1a1a1a", backgroundColor: "#fff" },
  passwordContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 10, paddingHorizontal: 14, backgroundColor: "#fff" },
  eyeBtn: { padding: 4 },
  eyeIcon: { fontSize: 18 },
  forgotBtn: { alignSelf: "flex-end" },
  forgotText: { color: "#2563EB", fontSize: 13 },
  errorBox: { backgroundColor: "#FEE2E2", borderRadius: 8, padding: 10 },
  errorText: { color: "#DC2626", fontSize: 13, textAlign: "center" },
  loginBtn: { backgroundColor: "#1a1a1a", borderRadius: 12, padding: 16, alignItems: "center" },
  loginBtnDisabled: { backgroundColor: "#6B7280" },
  loginBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  divider: { flexDirection: "row", alignItems: "center", gap: 8 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E5E7EB" },
  dividerText: { color: "#9CA3AF", fontSize: 13 },
  googleBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "#2563EB", borderRadius: 12, padding: 14, gap: 8 },
  googleIcon: { fontSize: 16, fontWeight: "bold", color: "#EA4335" },
  googleText: { fontSize: 15, color: "#2563EB", fontWeight: "600" },
  registerBtn: { alignItems: "center" },
  registerText: { fontSize: 14, color: "#6B7280" },
  registerLink: { color: "#2563EB", fontWeight: "bold" },
  logoutBtn: { alignItems: "center", padding: 12, borderWidth: 1, borderColor: "#EF4444", borderRadius: 12 },
  logoutText: { color: "#EF4444", fontWeight: "bold", fontSize: 15 },
});