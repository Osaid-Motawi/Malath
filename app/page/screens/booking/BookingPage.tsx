import React, { useState } from "react";
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, TextInput, ActivityIndicator, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../../../FirebaseConfig";
import { addBooking, calcNights } from "../../services/bookingService";

// ─── الشاليه التجريبي ─────────────────────────────────────────────
const CHALET = {
    id: "qalqilia",
    name: "شاليه قلقيلية",
    price: 800,
    capacity: 5,
};

// ─── مساعدات ──────────────────────────────────────────────────────
function toISO(date: Date): string {
    return date.toISOString().split("T")[0];
}

function formatDisplay(dateStr: string): string {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    const months = ["يناير","فبراير","مارس","أبريل","مايو","يونيو",
        "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
    return `${d} ${months[parseInt(m) - 1]} ${y}`;
}

// ─── Mini Calendar ────────────────────────────────────────────────
function MiniCalendar({ selectedStart, selectedEnd, onSelect, minDate }: {
    selectedStart: string;
    selectedEnd: string;
    onSelect: (date: string) => void;
    minDate: string;
}) {
    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());

    const monthNames = ["يناير","فبراير","مارس","أبريل","مايو","يونيو",
        "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const cells: (number | null)[] = [
        ...Array(firstDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    return (
        <View style={cal.container}>
            <View style={cal.nav}>
                <TouchableOpacity onPress={prevMonth} style={cal.navBtn}>
                    <Text style={cal.navText}>‹</Text>
                </TouchableOpacity>
                <Text style={cal.monthTitle}>{monthNames[viewMonth]} {viewYear}</Text>
                <TouchableOpacity onPress={nextMonth} style={cal.navBtn}>
                    <Text style={cal.navText}>›</Text>
                </TouchableOpacity>
            </View>

            <View style={cal.dayLabels}>
                {["ح","ن","ث","ر","خ","ج","س"].map(d => (
                    <Text key={d} style={cal.dayLabel}>{d}</Text>
                ))}
            </View>

            <View style={cal.grid}>
                {cells.map((day, idx) => {
                    if (!day) return <View key={`e-${idx}`} style={cal.cell} />;

                    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                    const isPast = dateStr < minDate;
                    const isStart = dateStr === selectedStart;
                    const isEnd = dateStr === selectedEnd;
                    const inRange = selectedStart && selectedEnd &&
                        dateStr > selectedStart && dateStr < selectedEnd;

                    return (
                        <TouchableOpacity
                            key={dateStr}
                            style={[
                                cal.cell,
                                isPast && cal.pastCell,
                                inRange && cal.rangeCell,
                                (isStart || isEnd) && cal.selectedCell,
                            ]}
                            onPress={() => !isPast && onSelect(dateStr)}
                            disabled={isPast}
                        >
                            <Text style={[
                                cal.cellText,
                                isPast && cal.pastText,
                                inRange && cal.rangeText,
                                (isStart || isEnd) && cal.selectedText,
                            ]}>
                                {day}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

// ─── Booking Page ─────────────────────────────────────────────────
export default function BookingPage() {
    const todayStr = toISO(new Date());
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(1);
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [selecting, setSelecting] = useState<"checkIn" | "checkOut">("checkIn");
    const [step, setStep] = useState<"details" | "summary">("details");

    const nights = checkIn && checkOut ? calcNights(checkIn, checkOut) : 0;
    const totalPrice = nights * CHALET.price;

    function handleDateSelect(dateStr: string) {
        if (selecting === "checkIn") {
            setCheckIn(dateStr);
            setCheckOut("");
            setSelecting("checkOut");
        } else {
            if (dateStr <= checkIn) {
                setCheckIn(dateStr);
                setCheckOut("");
                setSelecting("checkOut");
            } else {
                setCheckOut(dateStr);
            }
        }
    }

    function validate(): string | null {
        if (!checkIn) return "يرجى تحديد تاريخ الدخول";
        if (!checkOut) return "يرجى تحديد تاريخ الخروج";
        if (nights < 1) return "يجب أن تكون مدة الحجز ليلة واحدة على الأقل";
        if (guests < 1) return "عدد الضيوف يجب أن يكون 1 على الأقل";
        if (guests > CHALET.capacity) return `الحد الأقصى ${CHALET.capacity} أشخاص`;
        return null;
    }

    function resetForm() {
        setStep("details");
        setCheckIn("");
        setCheckOut("");
        setGuests(1);
        setNotes("");
        setSelecting("checkIn");
    }

    async function handleConfirm() {
        const user = auth.currentUser;
        if (!user) {
            Alert.alert("تنبيه", "يجب تسجيل الدخول أولاً");
            return;
        }

        setLoading(true);
        try {
            await addBooking({
                userId: user.uid,
                chaletId: CHALET.id,
                chaletName: CHALET.name,
                chaletImage: "",
                chaletPrice: CHALET.price,
                checkIn,
                checkOut,
                guests,
                notes: notes.trim(),
                totalPrice,
                nights,
                status: "pending",
            });

            Alert.alert(
                "✅ تم الحجز بنجاح!",
                `تم إرسال طلب حجزك لـ ${CHALET.name}.\nسيتم مراجعته قريباً.`,
                [{ text: "حسناً", onPress: resetForm }]
            );
        } catch {
            Alert.alert("خطأ", "حدث خطأ أثناء الحجز، حاول مجدداً");
        } finally {
            setLoading(false);
        }
    }

    // ─── Summary ──────────────────────────────────────────────────────
    if (step === "summary") {
        return (
            <SafeAreaView style={s.safe}>
                <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
                    <TouchableOpacity onPress={() => setStep("details")} style={s.backBtn}>
                        <Text style={s.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={s.pageTitle}>ملخص الحجز</Text>

                    <View style={s.summaryCard}>
                        <Text style={s.chaletName}>{CHALET.name}</Text>
                        <View style={s.divider} />
                        <Row label="تسجيل الدخول" value={formatDisplay(checkIn)} />
                        <Row label="تسجيل الخروج" value={formatDisplay(checkOut)} />
                        <Row label="عدد الليالي" value={`${nights} ليلة`} />
                        <Row label="عدد الضيوف" value={`${guests} أشخاص`} />
                        {!!notes && <Row label="ملاحظات" value={notes} />}
                        <View style={s.divider} />
                        <Row label="السعر / ليلة" value={`${CHALET.price} ₪`} />
                        <Row label={`${nights} × ${CHALET.price} ₪`} value={`${totalPrice} ₪`} />
                        <View style={s.totalRow}>
                            <Text style={s.totalLabel}>المجموع</Text>
                            <Text style={s.totalPrice}>{totalPrice} ₪</Text>
                        </View>
                    </View>

                    <View style={s.pendingBadge}>
                        <Text style={s.pendingText}>⏳ سيكون الحجز قيد الانتظار حتى تأكيد المالك</Text>
                    </View>

                    <TouchableOpacity
                        style={[s.confirmBtn, loading && s.btnDisabled]}
                        onPress={handleConfirm}
                        disabled={loading}
                    >
                        {loading
                            ? <ActivityIndicator color="#fff" />
                            : <Text style={s.btnText}>تأكيد الحجز</Text>}
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        );
    }

    // ─── Details ──────────────────────────────────────────────────────
    return (
        <SafeAreaView style={s.safe}>
            <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
                <Text style={s.pageTitle}>حجز الشاليه</Text>

                {/* معلومات الشاليه */}
                <View style={s.chaletCard}>
                    <Text style={s.chaletName}>{CHALET.name}</Text>
                    <Text style={s.chaletSub}>
                        {CHALET.price} ₪ / ليلة · الحد الأقصى {CHALET.capacity} أشخاص
                    </Text>
                </View>

                {/* التقويم */}
                <View style={s.section}>
                    <Text style={s.sectionTitle}>📅 اختر التواريخ</Text>
                    <View style={s.dateToggle}>
                        <TouchableOpacity
                            style={[s.toggleBtn, selecting === "checkIn" && s.toggleBtnActive]}
                            onPress={() => setSelecting("checkIn")}
                        >
                            <Text style={[s.toggleTxt, selecting === "checkIn" && s.toggleTxtActive]}>
                                الدخول {checkIn ? formatDisplay(checkIn) : ""}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[s.toggleBtn, selecting === "checkOut" && s.toggleBtnActive]}
                            onPress={() => setSelecting("checkOut")}
                        >
                            <Text style={[s.toggleTxt, selecting === "checkOut" && s.toggleTxtActive]}>
                                الخروج {checkOut ? formatDisplay(checkOut) : ""}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <MiniCalendar
                        selectedStart={checkIn}
                        selectedEnd={checkOut}
                        onSelect={handleDateSelect}
                        minDate={todayStr}
                    />

                    {nights > 0 && (
                        <View style={s.nightsBox}>
                            <Text style={s.nightsText}>🌙 {nights} ليلة · الإجمالي: {totalPrice} ₪</Text>
                        </View>
                    )}
                </View>

                {/* عدد الضيوف */}
                <View style={s.section}>
                    <Text style={s.sectionTitle}>👥 عدد الضيوف</Text>
                    <View style={s.guestRow}>
                        <TouchableOpacity
                            style={[s.guestBtn, guests <= 1 && s.guestBtnDisabled]}
                            onPress={() => setGuests(g => Math.max(1, g - 1))}
                            disabled={guests <= 1}
                        >
                            <Text style={s.guestBtnText}>−</Text>
                        </TouchableOpacity>
                        <View style={s.guestCountBox}>
                            <Text style={s.guestCount}>{guests}</Text>
                            <Text style={s.guestLabel}>أشخاص</Text>
                        </View>
                        <TouchableOpacity
                            style={[s.guestBtn, guests >= CHALET.capacity && s.guestBtnDisabled]}
                            onPress={() => setGuests(g => Math.min(CHALET.capacity, g + 1))}
                            disabled={guests >= CHALET.capacity}
                        >
                            <Text style={s.guestBtnText}>+</Text>
                        </TouchableOpacity>
                    </View>
                    {guests >= CHALET.capacity && (
                        <Text style={s.warning}>⚠️ وصلت للحد الأقصى ({CHALET.capacity} أشخاص)</Text>
                    )}
                </View>

                {/* ملاحظات */}
                <View style={s.section}>
                    <Text style={s.sectionTitle}>📝 ملاحظات (اختياري)</Text>
                    <TextInput
                        style={s.notesInput}
                        placeholder="أي طلبات خاصة..."
                        placeholderTextColor="#aaa"
                        multiline
                        numberOfLines={4}
                        value={notes}
                        onChangeText={setNotes}
                        textAlignVertical="top"
                    />
                </View>

                {/* زر المتابعة */}
                <TouchableOpacity
                    style={s.nextBtn}
                    onPress={() => {
                        const err = validate();
                        if (err) { Alert.alert("تنبيه", err); return; }
                        setStep("summary");
                    }}
                >
                    <Text style={s.btnText}>متابعة لمراجعة الحجز</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <View style={s.row}>
            <Text style={s.rowVal}>{value}</Text>
            <Text style={s.rowLabel}>{label}</Text>
        </View>
    );
}

const s = StyleSheet.create({
    safe:            { flex: 1, backgroundColor: "#F5F0EB" },
    scroll:          { paddingHorizontal: 20, paddingBottom: 40, gap: 20 },
    pageTitle:       { fontSize: 22, fontWeight: "bold", color: "#1a1a1a", textAlign: "center", paddingTop: 16 },
    backBtn:         { paddingTop: 16 },
    backIcon:        { fontSize: 22, color: "#1a1a1a" },
    chaletCard:      { backgroundColor: "#fff", borderRadius: 12, padding: 16, gap: 6,
        shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
    chaletName:      { fontSize: 18, fontWeight: "bold", color: "#1a1a1a", textAlign: "right" },
    chaletSub:       { fontSize: 13, color: "#7C5C3E", textAlign: "right" },
    section:         { gap: 12 },
    sectionTitle:    { fontSize: 15, fontWeight: "700", color: "#1a1a1a", textAlign: "right" },
    dateToggle:      { flexDirection: "row", gap: 8 },
    toggleBtn:       { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1.5,
        borderColor: "#E2D9D0", backgroundColor: "#fff", alignItems: "center" },
    toggleBtnActive: { borderColor: "#2C1A12", backgroundColor: "#2C1A12" },
    toggleTxt:       { fontSize: 11, color: "#6B7280", textAlign: "center" },
    toggleTxtActive: { color: "#fff", fontWeight: "600" },
    nightsBox:       { backgroundColor: "#2C1A12", borderRadius: 10, padding: 12, alignItems: "center" },
    nightsText:      { color: "#fff", fontSize: 14, fontWeight: "700" },
    guestRow:        { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 24 },
    guestBtn:        { width: 46, height: 46, borderRadius: 23, backgroundColor: "#2C1A12",
        justifyContent: "center", alignItems: "center" },
    guestBtnDisabled:{ backgroundColor: "#E2D9D0" },
    guestBtnText:    { color: "#fff", fontSize: 22, fontWeight: "bold" },
    guestCountBox:   { alignItems: "center" },
    guestCount:      { fontSize: 32, fontWeight: "bold", color: "#1a1a1a" },
    guestLabel:      { fontSize: 12, color: "#6B7280" },
    warning:         { color: "#DC2626", fontSize: 12, textAlign: "center" },
    notesInput:      { backgroundColor: "#fff", borderRadius: 12, borderWidth: 1,
        borderColor: "#E2D9D0", padding: 14, fontSize: 14, color: "#1a1a1a",
        minHeight: 100, textAlign: "right" },
    nextBtn:         { backgroundColor: "#2C1A12", borderRadius: 12, padding: 16, alignItems: "center" },
    confirmBtn:      { backgroundColor: "#517c63", borderRadius: 12, padding: 16, alignItems: "center" },
    btnDisabled:     { backgroundColor: "#6B7280" },
    btnText:         { color: "#fff", fontSize: 16, fontWeight: "bold" },
    summaryCard:     { backgroundColor: "#fff", borderRadius: 16, padding: 20, gap: 12,
        shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
    divider:         { height: 1, backgroundColor: "#F3F4F6" },
    row:             { flexDirection: "row", justifyContent: "space-between" },
    rowLabel:        { fontSize: 13, color: "#6B7280" },
    rowVal:          { fontSize: 13, fontWeight: "600", color: "#1a1a1a" },
    totalRow:        { flexDirection: "row", justifyContent: "space-between",
        backgroundColor: "#F5F0EB", borderRadius: 10, padding: 12, marginTop: 4 },
    totalLabel:      { fontSize: 15, fontWeight: "bold", color: "#1a1a1a" },
    totalPrice:      { fontSize: 17, fontWeight: "bold", color: "#2C1A12" },
    pendingBadge:    { backgroundColor: "#FEF3C7", borderRadius: 10, padding: 12, alignItems: "center" },
    pendingText:     { color: "#92400E", fontSize: 13, fontWeight: "600", textAlign: "center" },
});

const cal = StyleSheet.create({
    container:   { backgroundColor: "#fff", borderRadius: 16, padding: 16, gap: 10,
        shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
    nav:         { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    navBtn:      { width: 36, height: 36, justifyContent: "center", alignItems: "center" },
    navText:     { fontSize: 24, color: "#2C1A12", fontWeight: "bold" },
    monthTitle:  { fontSize: 15, fontWeight: "bold", color: "#1a1a1a" },
    dayLabels:   { flexDirection: "row", justifyContent: "space-around" },
    dayLabel:    { fontSize: 12, color: "#9CA3AF", width: 36, textAlign: "center" },
    grid:        { flexDirection: "row", flexWrap: "wrap" },
    cell:        { width: "14.28%", aspectRatio: 1, justifyContent: "center", alignItems: "center" },
    pastCell:    { opacity: 0.3 },
    rangeCell:   { backgroundColor: "#F5F0EB" },
    selectedCell:{ backgroundColor: "#2C1A12", borderRadius: 100 },
    cellText:    { fontSize: 13, color: "#1a1a1a" },
    pastText:    { color: "#9CA3AF" },
    rangeText:   { color: "#7C5C3E", fontWeight: "600" },
    selectedText:{ color: "#fff", fontWeight: "bold" },
});