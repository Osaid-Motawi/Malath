import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EyeIcon, EyeOffIcon } from "../components/CustomIcon";
import { useAuth } from "@/hooks/useAuth";

const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const { loading, error, register } = useAuth();

  const handleRegister = async () => {
    await register(firstName, lastName, email, password, confirmPassword);
  };
return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={s.outer}
          showsVerticalScrollIndicator={false}
        >
          <View style={s.card}>
            <View style={s.left}>
              <Text style={s.welcome}>Welcome to</Text>
              <Text style={s.appName}>Malath</Text>
              <View style={s.logoCircle}></View>
            </View>
            <View style={s.right}>
              <Text style={s.formTitle}>إنشاء حساب</Text>

              <View style={s.nameRow}>
                <View style={{ flex: 1 }}>
                  <Text style={s.label}>الاسم الأول</Text>
                  <View style={s.inputRow}>
                    <TextInput
                      autoFocus
                      style={s.input}
                      placeholder="أدخل الاسم الأول"
                      placeholderTextColor="#999"
                      value={firstName}
                      onChangeText={setFirstName}
                      returnKeyType="next"
                      onSubmitEditing={() => lastNameRef.current?.focus()}
                    />
                  </View>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={s.label}>اسم العائلة</Text>
                  <View style={s.inputRow}>
                    <TextInput
                      ref={lastNameRef}
                      style={s.input}
                      placeholder="أدخل اسم العائلة"
                      placeholderTextColor="#999"
                      value={lastName}
                      onChangeText={setLastName}
                      returnKeyType="next"
                      onSubmitEditing={() => emailRef.current?.focus()}
                    />
                  </View>
                </View>
              </View>

              <Text style={s.label}>البريد الإلكتروني</Text>

              <View style={s.inputRow}>
                <TextInput
                  ref={emailRef}
                  style={s.input}
                  placeholder="أدخل البريد الإلكتروني"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              </View>

              <Text style={s.label}>كلمة المرور</Text>

              <View style={s.inputRow}>
                <TextInput
                  ref={passwordRef}
                  style={s.input}
                  placeholder="أدخل كلمة المرور"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  returnKeyType="next"
                  onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeIcon size={18} color="#888" />
                  ) : (
                    <EyeOffIcon size={18} color="#888" />
                  )}
                </TouchableOpacity>
              </View>

              <Text style={s.label}>تأكيد كلمة المرور</Text>

              <View style={s.inputRow}>
                <TextInput
                  ref={confirmPasswordRef}
                  style={s.input}
                  placeholder="أعد إدخال كلمة المرور"
                  placeholderTextColor="#999"
                  secureTextEntry={!showConfirm}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleRegister}
                />

                <TouchableOpacity
                  onPress={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? (
                    <EyeIcon size={18} color="#888" />
                  ) : (
                    <EyeOffIcon size={18} color="#888" />
                  )}
                </TouchableOpacity>
              </View>

              {!!error && <Text style={s.error}>{error}</Text>}

              <View style={s.btnRow}>
                <TouchableOpacity
                  style={[s.btnPrimary, loading && s.btnDisabled]}
                  onPress={handleRegister}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={s.btnPrimaryText}>إنشاء حساب</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe: {flex: 1,backgroundColor: "#F5F5F5",},
  outer: {flexGrow: 1,justifyContent: "center",padding: 20, },
  card: { backgroundColor: "#FFFFFF",borderRadius: 18,padding: 22,borderWidth: 1,borderColor: "#E7E7E7",},
  left: {alignItems: "center", marginBottom: 28,},
  welcome: {fontSize: 15,color: "#666",marginBottom: 4,},
  appName: { fontSize: 34,fontWeight: "bold",color: "#6A0DAD",letterSpacing: 1,},
  logoCircle: {display: "none",},
  right: {width: "100%",},
  formTitle: {fontSize: 24,fontWeight: "bold",color: "#222",textAlign: "right",marginBottom: 18},
  nameRow: { gap: 10},
  label: {fontSize: 14,color: "#333",marginBottom: 6,textAlign: "right",fontWeight: "600"},
  inputRow: {flexDirection: "row",alignItems: "center",backgroundColor: "#FAFAFA",borderWidth: 1,borderColor: "#DDD",borderRadius: 12,paddingHorizontal: 12,height: 50,marginBottom: 14},
  input: {flex: 1,fontSize: 15,color: "#000",textAlign: "right",outlineStyle: "none" as any},
  error: {color: "#DC2626",textAlign: "center",marginBottom: 10},
  btnRow: {marginTop: 10},
  btnPrimary: {backgroundColor: "#6A0DAD",height: 50,borderRadius: 12,justifyContent: "center",alignItems: "center"},
  btnDisabled: {opacity: 0.6},
  btnPrimaryText: {color: "#FFF",fontSize: 16,fontWeight: "bold"},
  switchText: {marginTop: 16,textAlign: "center",color: "#6A0DAD"},
});
export default RegisterPage;