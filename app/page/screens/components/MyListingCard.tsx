import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Chalet } from "../../services/chaletService";

type Props = {
  item: Chalet;
  onEdit: (chalet: Chalet) => void;
  onDelete: (chalet: Chalet) => void;
};

export default function OwnerChaletCard({ item, onEdit, onDelete }: Props) {
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
        <View style={styles.row}>
          <View style={[styles.badge, isBooked ? styles.bookedBadge : styles.availableBadge]}>
            <Text style={[styles.badgeText, { color: isBooked ? "#DC2626" : "#16A34A" }]}>
              {isBooked ? "محجوز" : "متاح"}
            </Text>
          </View>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.meta}>{item.location}</Text>
          <Ionicons name="location-outline" size={13} color="#9CA3AF" />
        </View>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="people-outline" size={13} color="#9CA3AF" />
            <Text style={styles.meta}>{item.capacity} شخص</Text>
          </View>
          <Text style={styles.price}>{item.price} ₪ / ليلة</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item)}>
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
        </TouchableOpacity>
        {item.approvalStatus === "rejected" ? (
  <View style={styles.rejectedBtn}>
    <Text style={styles.rejectedText}>تم الرفض</Text>
  </View>
) : (
  <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(item)}>
<Text style={styles.editBtnText}>تعديل</Text>  </TouchableOpacity>
)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {backgroundColor: "#fff", borderRadius: 14, elevation: 2, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 6 },
  cardImage: { width: "100%", height: 160 },
  noImage: { backgroundColor: "#F3F4F6", justifyContent: "center", alignItems: "center" },
  cardBody: { padding: 12, gap: 6 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 4 },
  name: { fontSize: 15, fontWeight: "700", color: "#111827", flex: 1, textAlign: "right" },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginLeft: 8 },
  availableBadge: { backgroundColor: "#DCFCE7" },
  bookedBadge: { backgroundColor: "#FEE2E2" },
  badgeText: { fontSize: 11, fontWeight: "700" },
  meta: { fontSize: 12, color: "#9CA3AF" },
  price: { fontSize: 14, fontWeight: "700", color: "#6A0DAD" },
  actions: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#F3F4F6" },
  deleteBtn: { width: 38, height: 38, borderRadius: 10, borderWidth: 1, borderColor: "#FEE2E2", backgroundColor: "#FFF5F5", justifyContent: "center", alignItems: "center" },
  editBtn: { flex: 1, marginLeft: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "#6A0DAD", borderRadius: 10, paddingVertical: 9 },
  editBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  rejectedBtn: { backgroundColor: "#FEE2E2", paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, alignItems: "center" },
  rejectedText: { color: "#DC2626", fontSize: 13, fontWeight: "700" },
});