import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { auth } from "../../../../FirebaseConfig";
import { addBooking, calcNights } from "../../services/bookingService";

// ─── تنسيق التاريخ ──────────────────────────────────────────
function formatDisplay(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  const months = [
    "يناير","فبراير","مارس","أبريل","مايو","يونيو",
    "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",
  ];
  return `${d} ${months[parseInt(m, 10) - 1]} ${y}`;
}

// تحويل Date إلى "YYYY-MM-DD"
function toISO(date: Date): string {
  return date.toISOString().split("T")[0];
}

// ─── Mini Calendar ────────────────────────────────────────────────
interface CalendarProps {
  selectedStart: string;
  selectedEnd: string;
  onSelect: (date: string) => void;
  minDate: string;
}

function MiniCalendar({ selectedStart, selectedEnd, onSelect, minDate }: CalendarProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const monthNames = [
    "يناير","فبراير","مارس","أبريل","مايو","يونيو",
    "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",
  ];

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
          const inRange = selectedStart && selectedEnd && dateStr > selectedStart && dateStr < selectedEnd;

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

      {selectedStart && selectedEnd && (
        <View style={cal.legend}>
          <View style={cal.legendItem}>
            <View style={[cal.legendDot, { backgroundColor: "#2C1A12" }]} />
            <Text style={cal.legendText}>تسجيل الدخول: {formatDisplay(selectedStart)}</Text>
          </View>
          <View style={cal.legendItem}>
            <View style={[cal.legendDot, { backgroundColor: "#7C5C3E" }]} />
            <Text style={cal.legendText}>تسجيل الخروج: {formatDisplay(selectedEnd)}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

// ─── Booking Page ─────────────────────────────────────────────────
export default function BookingPage() {
  const params = useLocalSearchParams();
  const chaletId    = params.chaletId as string;
  const chaletName  = params.chaletName as string;
  const chaletImage = params.chaletImage as string;
  const chaletPrice = Number(params.chaletPrice ?? 0);
  const capacity    = Number(params.capacity ?? 1);

  const todayStr = toISO(new Date());

  const [checkIn, setCheckIn]   = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests]     = useState(1);
  const [notes, setNotes]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [step, setStep]         = useState<"details" | "summary">("details");

  // يحدد أي حقل يتم تحديده بالتقويم
  const [selecting, setSelecting] = useState<"checkIn" | "checkOut">("checkIn");

  const nights    = checkIn && checkOut ? calcNights(checkIn, checkOut) : 0;
  const totalPrice = nights * chaletPrice;

  // ─── اختيار تاريخ من التقويم ───────────────────────────────────
  function handleDateSelect(dateStr: string) {
    if (selecting === "checkIn") {
      setCheckIn(dateStr);
      setCheckOut("");
      setSelecting("checkOut");
    } else {
      if (dateStr <= checkIn) {
        // اختار تاريخ قبل أو نفس الدخول  ابدأ من جديد
        setCheckIn(dateStr);
        setCheckOut("");
        setSelecting("checkOut");
      } else {
        setCheckOut(dateStr);
      }
    }
  }

  // ─── Validation ────────────────────────────────────────────────
  function validate(): string | null {
    if (!checkIn)               return "يرجى تحديد تاريخ تسجيل الدخول";
    if (!checkOut)              return "يرجى تحديد تاريخ تسجيل الخروج";
    if (nights < 1)             return "يجب أن تكون مدة الحجز ليلة واحدة على الأقل";
    if (guests < 1)             return "عدد الضيوف يجب أن يكون 1 على الأقل";
    if (guests > capacity)      return `الحد الأقصى للضيوف في هذا الشاليه هو ${capacity} أشخاص`;
    return null;
  }

  // ─── تأكيد الحجز ───────────────────────────────────────────────
  async function handleConfirmBooking() {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("تنبيه", "يجب تسجيل الدخول أولاً");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      await addBooking({
        userId:       user.uid,
        chaletId,
        chaletName,
        chaletImage,
        chaletPrice,
        checkIn,
        checkOut,
        guests,
        notes:        notes.trim(),
        totalPrice,
        nights,
        status:       "pending",
      });

      Alert.alert(
        "✅ تم الحجز بنجاح",
        `تم إرسال طلب حجزك لـ ${chaletName}. سيتم مراجعته قريباً.`,
        [{ text: "حسناً", onPress: () => router.replace("/(tabs)") }]
      );
    } catch (e) {
      Alert.alert("خطأ", "حدث خطأ أثناء الحجز، حاول مجدداً");
    } finally {
      setLoading(false);
    }
  }

  function goToSummary() {
    const err = validate();
    if (err) { Alert.alert("تنبيه", err); return; }
    setStep("summary");
  }

  // ─── شاشة الملخص ───────────────────────────────────────────────
  if (step === "summary") {
    return (
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={s.topBar}>
            <TouchableOpacity onPress={() => setStep("details")} style={s.backBtn}>
              <Text style={s.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={s.pageTitle}>ملخص الحجز</Text>
            <View style={{ width: 36 }} />
          </View>

          {/* صورة الشاليه */}
          {!!chaletImage && (
            <Image source={{ uri: chaletImage }} style={s.chaletImg} resizeMode="cover" />
          )}

          <View style={s.summaryCard}>
            <Text style={s.chaletName}>{chaletName}</Text>

            <View style={s.divider} />

            <SummaryRow label="تسجيل الدخول" value={formatDisplay(checkIn)} />
            <SummaryRow label="تسجيل الخروج" value={formatDisplay(checkOut)} />
            <SummaryRow label="عدد الليالي" value={`${nights} ليلة`} />
            <SummaryRow label="عدد الضيوف" value={`${guests} أشخاص`} />
            {!!notes && <SummaryRow label="ملاحظات" value={notes} />}

            <View style={s.divider} />

            <View style={s.priceRow}>
              <Text style={s.priceLabel}>السعر لكل ليلة</Text>
              <Text style={s.priceVal}>{chaletPrice} ₪</Text>
            </View>
            <View style={s.priceRow}>
              <Text style={s.priceLabel}>{nights} ليلة × {chaletPrice} ₪</Text>
              <Text style={s.priceVal}>{totalPrice} ₪</Text>
            </View>

            <View style={s.totalRow}>
              <Text style={s.totalLabel}>المجموع</Text>
              <Text style={s.totalPrice}>{totalPrice} ₪</Text>
            </View>
          </View>

          {/* حالة الحجز */}
          <View style={s.statusBadgeRow}>
            <View style={s.pendingBadge}>
              <Text style={s.pendingText}>⏳ سيكون الحجز بحالة انتظار حتى تأكيد المالك</Text>
            </View>
          </View>

          {/* زر التأكيد */}
          <TouchableOpacity
            style={[s.confirmBtn, loading && s.btnDisabled]}
            onPress={handleConfirmBooking}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.confirmBtnText}>تأكيد الحجز</Text>}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── شاشة التفاصيل (الرئيسية) ─────────────────────────────────
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Text style={s.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={s.pageTitle}>حجز الشاليه</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* معلومات الشاليه */}
        <View style={s.chaletCard}>
          {!!chaletImage && (
            <Image source={{ uri: chaletImage }} style={s.chaletThumb} resizeMode="cover" />
          )}
          <View style={s.chaletInfo}>
            <Text style={s.chaletName}>{chaletName}</Text>
            <Text style={s.chaletPrice}>{chaletPrice} ₪ / ليلة</Text>
            <Text style={s.capacityNote}>الحد الأقصى: {capacity} أشخاص</Text>
          </View>
        </View>

        {/* ─── التقويم ─────────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>📅 اختر التواريخ</Text>

          {/* أزرار اختيار نوع التاريخ */}
          <View style={s.dateToggle}>
            <TouchableOpacity
              style={[s.dateToggleBtn, selecting === "checkIn" && s.dateToggleBtnActive]}
              onPress={() => setSelecting("checkIn")}
            >
              <Text style={[s.dateToggleTxt, selecting === "checkIn" && s.dateToggleTxtActive]}>
                تسجيل الدخول {checkIn ? `(${formatDisplay(checkIn)})` : ""}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.dateToggleBtn, selecting === "checkOut" && s.dateToggleBtnActive]}
              onPress={() => setSelecting("checkOut")}
            >
              <Text style={[s.dateToggleTxt, selecting === "checkOut" && s.dateToggleTxtActive]}>
                تسجيل الخروج {checkOut ? `(${formatDisplay(checkOut)})` : ""}
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

        {/* ─── عدد الضيوف ──────────────────────────────── */}
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
              style={[s.guestBtn, guests >= capacity && s.guestBtnDisabled]}
              onPress={() => setGuests(g => Math.min(capacity, g + 1))}
              disabled={guests >= capacity}
            >
              <Text style={s.guestBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          {guests >= capacity && (
            <Text style={s.capacityWarning}>⚠️ وصلت للحد الأقصى ({capacity} أشخاص)</Text>
          )}
        </View>

        {/* ─── ملاحظات ─────────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>📝 ملاحظات إضافية (اختياري)</Text>
          <TextInput
            style={s.notesInput}
            placeholder="أي طلبات أو ملاحظات خاصة..."
            placeholderTextColor="#aaa"
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            textAlignVertical="top"
          />
        </View>

        {/* ─── زر المتابعة ─────────────────────────────── */}
        <TouchableOpacity style={s.nextBtn} onPress={goToSummary}>
          <Text style={s.nextBtnText}>متابعة لمراجعة الحجز</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── مكوّن صف الملخص ──────────────────────────────────────────────
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.summaryRow}>
      <Text style={s.summaryVal}>{value}</Text>
      <Text style={s.summaryLabel}>{label}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: "#F5F0EB" },
  scroll:     { paddingHorizontal: 20, paddingBottom: 40, gap: 20 },

  topBar:     { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 8 },
  backBtn:    { width: 36, height: 36, justifyContent: "center", alignItems: "center" },
  backIcon:   { fontSize: 22, color: "#1a1a1a" },
  pageTitle:  { fontSize: 18, fontWeight: "bold", color: "#1a1a1a" },

  // كارت الشاليه
  chaletCard: {
    flexDirection: "row", backgroundColor: "#fff", borderRadius: 12,
    overflow: "hidden", gap: 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  chaletThumb:  { width: 90, height: 90 },
  chaletInfo:   { flex: 1, justifyContent: "center", gap: 4, paddingRight: 12 },
  chaletName:   { fontSize: 15, fontWeight: "700", color: "#1a1a1a", textAlign: "right" },
  chaletPrice:  { fontSize: 13, color: "#7C5C3E", fontWeight: "600", textAlign: "right" },
  capacityNote: { fontSize: 12, color: "#6B7280", textAlign: "right" },
  chaletImg:    { width: "100%", height: 200, borderRadius: 12 },

  // السيكشن
  section:      { gap: 12 },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#1a1a1a", textAlign: "right" },

  // أزرار اختيار التاريخ
  dateToggle:          { flexDirection: "row", gap: 8 },
  dateToggleBtn:       {
    flex: 1, paddingVertical: 10, paddingHorizontal: 8,
    borderRadius: 10, borderWidth: 1.5, borderColor: "#E2D9D0",
    backgroundColor: "#fff", alignItems: "center",
  },
  dateToggleBtnActive: { borderColor: "#2C1A12", backgroundColor: "#2C1A12" },
  dateToggleTxt:       { fontSize: 11, color: "#6B7280", textAlign: "center" },
  dateToggleTxtActive: { color: "#fff", fontWeight: "600" },

  // صندوق الليالي
  nightsBox:  {
    backgroundColor: "#2C1A12", borderRadius: 10,
    paddingVertical: 12, paddingHorizontal: 16, alignItems: "center",
  },
  nightsText: { color: "#fff", fontSize: 14, fontWeight: "700" },

  // عدد الضيوف
  guestRow:      { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 24 },
  guestBtn:      {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: "#2C1A12", justifyContent: "center", alignItems: "center",
  },
  guestBtnDisabled: { backgroundColor: "#E2D9D0" },
  guestBtnText:  { color: "#fff", fontSize: 22, fontWeight: "bold", lineHeight: 26 },
  guestCountBox: { alignItems: "center" },
  guestCount:    { fontSize: 32, fontWeight: "bold", color: "#1a1a1a" },
  guestLabel:    { fontSize: 12, color: "#6B7280" },
  capacityWarning: { color: "#DC2626", fontSize: 12, textAlign: "center" },

  // ملاحظات
  notesInput: {
    backgroundColor: "#fff", borderRadius: 12, borderWidth: 1,
    borderColor: "#E2D9D0", padding: 14, fontSize: 14,
    color: "#1a1a1a", minHeight: 100, textAlign: "right",
  },

  // أزرار
  nextBtn:      {
    backgroundColor: "#2C1A12", borderRadius: 12,
    padding: 16, alignItems: "center", marginTop: 8,
  },
  nextBtnText:  { color: "#fff", fontSize: 16, fontWeight: "bold" },
  confirmBtn:   {
    backgroundColor: "#517c63", borderRadius: 12,
    padding: 16, alignItems: "center", marginTop: 8,
  },
  confirmBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  btnDisabled:  { backgroundColor: "#6B7280" },

  // ملخص
  summaryCard:  {
    backgroundColor: "#fff", borderRadius: 16, padding: 20, gap: 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  divider:      { height: 1, backgroundColor: "#F3F4F6" },
  summaryRow:   { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  summaryLabel: { fontSize: 13, color: "#6B7280" },
  summaryVal:   { fontSize: 13, fontWeight: "600", color: "#1a1a1a", flex: 1, textAlign: "left", paddingLeft: 8 },
  priceRow:     { flexDirection: "row", justifyContent: "space-between" },
  priceLabel:   { fontSize: 13, color: "#6B7280" },
  priceVal:     { fontSize: 13, color: "#1a1a1a", fontWeight: "600" },
  totalRow:     {
    flexDirection: "row", justifyContent: "space-between",
    backgroundColor: "#F5F0EB", borderRadius: 10, padding: 12, marginTop: 4,
  },
  totalLabel:   { fontSize: 15, fontWeight: "bold", color: "#1a1a1a" },
  totalPrice:   { fontSize: 17, fontWeight: "bold", color: "#2C1A12" },

  // badge انتظار
  statusBadgeRow:  { alignItems: "center" },
  pendingBadge:    {
    backgroundColor: "#FEF3C7", borderRadius: 10,
    paddingVertical: 10, paddingHorizontal: 16,
  },
  pendingText:     { color: "#92400E", fontSize: 13, fontWeight: "600", textAlign: "center" },
});

// ─── Calendar Styles ──────────────────────────────────────────────
const cal = StyleSheet.create({
  container:   { backgroundColor: "#fff", borderRadius: 16, padding: 16, gap: 10,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
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
  legend:      { gap: 6, marginTop: 4 },
  legendItem:  { flexDirection: "row", alignItems: "center", gap: 8 },
  legendDot:   { width: 10, height: 10, borderRadius: 5 },
  legendText:  { fontSize: 12, color: "#6B7280" },
});