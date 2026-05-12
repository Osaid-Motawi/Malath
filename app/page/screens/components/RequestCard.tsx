import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  image?: string;
  title: string;
  lines: string[];
  onAccept: () => void;
  onReject: () => void;
}

export default function RequestCard({
  image,
  title,
  lines,
  onAccept,
  onReject,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Ionicons name="image-outline" size={26} color="#9CA3AF" />
          </View>
        )}

        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{title}</Text>

          {lines.map((line) => (
            <Text key={line} style={styles.cardText}>
              {line}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.rejectBtn]}
          onPress={onReject}
        >
          <Text style={styles.rejectText}>رفض</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.acceptBtn]}
          onPress={onAccept}
        >
          <Text style={styles.acceptText}>قبول</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    elevation: 2,
  },

  cardTop: {
    flexDirection: "row",
    gap: 12,
  },

  image: {
    width: 86,
    height: 86,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },

  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  cardInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "right",
  },

  cardText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "right",
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },

  actionBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: "center",
  },

  acceptBtn: {
    backgroundColor: "#6A0DAD",
  },

  rejectBtn: {
    backgroundColor: "#FEE2E2",
  },

  acceptText: {
    color: "#fff",
    fontWeight: "bold",
  },

  rejectText: {
    color: "#DC2626",
    fontWeight: "bold",
  },
});