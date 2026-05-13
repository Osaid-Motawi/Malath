import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EyeIcon, EyeOffIcon } from "../components/CustomIcon";
import { useAuth } from "@/hooks/useAuth";
import { Controller, useForm } from "react-hook-form";

type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const { loading, error, register } = useAuth();

    const {control,handleSubmit,watch,formState: { errors },} = useForm<RegisterFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");

  const handleRegister = async (data: RegisterFormData) => {
    await register(data.firstName, data.lastName, data.email, data.password, data.confirmPassword);
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
                    <Controller
                      control={control}
                      name="firstName"
                      rules={{ required: "First name is required" }}
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          autoFocus
                          style={s.input}
                          placeholder="أدخل الاسم الأول"
                          placeholderTextColor="#999"
                          value={value}
                          onChangeText={onChange}
                          returnKeyType="next"
                          onSubmitEditing={() => lastNameRef.current?.focus()}
                        />
                      )}
                    />
                  </View>
                  {errors.firstName && (<Text style={s.error}>{errors.firstName.message}</Text>)}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.label}>اسم العائلة</Text>
                  <View style={s.inputRow}>
                    <Controller
                      control={control}
                      name="lastName"
                      rules={{ required: "Last name is required" }}
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          ref={(ref) => {lastNameRef.current = ref;}}
                          style={s.input}
                          placeholder="أدخل اسم العائلة"
                          placeholderTextColor="#999"
                          value={value}
                          onChangeText={onChange}
                          returnKeyType="next"
                          onSubmitEditing={() => emailRef.current?.focus()}
                        />
                      )}
                    />
                  </View>
                  {errors.lastName && (<Text style={s.error}>{errors.lastName.message}</Text>)}
                </View>
              </View>

              <Text style={s.label}>البريد الإلكتروني</Text>

              <View style={s.inputRow}>
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email address" },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      ref={(ref) => {emailRef.current = ref;}}
                      style={s.input}
                      placeholder="أدخل البريد الإلكتروني"
                      placeholderTextColor="#999"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={value}
                      onChangeText={onChange}
                      returnKeyType="next"
                      onSubmitEditing={() => passwordRef.current?.focus()}
                    />
                  )}
                />
              </View>
                {errors.email && (<Text style={s.error}>{errors.email.message}</Text>)}
              <Text style={s.label}>كلمة المرور</Text>

              <View style={s.inputRow}>
                  <Controller
                  control={control}
                  name="password"
                  rules={{
                    required: "Password is required",
                    minLength: { value: 8, message: "Minimum 8 characters" },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                           ref={(ref) => {
                      passwordRef.current = ref;
                    }}
                      style={s.input}
                      placeholder="أدخل كلمة المرور"
                      placeholderTextColor="#999"
                      secureTextEntry={!showPassword}
                      value={value}
                      onChangeText={onChange}
                      returnKeyType="next"
                      onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                    />
                  )}
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
                  {errors.password && (<Text style={s.error}>{errors.password.message}</Text>)}
              <Text style={s.label}>تأكيد كلمة المرور</Text>

              <View style={s.inputRow}>
                <Controller
                  control={control}
                  name="confirmPassword"
                  rules={{
                    required: "Please confirm your password",
                    validate: (value) => value === passwordValue || "Passwords do not match",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      ref={(ref) => { confirmPasswordRef.current =ref;}}
                      style={s.input}
                      placeholder="أعد إدخال كلمة المرور"
                      placeholderTextColor="#999"
                      secureTextEntry={!showConfirm}
                      value={value}
                      onChangeText={onChange}
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit(handleRegister)}
                    />
                  )}
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
              {errors.confirmPassword && (<Text style={s.error}>{errors.confirmPassword.message}</Text>)}
              {!!error && <Text style={s.error}>{error}</Text>}

              <View style={s.btnRow}>
                <TouchableOpacity
                  style={[s.btnPrimary, loading && s.btnDisabled]}
                  onPress={handleSubmit(handleRegister)}
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