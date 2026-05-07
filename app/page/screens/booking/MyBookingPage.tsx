import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Booking, BookingStatus, getMyBookings, deleteBooking } from "../../services/bookingService";
import BookingCard from "../components/BookingCard";
import { BookingStepsIcon } from "../components/CustomIcon";

type Tab = "all" | BookingStatus;

const TABS: { key: Tab; label: string }[] = [
  { key: "all",       label: "الكل"    },
  { key: "pending",   label: "انتظار"  },
  { key: "confirmed", label: "مؤكد"    },
  { key: "rejected",  label: "مرفوض"   },
];

export default function MyBookingPage() {
  const [bookings,  setBookings]  = useState<Booking[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("all");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await getMyBookings();
    data.sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
    setBookings(data);
    setLoading(false);
  }

  function handleDelete(id: string) {
    Alert.alert("إلغاء الحجز", "هل أنت متأكد أنك تريد إلغاء هذا الحجز؟", [
      { text: "تراجع", style: "cancel" },
      {
        text: "نعم، إلغاء", style: "destructive",
        onPress: async () => {
          try {
            await deleteBooking(id);
            setBookings(prev => prev.filter(b => b.id !== id));
          } catch {
            Alert.alert("خطأ", "فشل إلغاء الحجز");
          }
        },
      },
    ]);
  }

  const filtered = activeTab === "all"
    ? bookings
    : bookings.filter(b => b.status === activeTab);

  if (loading) {
    return (
      <SafeAreaView style={s.safe}>
        <ActivityIndicator size="large" color="#31202A" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>

      
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <BookingStepsIcon />
        </TouchableOpacity>
        <Text style={s.title}>حجوزاتي</Text>
        {bookings.length > 0 && (
          <View style={s.countBadge}>
            <Text style={s.countTxt}>{bookings.length}</Text>
          </View>
        )}
      </View>

      
      <FlatList
        horizontal data={TABS} keyExtractor={t => t.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.tabs}
        renderItem={({ item: t }) => (
          <TouchableOpacity
            style={[s.tab, activeTab === t.key && s.tabActive]}
            onPress={() => setActiveTab(t.key)}>
            <Text style={[s.tabTxt, activeTab === t.key && s.tabTxtActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      
      {filtered.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyTxt}>لا توجد حجوزات</Text>
          <Text style={s.emptySub}>
            {activeTab === "all" ? "لم تقم بأي حجز بعد" : "لا يوجد حجوزات بهذه الحالة"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <BookingCard item={item} onDelete={handleDelete} />
          )}
        />
      )}

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: "#F3F0E9" },
  header:     { flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  backBtn:    { width: 36, height: 36, justifyContent: "center", alignItems: "center" },
  title:      { flex: 1, fontSize: 22, fontWeight: "bold", color: "#18251D" },
  countBadge: { backgroundColor: "#31202A", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  countTxt:   { color: "#fff", fontSize: 13, fontWeight: "bold" },
  tabs:       { paddingHorizontal: 20, gap: 8, paddingBottom: 12 },
  tab:        { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: "#fff", borderWidth: 1, borderColor: "#D1C8BC" },
  tabActive:    { backgroundColor: "#31202A", borderColor: "#31202A" },
  tabTxt:       { fontSize: 13, color: "#6B7280", fontWeight: "600" },
  tabTxtActive: { color: "#fff" },
  list:  { paddingHorizontal: 20, paddingBottom: 30 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", gap: 8 },
  emptyTxt: { fontSize: 18, fontWeight: "bold", color: "#374151" },
  emptySub: { fontSize: 14, color: "#9CA3AF", textAlign: "center" },
});