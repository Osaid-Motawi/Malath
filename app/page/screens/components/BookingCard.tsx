import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Booking } from "../../services/bookingService";
import { formatDisplay } from "./MiniCalendar";
import StatusBadge from "./StatusBadge";
import { CalendarIcon, UsersIcon } from "./CustomIcon";

interface Props {
  item: Booking;
  onDelete: (id: string) => void;
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View style={s.drow}>
      <Text style={s.dval}>{value}</Text>
      <View style={s.dlabelRow}>
        {icon}
        <Text style={s.dlbl}>{label}</Text>
      </View>
    </View>
  );
}

export default function BookingCard({ item, onDelete }: Props) {
  return (
    <View style={s.card}>
      
      <View style={s.cardTop}>
        {item.chaletImage
          ? <Image source={{ uri: item.chaletImage }} style={s.img} resizeMode="cover" />
          : <View style={[s.img, { backgroundColor: "#E5E7EB" }]} />}
        <View style={s.topInfo}>
          <Text style={s.name} numberOfLines={2}>{item.chaletName}</Text>
          <StatusBadge status={item.status} />
        </View>
      </View>

      
      <View style={s.details}>
        <DetailRow icon={<CalendarIcon size={14} color="#6B7280" />} label="الدخول"  value={formatDisplay(item.checkIn)} />
        <DetailRow icon={<CalendarIcon size={14} color="#6B7280" />} label="الخروج"  value={formatDisplay(item.checkOut)} />
        <DetailRow icon={<UsersIcon    size={14} color="#6B7280" />} label="الضيوف"  value={`${item.guests} أشخاص`} />
      </View>

      
      <View style={s.priceBar}>
        <Text style={s.priceVal}>{item.totalPrice} ₪</Text>
        <Text style={s.priceLbl}>المجموع الكلي</Text>
      </View>

      
      {item.status === "pending" && (
        <TouchableOpacity style={s.deleteBtn} onPress={() => onDelete(item.id)}>
          <Text style={s.deleteTxt}>إلغاء الحجز</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card:      { backgroundColor: "#fff", borderRadius: 16, marginBottom: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 2, overflow: "hidden" },
  cardTop:   { flexDirection: "row", gap: 12, padding: 12 },
  img:       { width: 80, height: 80, borderRadius: 10 },
  topInfo:   { flex: 1, gap: 8, justifyContent: "center" },
  name:      { fontSize: 15, fontWeight: "700", color: "#18251D", textAlign: "right" },
  details:   { paddingHorizontal: 14, paddingBottom: 12, gap: 8 },
  drow:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  dlabelRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  dlbl:      { fontSize: 13, color: "#6B7280" },
  dval:      { fontSize: 13, fontWeight: "600", color: "#18251D" },
  priceBar:  { flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "#F3F0E9", paddingHorizontal: 14, paddingVertical: 10 },
  priceLbl:  { fontSize: 13, color: "#6B7280" },
  priceVal:  { fontSize: 16, fontWeight: "bold", color: "#31202A" },
  deleteBtn: { margin: 12, marginTop: 6, backgroundColor: "#FEE2E2",
    borderRadius: 10, padding: 12, alignItems: "center" },
  deleteTxt: { color: "#DC2626", fontWeight: "700", fontSize: 14 },
});