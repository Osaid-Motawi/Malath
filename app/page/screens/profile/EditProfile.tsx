import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StorageService from "../../services/StorageService";
import { updateUserProfile } from "../../services/authService";

const EditProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      const user = await StorageService.getUser();

      if (!user) {
        Alert.alert("خطأ", "لم يتم العثور على المستخدم");
        router.back();
        return;
      }

      setName(user.name || "");
      setEmail(user.email || "");
      setRole(user.role || "user");
    } catch (error) {
      console.log(error);
      Alert.alert("خطأ", "فشل تحميل بيانات المستخدم");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("تنبيه", "يرجى إدخال الاسم");
      return;
    }

    if (!email.trim()) {
      Alert.alert("تنبيه", "يرجى إدخال البريد الإلكتروني");
      return;
    }

    setSaving(true);

    try {
      await updateUserProfile(name.trim(), email.trim());
      Alert.alert("تم", "تم تحديث الملف الشخصي بنجاح");
      router.back();
    } catch (error: any) {
      console.log(error);
      Alert.alert("خطأ", error?.message || "فشل تحديث الملف الشخصي");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#6A0DAD" style={{ marginTop: 60 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backBtn}
      >
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

          <Text style={styles.headerTitle}>تعديل الملف الشخصي</Text>

          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#fff" />
          </View>

          <Text style={styles.title}>تحديث بياناتك</Text>
          <Text style={styles.subtitle}>يمكنك تعديل الاسم والبريد الإلكتروني</Text>

          <View style={styles.card}>
            <Text style={styles.label}>الاسم الكامل</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="أدخل الاسم"
                placeholderTextColor="#9CA3AF"
                textAlign="right"
              />
            </View>

            <Text style={styles.label}>البريد الإلكتروني</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="أدخل البريد الإلكتروني"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                textAlign="right"
              />
            </View>

            <Text style={styles.label}>الدور</Text>
            <View style={styles.readonlyBox}>
              <Text style={styles.readonlyText}>{role}</Text>
            </View>

            <TouchableOpacity
              style={[styles.saveBtn, saving && styles.disabledBtn]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.saveBtnText}>حفظ التعديلات</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F6FB",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6A0DAD",
  },

  content: {
    padding: 20,
    alignItems: "center",
  },

  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#6A0DAD",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 14,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 20,
    textAlign: "center",
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
    textAlign: "right",
  },

  inputRow: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },

  input: {
    fontSize: 14,
    color: "#111827",
    paddingVertical: 10,
    outlineStyle: "none" as any,
  },

  readonlyBox: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    marginBottom: 18,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },

  readonlyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "right",
  },

  saveBtn: {
    backgroundColor: "#6A0DAD",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },

  disabledBtn: {
    backgroundColor: "#9CA3AF",
  },

  saveBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  backBtn: {
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: "#F4ECFF",
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#E6D7FF",
},

backArrow: {
  fontSize: 26,
  fontWeight: "900",
  color: "#6A0DAD",
  lineHeight: 28,
},
});