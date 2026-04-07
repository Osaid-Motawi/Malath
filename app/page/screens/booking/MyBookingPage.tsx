import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator, Image, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Booking, getMyBookings, cancelBooking, BookingStatus } from "../../services/bookingService";

// ─── حالة الحجز badge ─────────────────────────────────────────────
const STATUS_CONFIG: Record<BookingStatus, { label: string; bg: string; color: string; icon: string }> = {
  pending:   { label: "قيد الانتظار", bg: "#FEF3C7", color: "#92400E", icon: "⏳" },
  confirmed: { label: "مؤكد",         bg: "#D1FAE5", color: "#065F46", icon: "✅" },
  cancelled: { label: "ملغي",         bg: "#FEE2E2", color: "#991B1B", icon: "❌" },
  completed: { label: "منتهي",        bg: "#E0E7FF", color: "#3730A3", icon: "🏁" },
};

function StatusBadge({ status }: { status: BookingStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <View style={[badge.box, { backgroundColor: cfg.bg }]}>
      <Text style={[badge.text, { color: cfg.color }]}>{cfg.icon} {cfg.label}</Text>
    </View>
  );
}

function formatDisplay(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  const months = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
  return `${d} ${months[parseInt(m, 10) - 1]} ${y}`;
}

// ─── بطاقة الحجز ──────────────────────────────────────────────────
function BookingCard({ booking, onCancel }: { booking: Booking; onCancel: (id: string) => void }) {
  return (
    <View style={c.card}>
      {/* صورة + اسم */}
      <View style={c.cardTop}>
        {booking.chaletImage ? (
          <Image source={{ uri: booking.chaletImage }} style={c.img} resizeMode="cover" />
        ) : (
          <View style={[c.img, { backgroundColor: "#E5E7EB" }]} />
        )}
        <View style={c.cardTopInfo}>
          <Text style={c.chaletName} numberOfLines={2}>{booking.chaletName}</Text>
          <StatusBadge status={booking.status} />
        </View>
      </View>

      {/* تفاصيل */}
      <View style={c.details}>
        <DetailRow icon="📅" label="الدخول" value={formatDisplay(booking.checkIn)} />
        <DetailRow icon="📅" label="الخروج" value={formatDisplay(booking.checkOut)} />
        <DetailRow icon="🌙" label="الليالي" value={`${booking.nights} ليلة`} />
        <DetailRow icon="👥" label="الضيوف" value={`${booking.guests} أشخاص`} />
        {!!booking.notes && <DetailRow icon="📝" label="ملاحظات" value={booking.notes} />}
      </View>

      {/* السعر */}
      <View style={c.priceBar}>
        <Text style={c.priceLabel}>المجموع الكلي</Text>
        <Text style={c.price}>{booking.totalPrice} ₪</Text>
      </View>

      {/* زر الإلغاء - فقط إذا pending */}
      {booking.status === "pending" && (
        <TouchableOpacity style={c.cancelBtn} onPress={() => onCancel(booking.id)}>
          <Text style={c.cancelBtnText}>إلغاء الحجز</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={c.detailRow}>
      <Text style={c.detailVal}>{value}</Text>
      <Text style={c.detailLabel}>{icon} {label}</Text>
    </View>
  );
}

// ─── MyBookingPage ─────────────────────────────────────────────────
type FilterTab = "all" | BookingStatus;

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all",       label: "الكل" },
  { key: "pending",   label: "⏳ انتظار" },
  { key: "confirmed", label: "✅ مؤكد" },
  { key: "completed", label: "🏁 منتهي" },
  { key: "cancelled", label: "❌ ملغي" },
];

export default function MyBookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setLoading(true);
    try {
      const data = await getMyBookings();
      // ترتيب من الأحدث للأقدم
      data.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      setBookings(data);
    } catch {
      Alert.alert("خطأ", "فشل تحميل الحجوزات");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(bookingId: string) {
    Alert.alert(
      "إلغاء الحجز",
      "هل أنت متأكد أنك تريد إلغاء هذا الحجز؟",
      [
        { text: "تراجع", style: "cancel" },
        {
          text: "نعم، إلغاء",
          style: "destructive",
          onPress: async () => {
            await cancelBooking(bookingId);
            setBookings(prev =>
              prev.map(b => b.id === bookingId ? { ...b, status: "cancelled" } : b)
            );
          },
        },
      ]
    );
  }

  const filtered = activeTab === "all"
    ? bookings
    : bookings.filter(b => b.status === activeTab);

  if (loading) {
    return (
      <SafeAreaView style={p.safe}>
        <ActivityIndicator size="large" color="#2C1A12" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={p.safe}>
      {/* Header */}
      <View style={p.header}>
        <Text style={p.title}>حجوزاتي</Text>
        {bookings.length > 0 && (
          <View style={p.countBadge}>
            <Text style={p.countText}>{bookings.length}</Text>
          </View>
        )}
      </View>

      {/* Filter Tabs */}
      <FlatList
        horizontal
        data={TABS}
        keyExtractor={t => t.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={p.tabs}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[p.tab, activeTab === item.key && p.tabActive]}
            onPress={() => setActiveTab(item.key)}
          >
            <Text style={[p.tabText, activeTab === item.key && p.tabTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* القائمة */}
      {filtered.length === 0 ? (
        <View style={p.empty}>
          <Text style={p.emptyIcon}>🗓️</Text>
          <Text style={p.emptyText}>لا توجد حجوزات</Text>
          <Text style={p.emptySub}>
            {activeTab === "all" ? "لم تقم بأي حجز بعد" : `لا يوجد حجوزات بحالة ${TABS.find(t=>t.key===activeTab)?.label}`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          contentContainerStyle={p.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <BookingCard booking={item} onCancel={handleCancel} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────
const badge = StyleSheet.create({
  box:  { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start" },
  text: { fontSize: 12, fontWeight: "700" },
});

const c = StyleSheet.create({
  card: {
    backgroundColor: "#fff", borderRadius: 16, marginBottom: 16, overflow: "hidden",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
  cardTop:     { flexDirection: "row", gap: 12, padding: 12 },
  img:         { width: 80, height: 80, borderRadius: 10 },
  cardTopInfo: { flex: 1, gap: 8, justifyContent: "center" },
  chaletName:  { fontSize: 15, fontWeight: "700", color: "#1a1a1a", textAlign: "right" },
  details:     { paddingHorizontal: 14, paddingBottom: 12, gap: 6 },
  detailRow:   { flexDirection: "row", justifyContent: "space-between" },
  detailLabel: { fontSize: 13, color: "#6B7280" },
  detailVal:   { fontSize: 13, fontWeight: "600", color: "#1a1a1a" },
  priceBar:    {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "#F5F0EB", paddingHorizontal: 14, paddingVertical: 10,
  },
  priceLabel:  { fontSize: 13, color: "#6B7280" },
  price:       { fontSize: 16, fontWeight: "bold", color: "#2C1A12" },
  cancelBtn:   {
    margin: 12, marginTop: 8, backgroundColor: "#FEE2E2",
    borderRadius: 10, padding: 12, alignItems: "center",
  },
  cancelBtnText: { color: "#DC2626", fontWeight: "700", fontSize: 14 },
});

const p = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: "#F5F0EB" },
  header:     { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title:      { fontSize: 26, fontWeight: "bold", color: "#1a1a1a" },
  countBadge: { backgroundColor: "#2C1A12", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  countText:  { color: "#fff", fontSize: 13, fontWeight: "bold" },
  tabs:       { paddingHorizontal: 20, gap: 8, paddingBottom: 12 },
  tab:        {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: "#fff", borderWidth: 1, borderColor: "#E2D9D0",
  },
  tabActive:     { backgroundColor: "#2C1A12", borderColor: "#2C1A12" },
  tabText:       { fontSize: 13, color: "#6B7280", fontWeight: "600" },
  tabTextActive: { color: "#fff" },
  list:       { paddingHorizontal: 20, paddingBottom: 30 },
  empty:      { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  emptyIcon:  { fontSize: 60 },
  emptyText:  { fontSize: 20, fontWeight: "bold", color: "#374151" },
  emptySub:   { fontSize: 14, color: "#9CA3AF", textAlign: "center" },
});