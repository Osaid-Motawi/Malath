import StorageService from "@/app/page/services/StorageService";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { ActivityIndicator, Alert, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfilePage() {
  const { user, loading, loadUser } = useProfile();
  const { logout } = useAuth();

  const [profileImage, setProfileImage] = useState("");
  const [cameraVisible, setCameraVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef<any>(null);

  useFocusEffect(
    useCallback(() => {
      loadUser();
      loadSavedImage();
    }, [loadUser])
  );

  const loadSavedImage = async () => {
    const image = await StorageService.getItem("profileImage");
    if (image) setProfileImage(image);
  };

  const openCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }

    setCameraVisible(true);
  };

  const takePhoto = async () => {
    const photo = await cameraRef.current?.takePictureAsync();

    if (photo?.uri) {
      setProfileImage(photo.uri);
      await StorageService.setItem("profileImage", photo.uri);
      setCameraVisible(false);
    }
  };

  const deletePhoto = async () => {
    setProfileImage("");
    await StorageService.removeItem("profileImage");
  };

  const handleImagePress = () => {
    if (!profileImage) {
      openCamera();
      return;
    }

    Alert.alert("صورة الملف الشخصي", "ماذا تريد أن تفعل؟", [
      { text: "تصوير صورة جديدة", onPress: openCamera },
      { text: "حذف الصورة", style: "destructive", onPress: deletePhoto },
      { text: "إلغاء", style: "cancel" },
    ]);
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#6A0DAD" style={{ marginTop: 60 }} />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authBox}>
          <Ionicons name="person-circle-outline" size={90} color="#6A0DAD" />
          <Text style={styles.authTitle}>أنت غير مسجل دخول</Text>

          <TouchableOpacity style={styles.authBtn} onPress={() => router.push("/login")}>
            <Text style={styles.authBtnText}>تسجيل الدخول</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.authBtn} onPress={() => router.push("/register")}>
            <Text style={styles.authBtnText}>إنشاء حساب</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Modal visible={cameraVisible} animationType="slide">
        <View style={styles.cameraContainer}>
          <CameraView ref={cameraRef} style={styles.camera} facing="front" />

          <View style={styles.cameraButtons}>
            <TouchableOpacity style={styles.cancelCameraBtn} onPress={() => setCameraVisible(false)}>
              <Text style={styles.cameraBtnText}>إلغاء</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.takePhotoBtn} onPress={takePhoto}>
              <Text style={styles.cameraBtnText}>تصوير</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>الملف الشخصي</Text>
      </View>

      <View style={styles.card}>
        <TouchableOpacity style={styles.avatar} onPress={handleImagePress}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatarImage} />
          ) : (
            <Ionicons name="person" size={40} color="#fff" />
          )}
        </TouchableOpacity>

        <Text style={styles.imageText}>
          {profileImage ? "اضغط لتغيير أو حذف الصورة" : "اضغط لإضافة صورة"}
        </Text>

        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user?.role || "user"}</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/editprofile")}>
          <Ionicons name="create-outline" size={20} color="#6A0DAD" />
          <Text style={styles.menuText}>Edit Profile</Text>
        </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
          onPress={() =>
            router.push("/resetpassword")
          }
        >
          <Ionicons name="key-outline" size={22} color="#4F2396" />
          <Text style={styles.menuText}>Reset Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/favorites")}
        >
          <Ionicons name="heart-outline" size={20} color="#4F2396" />
          <Text style={styles.menuText}>Favorites</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/mybooking")}>
          <Ionicons name="home-outline" size={20} color="#6A0DAD" />
          <Text style={styles.menuText}>My Bookings</Text>
        </TouchableOpacity>

        {user?.role === "owner" && (
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/ownerdashboard")}>
            <Ionicons name="speedometer-outline" size={20} color="#6A0DAD" />
            <Text style={styles.menuText}>Owner Dashboard</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F3F8", paddingHorizontal: 20 },
  header: { marginTop: 20, marginBottom: 20, alignItems: "center" },
  headerTitle: { fontSize: 26, fontWeight: "bold", color: "#6A0DAD" },
  card: { backgroundColor: "#fff", borderRadius: 20, padding: 20, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: "#6A0DAD", justifyContent: "center", alignItems: "center", overflow: "hidden" },
  avatarImage: { width: "100%", height: "100%" },
  imageText: { marginTop: 10, color: "#777", fontSize: 13 },
  name: { fontSize: 20, fontWeight: "bold", color: "#111", marginTop: 12 },
  email: { fontSize: 14, color: "#777", marginTop: 4 },
  roleBadge: { marginTop: 10, backgroundColor: "#EDE9FE", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  roleText: { color: "#6A0DAD", fontWeight: "600" },
  menu: { marginTop: 25, gap: 12 },
  menuItem: { backgroundColor: "#fff", padding: 16, borderRadius: 14, flexDirection: "row", alignItems: "center", gap: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  menuText: { fontSize: 16, fontWeight: "500", color: "#333" },
  logoutBtn: { marginTop: "auto", marginBottom: 20, backgroundColor: "#6A0DAD", padding: 16, borderRadius: 20, alignItems: "center" },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  authBox: { flex: 1, justifyContent: "center", alignItems: "center", gap: 18 },
  authTitle: { fontSize: 22, fontWeight: "bold", color: "#111" },
  authBtn: { backgroundColor: "#6A0DAD", width: "100%", paddingVertical: 14, borderRadius: 16, alignItems: "center" },
  authBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  cameraContainer: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  cameraButtons: { position: "absolute", bottom: 40, left: 0, right: 0, flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 30 },
  takePhotoBtn: { backgroundColor: "#6A0DAD", paddingHorizontal: 30, paddingVertical: 14, borderRadius: 999 },
  cancelCameraBtn: { backgroundColor: "#444", paddingHorizontal: 30, paddingVertical: 14, borderRadius: 999 },
  cameraBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});