import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EyeIcon, EyeOffIcon } from "../components/CustomIcon";

  const LoginPage = () => {
    
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { loading, error, login} = useAuth();
  const passwordRef = useRef<TextInput>(null);
  const handleLogin = async () => {
    await login(email, password);
  };




  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.outer} showsVerticalScrollIndicator={false}>
          <View style={s.card}>

            <View style={s.left}>
              <Text style={s.welcome}>Welcome to</Text>
              <Text style={s.appName}>Malath</Text>

              <View style={s.logoCircle}>
              
              </View>
              <Text style={s.desc}>Your trusted platform for chalet bookings across the region.</Text>
            </View>

            <View style={s.right}>
              <Text style={s.formTitle}>Sign in to your account</Text>

              <Text style={s.label}>E-mail Address</Text>
              <View style={s.inputRow}>
                <TextInput autoFocus style={s.input} placeholder="example@gmail.com" placeholderTextColor="#A0A0A0"
                  keyboardType="email-address" autoCapitalize="none"
                  value={email} onChangeText={setEmail} textAlign="right" returnKeyType="next" onSubmitEditing={() => passwordRef.current?.focus()}/>
              </View>

              <Text style={s.label}>Password</Text>
              <View style={s.inputRow}>
                <TextInput style={s.input} placeholder="••••••••" placeholderTextColor="#A0A0A0"
                  secureTextEntry={!showPassword} value={password} onChangeText={setPassword} textAlign="right" returnKeyType="done" onSubmitEditing={handleLogin} ref={passwordRef} />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeIcon size={18} color="#aaa" /> : <EyeOffIcon size={18} color="#aaa" />}
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={s.forgotContainer}
                onPress={() => router.push("/forgotpassword")}
              >
                <Text style={s.forgotText}>نسيت كلمة المرور؟</Text>
              </TouchableOpacity>
              {!!error && <Text style={s.error}>{error}</Text>}

              <View style={s.btnRow}>
                <TouchableOpacity style={[s.btnPrimary, loading && s.btnDisabled]} onPress={handleLogin} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={s.btnPrimaryText}>Sign In</Text>}
                </TouchableOpacity>
                <TouchableOpacity style={s.btnOutline} onPress={() => router.push("/register")}>
                  <Text style={s.btnOutlineText}>Sign Up</Text>
                </TouchableOpacity>
              </View>

            <TouchableOpacity
  onPress={() =>
    router.push("/forgotpassword")
  }
>
  <Text
    style={{
      color: "#4F2396",
      marginTop: 10,
      fontWeight: "600",
    }}
  >
    Forgot Password?
  </Text>
</TouchableOpacity>

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {flex: 1,backgroundColor: "#FFFFFF"},
outer: {flexGrow: 1,justifyContent: "center",alignItems: "center",paddingHorizontal: 24,paddingVertical: 30},
card: {width: "100%",backgroundColor: "#FFFFFF",borderRadius: 32,padding: 22,borderWidth: 1,borderColor: "#EEE7FA",shadowColor: "#6A0DAD",shadowOpacity: 0.08,shadowRadius: 18,shadowOffset: { width: 0, height: 8 },elevation: 8,},
left: {alignItems: "center",marginBottom: 22},
welcome: {fontSize: 16,color: "#6B7280",fontWeight: "700",textAlign: "center"},
logoCircle: {display: "none"},
appName: {fontSize: 34,color: "#6A0DAD",fontWeight: "900",letterSpacing: 2},
right: {width: "100%",gap: 8},
formTitle: {fontSize: 26,fontWeight: "900",color: "#202020",textAlign: "center",marginBottom: 16},
label: {fontSize: 14,fontWeight: "800",color: "#3A3A3A",textAlign: "right",marginBottom: 8},
inputRow: {flexDirection: "row",alignItems: "center",backgroundColor: "#F8F6FC",borderRadius: 20,borderWidth: 1.5,borderColor: "#E4D7F7",paddingHorizontal: 14,height: 52,marginBottom: 14},
input: {flex: 1,fontSize: 15,color: "#000000",fontWeight: "700",paddingVertical: 8,textAlign: "right",outlineStyle: "none" as any},
error: {color: "#DC2626",fontSize: 13,textAlign: "center",fontWeight: "700",marginBottom: 8},
btnRow: {flexDirection: "row",gap: 12,marginTop: 8},
btnPrimary: {flex: 1,backgroundColor: "#6A0DAD",borderRadius: 28,height: 54,justifyContent: "center",alignItems: "center"},
btnDisabled: {backgroundColor: "#A78BC4"},
btnPrimaryText: {color: "#FFFFFF",fontWeight: "900",fontSize: 15},
btnOutline: {flex: 1,borderWidth: 1.5,borderColor: "#6A0DAD",borderRadius: 28,height: 54,justifyContent: "center",alignItems: "center"},
btnOutlineText: {color: "#6A0DAD",fontWeight: "900",fontSize: 15},
logoutBtn: {backgroundColor: "#F69D58",borderRadius: 20,padding: 12,alignItems: "center",marginTop: 12},
logoutText: {color: "#fff",fontWeight: "bold",
fontSize: 14},
forgotContainer: {alignSelf: "flex-end",marginBottom: 10},
forgotText: {color: "#6A0DAD",fontSize: 13,fontWeight: "800"},
});

export default LoginPage;