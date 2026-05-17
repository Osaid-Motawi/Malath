import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { checkEmailExists } from "./page/services/authService";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const emailRef = useRef<TextInput>(null);

  const handleContinue = async () => {
    try {
      const user = await checkEmailExists(email);

      if (!user) {
        Alert.alert("Error", "Email not found");
        return;
      }

      router.push({
        pathname: "/resetpassword",
        params: { email },
      });
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
<View style={styles.container}>

<View style={styles.header}>
  <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
    <Text style={styles.backArrow}>←</Text>
  </TouchableOpacity>

  <Text style={styles.headerTitle}>Forgot Password</Text>

  <View style={{ width: 24 }} />
</View>
    

  <Text style={styles.label}>
    Email Address
  </Text>

  <TextInput
        ref={emailRef}
        autoFocus
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        onSubmitEditing={handleContinue}
  />

  <TouchableOpacity
    style={styles.button}
    onPress={handleContinue}
  >
    <Text style={styles.buttonText}>
      Continue
    </Text>
  </TouchableOpacity>

</View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1,justifyContent: "center",paddingHorizontal: 24,backgroundColor: "#F4F3F8",},
  title: { fontSize: 30, fontWeight: "bold", color: "#6A0DAD", marginBottom: 25,},
  label: {fontSize: 14,fontWeight: "600",color: "#6A0DAD", marginBottom: 8,},
  input: { backgroundColor: "#fff", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 15, fontSize: 15, marginBottom: 20,shadowColor: "#000",shadowOpacity: 0.05,shadowRadius: 5, elevation: 2,},
  button: {backgroundColor: "#6A0DAD",paddingVertical: 16,borderRadius: 18,alignItems: "center",marginTop: 10,},
  buttonText: {color: "#fff",fontSize: 16,fontWeight: "bold",},
  header: {flexDirection: "row",alignItems: "center",justifyContent: "space-between",marginBottom: 25},
  headerTitle: {fontSize: 20,fontWeight: "bold",color: "#6A0DAD",},
  backBtn: { width: 44,height: 44,borderRadius: 22,backgroundColor: "#F4ECFF",justifyContent: "center",alignItems: "center",borderWidth: 1,borderColor: "#E6D7FF",},
  backArrow: {fontSize: 26,fontWeight: "900",color: "#6A0DAD",lineHeight: 28,},
});
export default ForgotPasswordPage;