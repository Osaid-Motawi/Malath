import React, { useEffect, useState } from "react";
import {
    View, Text, StyleSheet, FlatList,
    TouchableOpacity, ActivityIndicator, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../../../FirebaseConfig";
import { Booking, BookingStatus, getMyBookings, cancelBooking } from "../../services/bookingService";

// ─── مساعدات ──────────────────────────────────────────────────────
function formatDisplay(dateStr: string): string {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    const months = ["يناير","فبراير","مارس","أبريل","مايو","يونيو",
        "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
    return `${d} ${months[parseInt(m) - 1]} ${y}`;
}

// ─── حالة الحجز ───────────────────────────────────────────────────
const STATUS: Record<BookingStatus, { label: string; bg: string; color: string; icon: string }> = {
    pending:   { label: "قيد الانتظار", bg: "#FEF3C7", color: "#92400E", icon: "⏳" },
    confirmed: { label: "مؤكد",         bg: "#D1FAE5", color: "#065F46", icon: "✅" },
    cancelled: { label: "ملغي",         bg: "#FEE2E2", color: "#991B1B", icon: "❌" },
    completed: { label: "منتهي",        bg: "#E0E7FF", color: "#3730A3", icon: "🏁" },
};

// ─── Tabs ─────────────────────────────────────────────────────────
type FilterTab = "all" | BookingStatus;
const TABS: { key: FilterTab; label: string }[] = [
    { key: "all",       label: "الكل" },
    { key: "pending",   label: "⏳ انتظار" },
    { key: "confirmed", label: "✅ مؤكد" },
    { key: "completed", label: "🏁 منتهي" },
    { key: "cancelled", label: "❌ ملغي" },
];

// ─── Booking Card ─────────────────────────────────────────────────
function BookingCard({ booking, onCancel }: {
    booking: Booking;
    onCancel: (id: string) => void;
}) {
    const status = STATUS[booking.status];

    return (
        <View style={c.card}>
            <View style={c.cardHeader}>
                <View style={[c.statusBadge, { backgroundColor: status.bg }]}>
                    <Text style={[c.statusText, { color: status.color }]}>
                        {status.icon} {status.label}
                    </Text>
                </View>
                <Text style={c.chaletName} numberOfLines={1}>{booking.chaletName}</Text>
            </View>

            <View style={c.divider} />

            <View style={c.details}>
                <DetailRow icon="📅" label="تسجيل الدخول" value={formatDisplay(booking.checkIn)} />
                <DetailRow icon="📅" label="تسجيل الخروج" value={formatDisplay(booking.checkOut)} />
                <DetailRow icon="🌙" label="عدد الليالي"   value={`${booking.nights} ليلة`} />
                <DetailRow icon="👥" label="عدد الضيوف"    value={`${booking.guests} أشخاص`} />
                {!!booking.notes && (
                    <DetailRow icon="📝" label="ملاحظات" value={booking.notes} />
                )}
            </View>

            <View style={c.divider} />

            <View style={c.priceRow}>
                <Text style={c.totalPrice}>{booking.totalPrice} ₪</Text>
                <Text style={c.priceLabel}>المجموع الكلي</Text>
            </View>

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

// ─── MyBookingPage ────────────────────────────────────────────────
export default function MyBookingPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<FilterTab>("all");

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchBookings();
            } else {
                setBookings([]);
                setLoading(false);
            }
        });
        return unsub;
    }, []);

    async function fetchBookings() {
        setLoading(true);
        try {
            const data = await getMyBookings();
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
                <View style={p.center}>
                    <ActivityIndicator size="large" color="#2C1A12" />
                </View>
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

            {/* Tabs */}
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
                        {activeTab === "all"
                            ? "لم تقم بأي حجز بعد"
                            : `لا يوجد حجوزات بحالة ${TABS.find(t => t.key === activeTab)?.label}`}
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
const c = StyleSheet.create({
    card: {
        backgroundColor: "#fff", borderRadius: 16, marginBottom: 16,
        shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.07, shadowRadius: 6, elevation: 2, overflow: "hidden",
    },
    cardHeader:    { flexDirection: "row", justifyContent: "space-between",
        alignItems: "center", padding: 14, gap: 10 },
    chaletName:    { fontSize: 15, fontWeight: "700", color: "#1a1a1a", flex: 1, textAlign: "right" },
    statusBadge:   { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
    statusText:    { fontSize: 12, fontWeight: "700" },
    divider:       { height: 1, backgroundColor: "#F3F4F6" },
    details:       { padding: 14, gap: 8 },
    detailRow:     { flexDirection: "row", justifyContent: "space-between" },
    detailLabel:   { fontSize: 13, color: "#6B7280" },
    detailVal:     { fontSize: 13, fontWeight: "600", color: "#1a1a1a" },
    priceRow:      { flexDirection: "row", justifyContent: "space-between",
        alignItems: "center", backgroundColor: "#F5F0EB", padding: 14 },
    priceLabel:    { fontSize: 13, color: "#6B7280" },
    totalPrice:    { fontSize: 16, fontWeight: "bold", color: "#2C1A12" },
    cancelBtn:     { margin: 12, backgroundColor: "#FEE2E2",
        borderRadius: 10, padding: 12, alignItems: "center" },
    cancelBtnText: { color: "#DC2626", fontWeight: "700", fontSize: 14 },
});

const p = StyleSheet.create({
    safe:          { flex: 1, backgroundColor: "#F5F0EB" },
    center:        { flex: 1, justifyContent: "center", alignItems: "center" },
    header:        { flexDirection: "row", alignItems: "center", gap: 10,
        paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
    title:         { fontSize: 26, fontWeight: "bold", color: "#1a1a1a" },
    countBadge:    { backgroundColor: "#2C1A12", borderRadius: 12,
        paddingHorizontal: 8, paddingVertical: 2 },
    countText:     { color: "#fff", fontSize: 13, fontWeight: "bold" },
    tabs:          { paddingHorizontal: 20, gap: 8, paddingBottom: 12 },
    tab:           { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
        backgroundColor: "#fff", borderWidth: 1, borderColor: "#E2D9D0" },
    tabActive:     { backgroundColor: "#2C1A12", borderColor: "#2C1A12" },
    tabText:       { fontSize: 13, color: "#6B7280", fontWeight: "600" },
    tabTextActive: { color: "#fff" },
    list:          { paddingHorizontal: 20, paddingBottom: 30 },
    empty:         { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
    emptyIcon:     { fontSize: 60 },
    emptyText:     { fontSize: 20, fontWeight: "bold", color: "#374151" },
    emptySub:      { fontSize: 14, color: "#9CA3AF", textAlign: "center" },
});