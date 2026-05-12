import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Booking,
  BookingStatus,
  deleteBooking,
  getMyBookings,
} from "../../services/bookingService";

import BookingCard from "../components/BookingCard";

type Tab = "all" | BookingStatus;

const PURPLE = "#6A0DAD";

const TABS: { key: Tab; label: string }[] = [
  { key: "rejected", label: "مرفوض" },
  { key: "confirmed", label: "مؤكد" },
  { key: "pending", label: "انتظار" },
  { key: "all", label: "الكل" },
];

export default function MyBookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("all");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    const data = await getMyBookings();

    data.sort(
      (a, b) =>
        (b.createdAt?.toMillis?.() ?? 0) -
        (a.createdAt?.toMillis?.() ?? 0)
    );

    setBookings(data);
    setLoading(false);
  }

  function handleDelete(id: string) {
    Alert.alert("إلغاء الحجز", "هل أنت متأكد أنك تريد إلغاء هذا الحجز؟", [
      { text: "تراجع", style: "cancel" },
      {
        text: "نعم، إلغاء",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteBooking(id);
            setBookings((prev) => prev.filter((b) => b.id !== id));
          } catch {
            Alert.alert("خطأ", "فشل إلغاء الحجز");
          }
        },
      },
    ]);
  }

  const filtered =
    activeTab === "all"
      ? bookings
      : bookings.filter((b) => b.status === activeTab);

  if (loading) {
    return (
      <SafeAreaView style={s.safe}>
        <ActivityIndicator size="large" color={PURPLE} style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={s.backBtn}
          activeOpacity={0.8}
        >
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>

        <Text style={s.title}>حجوزاتي</Text>
      </View>

      <View style={s.tabsWrapper}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[s.tab, activeTab === t.key && s.tabActive]}
            onPress={() => setActiveTab(t.key)}
            activeOpacity={0.85}
          >
            <Text style={[s.tabTxt, activeTab === t.key && s.tabTxtActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filtered.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyTxt}>لا توجد حجوزات</Text>

          <Text style={s.emptySub}>
            {activeTab === "all"
              ? "لم تقم بأي حجز بعد"
              : "لا يوجد حجوزات بهذه الحالة"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BookingCard item={item} onDelete={handleDelete} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.list}
          ItemSeparatorComponent={() => <View style={s.separator} />}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
  },

  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F4ECFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6D7FF",
  },

  backArrow: {
    fontSize: 26,
    fontWeight: "900",
    color: PURPLE,
    lineHeight: 28,
  },

  title: {
    flex: 1,
    textAlign: "right",
    marginRight: 14,
    fontSize: 28,
    fontWeight: "900",
    color: PURPLE,
  },

  tabsWrapper: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
  },

  tab: {
    width: "23%",
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FAF7FF",
    borderWidth: 1.5,
    borderColor: "#E5D8FA",
    justifyContent: "center",
    alignItems: "center",
  },

  tabActive: {
    backgroundColor: PURPLE,
    borderColor: PURPLE,
  },

  tabTxt: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "800",
  },

  tabTxtActive: {
    color: "#FFFFFF",
  },

  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 30,
  },

  separator: {
    height: 12,
  },

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 30,
  },

  emptyTxt: {
    fontSize: 20,
    fontWeight: "900",
    color: PURPLE,
    textAlign: "center",
  },

  emptySub: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "700",
  },
});