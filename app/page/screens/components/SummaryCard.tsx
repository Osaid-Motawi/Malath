import React from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
  onBack?: () => void;
}

const PURPLE = "#6A0DAD";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.row}>
      <Text style={s.val}>{value}</Text>
      <Text style={s.lbl}>{label}</Text>
    </View>
  );
}

export default function SummaryCard({
  chaletName,
  chaletImage,
  checkIn,
  checkOut,
  nights,
  guests,
  notes,
  chaletPrice,
  totalPrice,
  loading,
  onConfirm,
  onBack,
}: Props) {
  return (
    <View style={s.wrapper}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={onBack} activeOpacity={0.8}>
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={s.content}>
        {!!chaletImage && (
          <Image source={{ uri: chaletImage }} style={s.heroImg} resizeMode="cover" />
        )}

        <View style={s.card}>
          <Text style={s.chaletName}>{chaletName}</Text>
          <View style={s.divider} />

          <Row label="تاريخ الدخول" value={formatDisplay(checkIn)} />
          <Row label="تاريخ الخروج" value={formatDisplay(checkOut)} />
          <Row label="عدد الليالي" value={`${nights} ليلة`} />
          <Row label="عدد الضيوف" value={`${guests} أشخاص`} />
          {!!notes && <Row label="ملاحظات" value={notes} />}

          <View style={s.divider} />
          <Row label="السعر / ليلة" value={`${chaletPrice} ₪`} />
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
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.confirmTxt}>تأكيد الحجز</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#FFFFFF" },
  header: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, height: 80, backgroundColor: "#FFFFFF", justifyContent: "flex-end", alignItems: "flex-start", paddingHorizontal: 0, paddingBottom: 10 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#F4ECFF", justifyContent: "center", alignItems: "center" },
  backArrow: { fontSize: 28, fontWeight: "900", color: PURPLE, lineHeight: 30 },
  content: { gap: 16, paddingTop: 90 },
  heroImg: { width: "100%", height: 200, borderRadius: 14 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 20, gap: 10, borderWidth: 1, borderColor: "#EEE7FA" },
  chaletName: { fontSize: 17, fontWeight: "900", color: "#1F1F1F", textAlign: "right" },
  divider: { height: 1, backgroundColor: "#F1EAFE" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  lbl: { fontSize: 13, color: "#6B7280", fontWeight: "700" },
  val: { fontSize: 13, fontWeight: "800", color: "#1F1F1F" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#F8F3FF", borderRadius: 12, padding: 12, marginTop: 4 },
  totalLbl: { fontSize: 15, fontWeight: "900", color: "#1F1F1F" },
  totalVal: { fontSize: 18, fontWeight: "900", color: PURPLE },
  pendingBox: { backgroundColor: "#FEF3C7", borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14 },
  pendingTxt: { color: "#92400E", fontSize: 13, fontWeight: "700", textAlign: "center" },
  confirmBtn: { backgroundColor: PURPLE, borderRadius: 14, padding: 16, alignItems: "center" },
  confirmTxt: { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },
  disabledBtn: { backgroundColor: "#B8A2D9" },
});