import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

export default function ProfilePage() {
  const { user, loading, loadUser } = useProfile();
  const { logout } = useAuth();

  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [loadUser])
  );

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#4F2396" style={{ marginTop: 60 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#fff" />
        </View>

        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user?.role || "user"}</Text>
        </View>
      </View>

      <View style={styles.menu}>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/editprofile")}
        >
          <Ionicons name="create-outline" size={20} color="#4F2396" />
          <Text style={styles.menuText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/favorites")}
        >
          <Ionicons name="heart-outline" size={20} color="#4F2396" />
          <Text style={styles.menuText}>Favorites</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/mybooking")}
        >
          <Ionicons name="home-outline" size={20} color="#4F2396" />
          <Text style={styles.menuText}>My Bookings</Text>
        </TouchableOpacity>


        {user?.role === "owner" && (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={() => router.push("/ownerdashboard")}
  >
    <Ionicons name="speedometer-outline" size={20} color="#4F2396" />
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
  container: {
    flex: 1,
    backgroundColor: "#F4F3F8",
    paddingHorizontal: 20,
  },

  header: {
    marginTop: 20,
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4F2396",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4F2396",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
  },

  email: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },

  roleBadge: {
    marginTop: 10,
    backgroundColor: "#EDE9FE",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  roleText: {
    color: "#4F2396",
    fontWeight: "600",
  },

  menu: {
    marginTop: 25,
    gap: 12,
  },

  menuItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  menuText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },

  logoutBtn: {
    marginTop: "auto",
    marginBottom: 20,
    backgroundColor: "#4F2396",
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});