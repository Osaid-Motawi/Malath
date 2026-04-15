import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Chalet, deleteChalet, getMyChalets } from "../../services/chaletService";

export default function MyListingScreen() {
  const [chalets, setChalets] = useState<Chalet[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadMyChalets();
    }, [])
  );

  async function loadMyChalets() {
    setLoading(true);
    const data = await getMyChalets();
    setChalets(data);
    setLoading(false);
  }

  function handleAdd() {
  router.push("/add-edit-chalet" as any);
}

function handleEdit(chalet: Chalet) {
  router.push({ 
    pathname: "/add-edit-chalet" as any, 
    params: { chaletId: chalet.id } 
  });
}
  function handleDelete(chalet: Chalet) {
    Alert.alert(
      "حذف الشاليه",
      `هل أنت متأكد أنك تريد حذف "${chalet.name}"؟`,
      [
        { text: "إلغاء", style: "cancel" },
        {
          text: "حذف",
          style: "destructive",
          onPress: async () => {
            await deleteChalet(chalet.id);
            setChalets((prev) => prev.filter((c) => c.id !== chalet.id));
          },
        },
      ]
    );
  }

  function renderItem({ item }: { item: Chalet }) {
    const isBooked = item.status === "booked";
    return (
      <View style={styles.card}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
        ) : (
          <View style={[styles.cardImage, styles.noImage]}>
            <Ionicons name="image-outline" size={36} color="#9CA3AF" />
          </View>
        )}

        <View style={styles.cardBody}>
          <View style={styles.cardTopRow}>
            <View style={[styles.statusBadge, isBooked ? styles.bookedBadge : styles.availableBadge]}>
              <Text style={[styles.statusText, { color: isBooked ? "#DC2626" : "#16A34A" }]}>
                {isBooked ? "محجوز" : "متاح"}
              </Text>
            </View>
            <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
          </View>

          <View style={styles.cardRow}>
            <Text style={styles.cardMeta}>{item.location}</Text>
            <Ionicons name="location-outline" size={13} color="#9CA3AF" />
          </View>

          <View style={styles.cardRow}>
            <View style={styles.cardRowLeft}>
              <Ionicons name="people-outline" size={13} color="#9CA3AF" />
              <Text style={styles.cardMeta}>{item.capacity} شخص</Text>
            </View>
            <Text style={styles.cardPrice}>{item.price} ₪ / ليلة</Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item)}>
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
            <Ionicons name="create-outline" size={16} color="#fff" />
            <Text style={styles.editBtnText}>تعديل</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
        <View style={styles.emptyState}>
          <Ionicons name="home-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>ما في شاليهات بعد</Text>
          <Text style={styles.emptySubtitle}>ابدأ بإضافة شاليهك الأول</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={handleAdd}>
            <Text style={styles.emptyBtnText}>+ أضف شاليه</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={chalets}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#F3F4F6",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  addBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#517c63", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
  },
  addBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  list: { padding: 16, gap: 14 },
  card: {
    backgroundColor: "#fff", borderRadius: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 2, overflow: "hidden",
  },
  cardImage: { width: "100%", height: 160 },
  noImage: { backgroundColor: "#F3F4F6", justifyContent: "center", alignItems: "center" },
  cardBody: { padding: 12, gap: 6 },
  cardTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardName: { fontSize: 15, fontWeight: "700", color: "#111827", flex: 1, textAlign: "right" },
  statusBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginLeft: 8 },
  availableBadge: { backgroundColor: "#DCFCE7" },
  bookedBadge: { backgroundColor: "#FEE2E2" },
  statusText: { fontSize: 11, fontWeight: "700" },
  cardRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardRowLeft: { flexDirection: "row", alignItems: "center", gap: 4 },
  cardMeta: { fontSize: 12, color: "#9CA3AF" },
  cardPrice: { fontSize: 14, fontWeight: "700", color: "#517c63" },
  cardActions: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 12, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: "#F3F4F6",
  },
  deleteBtn: {
    width: 38, height: 38, borderRadius: 10,
    borderWidth: 1, borderColor: "#FEE2E2",
    backgroundColor: "#FFF5F5", justifyContent: "center", alignItems: "center",
  },
  editBtn: {
    flex: 1, marginLeft: 10, flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 6,
    backgroundColor: "#517c63", borderRadius: 10, paddingVertical: 9,
  },
  editBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
  emptyTitle: { fontSize: 17, fontWeight: "700", color: "#374151" },
  emptySubtitle: { fontSize: 13, color: "#9CA3AF" },
  emptyBtn: {
    marginTop: 8, backgroundColor: "#517c63",
    paddingHorizontal: 24, paddingVertical: 11, borderRadius: 12,
  },
  emptyBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});