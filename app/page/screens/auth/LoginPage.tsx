import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EyeIcon, EyeOffIcon } from "../components/CustomIcon";
import { Controller, useForm } from "react-hook-form";

type LoginFormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
const [showPassword, setShowPassword] = useState(false);
const { loading, error, login} = useAuth();
const passwordRef = useRef<TextInput>(null);

const {control,handleSubmit,formState: { errors },} = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    await login(data.email, data.password);
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
            </View>

            <View style={s.right}>
              <Text style={s.formTitle}>تسجيل الدخول</Text>

              <Text style={s.label}>البريد الإلكتروني</Text>
              <View style={s.inputRow}>
                
                <Controller control={control} name="email"   rules={{required: "Email is required",}}
                render={({ field: { onChange, value } }) => (

                <TextInput autoFocus style={s.input} placeholder="example@gmail.com" placeholderTextColor="#A0A0A0"
                  keyboardType="email-address" autoCapitalize="none"value={value} onChangeText={onChange} 
                  textAlign="right" returnKeyType="next" onSubmitEditing={() => passwordRef.current?.focus()}/> )}
                />
              </View>

                {errors.email && (<Text style={s.error}>{errors.email.message}</Text>)}
                

              <Text style={s.label}>كلمة المرور</Text>
              <View style={s.inputRow}>
                  <Controller control={control} name="password"
                    rules={{required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Minimum 8 characters",
                    },
                  }}

                render={({ field: { onChange, value } }) => (
                
                <TextInput ref={(ref) => {passwordRef.current = ref;}} 
                style={s.input} placeholder="••••••••" placeholderTextColor="#A0A0A0"
                secureTextEntry={!showPassword} value={value} onChangeText={onChange} textAlign="right" returnKeyType="done" onSubmitEditing={handleSubmit(handleLogin)}  />
                )}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeIcon size={18} color="#6A0DAD" /> : <EyeOffIcon size={18} color="#8B8B8B" />}
                </TouchableOpacity>
              </View>

                {errors.password && (<Text style={s.error}>{errors.password.message}</Text>)}

              <TouchableOpacity
                style={s.forgotContainer}
                onPress={() => router.push("/forgotpassword")}
              >
                <Text style={s.forgotText}>نسيت كلمة المرور؟</Text>
              </TouchableOpacity>
              {!!error && <Text style={s.error}>{error}</Text>}

              <View style={s.btnRow}>
                <TouchableOpacity style={[s.btnPrimary, loading && s.btnDisabled]} onPress={handleSubmit(handleLogin)} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={s.btnPrimaryText}>تسجيل الدخول</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={s.btnOutline} onPress={() => router.push("/register")}>
                  <Text style={s.btnOutlineText}>إنشاء حساب</Text>
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