import React from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { formatDisplay } from "./MiniCalendar";

interface Props {
  chaletName: string;
  chaletImage: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  notes: string;
  chaletPrice: number;
  totalPrice: number;
  loading: boolean;
  onConfirm: () => void;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.row}>
      <Text style={s.val}>{value}</Text>
      <Text style={s.lbl}>{label}</Text>
    </View>
  );
}

export default function SummaryCard({
  chaletName, chaletImage, checkIn, checkOut,
  nights, guests, notes, chaletPrice, totalPrice,
  loading, onConfirm,
}: Props) {
  return (
    <View style={s.wrapper}>
      {!!chaletImage && (
        <Image source={{ uri: chaletImage }} style={s.heroImg} resizeMode="cover" />
      )}

      <View style={s.card}>
        <Text style={s.chaletName}>{chaletName}</Text>
        <View style={s.divider} />

        <Row label="تاريخ الدخول" value={formatDisplay(checkIn)} />
        <Row label="تاريخ الخروج" value={formatDisplay(checkOut)} />
        <Row label="عدد الليالي"  value={`${nights} ليلة`} />
        <Row label="عدد الضيوف"   value={`${guests} أشخاص`} />
        {!!notes && <Row label="ملاحظات" value={notes} />}

        <View style={s.divider} />
        <Row label="السعر / ليلة"                   value={`${chaletPrice} ₪`} />
        <Row label={`${nights} x ${chaletPrice} ₪`} value={`${totalPrice} ₪`} />

        <View style={s.totalRow}>
          <Text style={s.totalLbl}>المجموع الكلي</Text>
          <Text style={s.totalVal}>{totalPrice} ₪</Text>
        </View>
      </View>

      <View style={s.pendingBox}>
        <Text style={s.pendingTxt}>سيكون الحجز بحالة انتظار حتى يؤكده المالك</Text>
      </View>

      <TouchableOpacity
        style={[s.confirmBtn, loading && s.disabledBtn]}
        onPress={onConfirm}
        disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={s.confirmTxt}>تأكيد الحجز</Text>}
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  wrapper:    { gap: 16 },
  heroImg:    { width: "100%", height: 200, borderRadius: 14 },
  card:       { backgroundColor: "#fff", borderRadius: 16, padding: 20, gap: 10,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  chaletName: { fontSize: 15, fontWeight: "700", color: "#18251D", textAlign: "right" },
  divider:    { height: 1, backgroundColor: "#F0EDE8" },
  row:        { flexDirection: "row", justifyContent: "space-between" },
  lbl:        { fontSize: 13, color: "#6B7280" },
  val:        { fontSize: 13, fontWeight: "600", color: "#18251D" },
  totalRow:   { flexDirection: "row", justifyContent: "space-between",
    backgroundColor: "#F3F0E9", borderRadius: 10, padding: 12, marginTop: 4 },
  totalLbl:   { fontSize: 15, fontWeight: "bold", color: "#18251D" },
  totalVal:   { fontSize: 17, fontWeight: "bold", color: "#31202A" },
  pendingBox: { backgroundColor: "#FEF3C7", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14 },
  pendingTxt: { color: "#92400E", fontSize: 13, fontWeight: "600", textAlign: "center" },
  confirmBtn: { backgroundColor: "#517c63", borderRadius: 12, padding: 16, alignItems: "center" },
  confirmTxt: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  disabledBtn:{ backgroundColor: "#9CA3AF" },
});