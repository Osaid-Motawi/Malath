import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { UsersIcon } from "./CustomIcon";

interface Props {
  guests: number;
  capacity: number;
  onChange: (value: number) => void;
}

export default function GuestCounter({ guests, capacity, onChange }: Props) {
  return (
    <View style={s.section}>
      <View style={s.sectionHeader}>
        <UsersIcon />
        <Text style={s.sectionTitle}>عدد الضيوف</Text>
      </View>

      <View style={s.row}>
        <TouchableOpacity
          style={[s.btn, guests <= 1 && s.btnOff]}
          disabled={guests <= 1}
          onPress={() => onChange(Math.max(1, guests - 1))}>
          <Text style={s.btnTxt}>−</Text>
        </TouchableOpacity>

        <View style={s.center}>
          <Text style={s.num}>{guests}</Text>
          <Text style={s.lbl}>أشخاص</Text>
        </View>

        <TouchableOpacity
          style={[s.btn, guests >= capacity && s.btnOff]}
          disabled={guests >= capacity}
          onPress={() => onChange(Math.min(capacity, guests + 1))}>
          <Text style={s.btnTxt}>+</Text>
        </TouchableOpacity>
      </View>

      {guests >= capacity && (
        <Text style={s.warn}>وصلت للحد الأقصى ({capacity} أشخاص)</Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  section:       { gap: 12 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, justifyContent: "flex-end" },
  sectionTitle:  { fontSize: 15, fontWeight: "700", color: "#18251D" },
  row:    { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 28 },
  btn:    { width: 46, height: 46, borderRadius: 23, backgroundColor: "#31202A", justifyContent: "center", alignItems: "center" },
  btnOff: { backgroundColor: "#D1C8BC" },
  btnTxt: { color: "#fff", fontSize: 24, fontWeight: "bold", lineHeight: 28 },
  center: { alignItems: "center" },
  num:    { fontSize: 34, fontWeight: "bold", color: "#18251D" },
  lbl:    { fontSize: 12, color: "#6B7280" },
  warn:   { color: "#DC2626", fontSize: 12, textAlign: "center" },
});