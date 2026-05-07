import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import RequestCard from "../components/RequestCard";
import { useOwnerDashboard } from "@/hooks/useOwnerDashboard";

export default function OwnerDashboard() {
  const {
    bookings,
    chalets,
    loading,
    loadDashboard,
    handleBookingAction,
    handleChaletAction,
  } = useOwnerDashboard();

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator size="large" color="#4F2396" style={{ marginTop: 60 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#4F2396" />
          </TouchableOpacity>

          <Text style={styles.title}>Owner Dashboard</Text>

          <View style={{ width: 36 }} />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{bookings.length}</Text>
            <Text style={styles.statText}>Bookings</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{chalets.length}</Text>
            <Text style={styles.statText}>Chalets</Text>
          </View>
        </View>

        <Text style={styles.section}>طلبات الحجز</Text>

        {bookings.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>لا يوجد حجوزات بانتظار الموافقة</Text>
          </View>
        ) : (
          bookings.map((b) => (
            <RequestCard
              key={b.id}
              image={b.chaletImage}
              title={b.chaletName}
              lines={[
                `الدخول: ${b.checkIn}`,
                `الخروج: ${b.checkOut}`,
                `الضيوف: ${b.guests}`,
                `السعر: ${b.totalPrice} ₪`,
              ]}
              onAccept={() => handleBookingAction(b.id, "accept")}
              onReject={() => handleBookingAction(b.id, "reject")}
            />
          ))
        )}

        <Text style={styles.section}>طلبات الشاليهات</Text>

        {chalets.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>لا يوجد شاليهات بانتظار الموافقة</Text>
          </View>
        ) : (
          chalets.map((c) => (
            <RequestCard
              key={c.id}
              image={c.image}
              title={c.name}
              lines={[
                `الموقع: ${c.location}`,
                `السعة: ${c.capacity}`,
                `السعر: ${c.price} ₪ / ليلة`,
              ]}
              onAccept={() => handleChaletAction(c.id, "accept")}
              onReject={() => handleChaletAction(c.id, "reject")}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F4F3F8",
  },

  container: {
    padding: 16,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EDE9FE",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4F2396",
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 22,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    elevation: 2,
  },

  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4F2396",
  },

  statText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },

  section: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 10,
    marginTop: 8,
    textAlign: "right",
  },

  emptyBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
    alignItems: "center",
  },

  emptyText: {
    color: "#9CA3AF",
    fontSize: 14,
  },
});