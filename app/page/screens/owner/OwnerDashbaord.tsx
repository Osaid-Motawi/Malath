import { useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
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
        <ActivityIndicator size="large" color="#4F2396" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Owner Dashboard</Text>

        <Text style={styles.section}>طلبات الحجز</Text>

        {bookings.map((b) => (
          <RequestCard
            key={b.id}
            image={b.chaletImage}
            title={b.chaletName}
            lines={[
              `الدخول: ${b.checkIn}`,
              `الخروج: ${b.checkOut}`,
            ]}
            onAccept={() => handleBookingAction(b.id, "accept")}
            onReject={() => handleBookingAction(b.id, "reject")}
          />
        ))}

        <Text style={styles.section}>طلبات الشاليهات</Text>

        {chalets.map((c) => (
          <RequestCard
            key={c.id}
            image={c.image}
            title={c.name}
            lines={[
              `الموقع: ${c.location}`,
              `السعر: ${c.price} ₪`,
            ]}
            onAccept={() => handleChaletAction(c.id, "accept")}
            onReject={() => handleChaletAction(c.id, "reject")}
          />
        ))}
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
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4F2396",
    marginBottom: 20,
  },

  section: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 12,
  },
});