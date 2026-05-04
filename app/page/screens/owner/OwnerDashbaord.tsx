import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Booking } from "../../services/bookingService";
import { Chalet } from "../../services/chaletService";
import {
  approveChalet,
  confirmBooking,
  getOwnerPendingBookings,
  getPendingChalets,
  rejectBooking,
  rejectChalet,
} from "../../services/ownerService";
import StorageService from "../../services/StorageService";

export default function OwnerDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [chalets, setChalets] = useState<Chalet[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [])
  );

  async function loadDashboard() {
    setLoading(true);

    const user = await StorageService.getUser();

    if (user?.role !== "owner") {
      Alert.alert("غير مسموح", "هذه الصفحة خاصة بالمالك فقط");
      router.back();
      return;
    }

    const [pendingBookings, pendingChalets] = await Promise.all([
      getOwnerPendingBookings(),
      getPendingChalets(),
    ]);

    setBookings(pendingBookings);
    setChalets(pendingChalets);
    setLoading(false);
  }

  async function handleBookingAction(id: string, action: "accept" | "reject") {
    action === "accept" ? await confirmBooking(id) : await rejectBooking(id);
    setBookings((prev) => prev.filter((b) => b.id !== id));
  }

  async function handleChaletAction(id: string, action: "accept" | "reject") {
    action === "accept" ? await approveChalet(id) : await rejectChalet(id);
    setChalets((prev) => prev.filter((c) => c.id !== id));
  }

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
        <Header />

        <View style={styles.statsRow}>
          <Stat title="Pending Bookings" count={bookings.length} />
          <Stat title="Pending Chalets" count={chalets.length} />
        </View>

        <Section title="طلبات الحجز" empty={bookings.length === 0}>
          {bookings.map((b) => (
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
          ))}
        </Section>

        <Section title="طلبات إضافة الشاليهات" empty={chalets.length === 0}>
          {chalets.map((c) => (
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
          ))}
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Header() {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={22} color="#4F2396" />
      </TouchableOpacity>
      <Text style={styles.title}>Owner Dashboard</Text>
      <View style={{ width: 36 }} />
    </View>
  );
}

function Stat({ title, count }: { title: string; count: number }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statNumber}>{count}</Text>
      <Text style={styles.statLabel}>{title}</Text>
    </View>
  );
}

function Section({
  title,
  empty,
  children,
}: {
  title: string;
  empty: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>
      {empty ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>لا يوجد طلبات بانتظار الموافقة</Text>
        </View>
      ) : (
        children
      )}
    </>
  );
}

function RequestCard({
  image,
  title,
  lines,
  onAccept,
  onReject,
}: {
  image?: string;
  title: string;
  lines: string[];
  onAccept: () => void;
  onReject: () => void;
}) {
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
        <TouchableOpacity style={[styles.actionBtn, styles.rejectBtn]} onPress={onReject}>
          <Text style={styles.rejectText}>رفض</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.acceptBtn]} onPress={onAccept}>
          <Text style={styles.acceptText}>قبول</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F3F8" },
  container: { padding: 16, paddingBottom: 40 },

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
    padding: 16,
    alignItems: "center",
    elevation: 2,
  },

  statNumber: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4F2396",
  },

  statLabel: {
    marginTop: 4,
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 10,
    marginTop: 4,
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

  acceptBtn: { backgroundColor: "#4F2396" },
  rejectBtn: { backgroundColor: "#FEE2E2" },

  acceptText: {
    color: "#fff",
    fontWeight: "bold",
  },

  rejectText: {
    color: "#DC2626",
    fontWeight: "bold",
  },
});