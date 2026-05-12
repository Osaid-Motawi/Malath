import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMyChalets } from "../../../../hooks/useMyChalets";
import MyListingCard from "../components/MyListingCard";

export default function MyListingPage() {
  const { chalets, loading, load, handleAdd, handleEdit, handleDelete } = useMyChalets();

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addBtnText}>إضافة شاليه</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>شاليهاتي</Text>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#517c63" />
      ) : chalets.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="home-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>ما في شاليهات بعد</Text>
          <Text style={styles.emptySubtitle}>ابدأ بإضافة شاليهك الأول</Text>
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
            <Text style={styles.addBtnText}>+ أضف شاليه</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={chalets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MyListingCard item={item} onEdit={handleEdit} onDelete={handleDelete} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 14, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#4F2396", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  addBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  list: { padding: 16, gap: 14 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
  emptyTitle: { fontSize: 17, fontWeight: "700", color: "#374151" },
  emptySubtitle: { fontSize: 13, color: "#9CA3AF" },
});