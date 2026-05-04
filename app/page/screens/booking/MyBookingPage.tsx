import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Booking,
  BookingStatus,
  getMyBookings,
  deleteBooking,
} from "../../services/bookingService";
import { router } from "expo-router";
import Svg, { Path } from "react-native-svg";

/* ───────── Back Icon ───────── */
const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24">
    <Path
      d="M15 6L9 12L15 18"
      stroke="#4F2396"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/* ───────── STATUS ───────── */
const STATUS: Record<
  BookingStatus,
  { label: string; bg: string; color: string; icon: string }
> = {
  pending: {
    label: "قيد الانتظار",
    bg: "#FEF3C7",
    color: "#92400E",
    icon: "⏳",
  },
  confirmed: {
    label: "مؤكد",
    bg: "#D1FAE5",
    color: "#065F46",
    icon: "✅",
  },
  rejected: {
    label: "مرفوض",
    bg: "#FEE2E2",
    color: "#991B1B",
    icon: "❌",
  },
};

/* ───────── Badge ───────── */
function StatusBadge({ status }: { status: BookingStatus }) {
  const c = STATUS[status];
  return (
    <View style={[stylesBadge.box, { backgroundColor: c.bg }]}>
      <Text style={[stylesBadge.txt, { color: c.color }]}>
        {c.icon} {c.label}
      </Text>
    </View>
  );
}

/* ───────── Date ───────── */
function formatDisplay(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  const months = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];
  return `${d} ${months[parseInt(m, 10) - 1]} ${y}`;
}

/* ───────── Card ───────── */
function BookingCard({
  item,
  onCancel,
}: {
  item: Booking;
  onCancel: (id: string) => void;
}) {
  return (
    <View style={card.card}>
      <View style={card.cardTop}>
        {item.chaletImage ? (
          <Image source={{ uri: item.chaletImage }} style={card.img} />
        ) : (
          <View style={[card.img, { backgroundColor: "#E5E7EB" }]} />
        )}

        <View style={card.topInfo}>
          <Text style={card.name}>{item.chaletName}</Text>
          <StatusBadge status={item.status} />
        </View>
      </View>

      <View style={card.details}>
        <Row label="📅 الدخول" value={formatDisplay(item.checkIn)} />
        <Row label="📅 الخروج" value={formatDisplay(item.checkOut)} />
        <Row label="👥 الضيوف" value={`${item.guests}`} />
      </View>

      <View style={card.priceBar}>
        <Text style={card.priceVal}>{item.totalPrice} ₪</Text>
        <Text style={card.priceLbl}>المجموع</Text>
      </View>

      {item.status === "pending" && (
        <TouchableOpacity
          style={card.cancelBtn}
          onPress={() => onCancel(item.id)}
        >
          <Text style={card.cancelTxt}>إلغاء الحجز</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/* ───────── Row ───────── */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={card.row}>
      <Text style={card.val}>{value}</Text>
      <Text style={card.lbl}>{label}</Text>
    </View>
  );
}

/* ───────── Tabs ───────── */
type Tab = "all" | BookingStatus;

const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "pending", label: "⏳ انتظار" },
  { key: "confirmed", label: "✅ مؤكد" },
  { key: "rejected", label: "❌ مرفوض" },
];

/* ───────── MAIN ───────── */
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
    setBookings(data);
    setLoading(false);
  }

const handleCancel = async (id: string) => {
  console.log("DELETE START:", id);

  try {
    await deleteBooking(id);

    console.log("DELETE DONE:", id);

    setBookings((prev) => prev.filter((booking) => booking.id !== id));
  } catch (error) {
    console.log("DELETE BOOKING ERROR:", error);
    Alert.alert("خطأ", "فشل إلغاء الحجز");
  }
};
  const filtered =
    activeTab === "all"
      ? bookings
      : bookings.filter((b) => b.status === activeTab);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ActivityIndicator style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={page.safe}>
      {/* HEADER */}
      <View style={page.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <BackIcon />
        </TouchableOpacity>

        <Text style={page.title}>حجوزاتي</Text>
      </View>

      {/* TABS */}
      <FlatList
        horizontal
        data={TABS}
        keyExtractor={(i) => i.key}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              page.tab,
              activeTab === item.key && page.activeTab,
            ]}
            onPress={() => setActiveTab(item.key)}
          >
            <Text
              style={
                activeTab === item.key
                  ? page.activeTabTxt
                  : page.tabTxt
              }
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* LIST */}
      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <BookingCard item={item} onCancel={handleCancel} />
        )}
      />
    </SafeAreaView>
  );
}

/* ───────── STYLES ───────── */
const stylesBadge = StyleSheet.create({
  box: { padding: 5, borderRadius: 10 },
  txt: { fontSize: 12 },
});

const card = StyleSheet.create({
  card: { backgroundColor: "#fff", margin: 10, borderRadius: 15, padding: 10 },
  cardTop: { flexDirection: "row" },
  img: { width: 70, height: 70, borderRadius: 10 },
  topInfo: { marginLeft: 10, justifyContent: "center" },
  name: { fontWeight: "bold" },
  details: { marginTop: 10 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  lbl: { color: "gray" },
  val: { fontWeight: "bold" },
  priceBar: { flexDirection: "row", justifyContent: "space-between" },
  priceVal: { fontWeight: "bold" },
  priceLbl: { color: "gray" },
  cancelBtn: { backgroundColor: "#FEE2E2", padding: 10, marginTop: 10 },
  cancelTxt: { color: "red", textAlign: "center" },
});

const page = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F3F0E9" },
  header: { flexDirection: "row", padding: 20, gap: 10 },
  title: { fontSize: 22, fontWeight: "bold" },
  tab: { padding: 10, margin: 5, borderRadius: 20, backgroundColor: "#eee" },
  activeTab: { backgroundColor: "#4F2396" },
  tabTxt: { color: "#000" },
  activeTabTxt: { color: "#fff" },
});