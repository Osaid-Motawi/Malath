import React from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { UsersIcon } from "./CustomIcon";

interface Props {
  guests: number;
  capacity: number;
  onChange: (value: number) => void;
}

const PURPLE = "#6A0DAD";

export default function GuestCounter({
  guests,
  capacity,
  onChange,
}: Props) {
  return (
    <View style={s.section}>
      <View style={s.sectionHeader}>
        <UsersIcon />

        <Text style={s.sectionTitle}>
          عدد الضيوف
        </Text>
      </View>

      <View style={s.counterBox}>
        <TouchableOpacity
          style={[
            s.btn,
            guests <= 1 && s.btnOff,
          ]}
          disabled={guests <= 1}
          onPress={() =>
            onChange(Math.max(1, guests - 1))
          }
        >
          <Text style={s.btnTxt}>−</Text>
        </TouchableOpacity>

        <View style={s.center}>
          <Text style={s.num}>{guests}</Text>

          <Text style={s.lbl}>
            أشخاص
          </Text>
        </View>

        <TouchableOpacity
          style={[
            s.btn,
            guests >= capacity && s.btnOff,
          ]}
          disabled={guests >= capacity}
          onPress={() =>
            onChange(Math.min(capacity, guests + 1))
          }
        >
          <Text style={s.btnTxt}>+</Text>
        </TouchableOpacity>
      </View>

      {guests >= capacity && (
        <Text style={s.warn}>
          وصلت للحد الأقصى ({capacity} أشخاص)
        </Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EEE7FA",
    gap: 16,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "flex-end",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: PURPLE,
  },

  counterBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FAF7FF",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#E5D8FA",
    paddingVertical: 16,
    paddingHorizontal: 18,
  },

  btn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: PURPLE,
    justifyContent: "center",
    alignItems: "center",
  },

  btnOff: {
    backgroundColor: "#CDB8E8",
  },

  btnTxt: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 30,
  },

  center: {
    alignItems: "center",
    gap: 2,
  },

  num: {
    fontSize: 34,
    fontWeight: "900",
    color: PURPLE,
  },

  lbl: {
    fontSize: 13,
    color: "#7C7C7C",
    fontWeight: "700",
  },

  warn: {
    color: "#DC2626",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "700",
  },
});