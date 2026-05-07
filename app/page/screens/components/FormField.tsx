import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: "default" | "numeric";
  multiline?: boolean;
  flex?: boolean;
};

export default function FormField({ label, placeholder, value, onChangeText, keyboardType, multiline, flex }: Props) {
  return (
    <View style={[styles.wrapper, flex && { flex: 1 }]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multiline]}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType ?? "default"}
        multiline={multiline}
        textAlign="right"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 5 },
  label: { fontSize: 13, fontWeight: "600", color: "#374151", textAlign: "right" },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: "#111827" },
  multiline: { minHeight: 90, textAlignVertical: "top" },
});