import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BookingStatus } from "../../services/bookingService";

const STATUS: Record<BookingStatus, { label: string; bg: string; color: string }> = {
  pending:   { label: "قيد الانتظار", bg: "#FEF3C7", color: "#92400E" },
  confirmed: { label: "مؤكد",         bg: "#D1FAE5", color: "#065F46" },
  rejected:  { label: "مرفوض",        bg: "#FEE2E2", color: "#991B1B" },
};

interface Props {
  status: BookingStatus;
}

export default function StatusBadge({ status }: Props) {
  const c = STATUS[status];
  return (
    <View style={[s.box, { backgroundColor: c.bg }]}>
      <Text style={[s.txt, { color: c.color }]}>{c.label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  box: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start" },
  txt: { fontSize: 12, fontWeight: "700" },
});