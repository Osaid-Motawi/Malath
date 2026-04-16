import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Alert, Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import StorageService from "../../services/StorageService";
import { addBooking, calcNights } from "../../services/bookingService";
 
function formatDisplay(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  const months = ["يناير","فبراير","مارس","أبريل","مايو","يونيو",
    "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
  return `${d} ${months[parseInt(m, 10) - 1]} ${y}`;
}
 
function toISO(date: Date): string {
  return date.toISOString().split("T")[0];
}
 
function MiniCalendar({
  selectedStart, selectedEnd, onSelect, minDate,
}: {
  selectedStart: string; selectedEnd: string;
  onSelect: (d: string) => void; minDate: string;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
 
  const monthNames = ["يناير","فبراير","مارس","أبريل","مايو","يونيو",
    "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
 
  const firstDay  = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
 
  const prevMonth = () => viewMonth === 0
    ? (setViewMonth(11), setViewYear(y => y - 1))
    : setViewMonth(m => m - 1);
  const nextMonth = () => viewMonth === 11
    ? (setViewMonth(0), setViewYear(y => y + 1))
    : setViewMonth(m => m + 1);
 
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
 
  return (
    <View style={cal.box}>
      {/* nav */}
      <View style={cal.nav}>
        <TouchableOpacity onPress={prevMonth} style={cal.navBtn}>
          <Text style={cal.navTxt}>‹</Text>
        </TouchableOpacity>
        <Text style={cal.monthTxt}>{monthNames[viewMonth]} {viewYear}</Text>
        <TouchableOpacity onPress={nextMonth} style={cal.navBtn}>
          <Text style={cal.navTxt}>›</Text>
        </TouchableOpacity>
      </View>
 
      {/* أسماء الأيام */}
      <View style={cal.dayRow}>
        {["ح","ن","ث","ر","خ","ج","س"].map(d => (
          <Text key={d} style={cal.dayLbl}>{d}</Text>
        ))}
      </View>
 
      <View style={cal.grid}>
        {cells.map((day, idx) => {
          if (!day) return <View key={`e${idx}`} style={cal.cell} />;
          const ds = `${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
          const past    = ds < minDate;
          const isStart = ds === selectedStart;
          const isEnd   = ds === selectedEnd;
          const inRange = !!(selectedStart && selectedEnd && ds > selectedStart && ds < selectedEnd);
          return (
            <TouchableOpacity key={ds} disabled={past}
              style={[cal.cell, past && cal.pastCell, inRange && cal.rangeCell,
                (isStart || isEnd) && cal.selCell]}
              onPress={() => onSelect(ds)}>
              <Text style={[cal.cellTxt, past && cal.pastTxt,
                inRange && cal.rangeTxt, (isStart||isEnd) && cal.selTxt]}>
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
 
      {/* legend */}
      {selectedStart && selectedEnd && (
        <View style={cal.legend}>
          <View style={cal.legendRow}>
            <View style={[cal.dot,{backgroundColor:"#31202A"}]}/>
            <Text style={cal.legendTxt}>دخول: {formatDisplay(selectedStart)}</Text>
          </View>
          <View style={cal.legendRow}>
            <View style={[cal.dot,{backgroundColor:"#7C5C3E"}]}/>
            <Text style={cal.legendTxt}>خروج: {formatDisplay(selectedEnd)}</Text>
          </View>
        </View>
      )}
    </View>
  );
}
 
// ─── الصفحة الرئيسية ──────────────────────────────────────────────
export default function BookingPage() {
  // البيانات قادمة من ChaletDetailsPage عبر router.push params
  const params      = useLocalSearchParams();
  const chaletId    = params.chaletId    as string;
  const chaletName  = params.chaletName  as string;
  const chaletImage = params.chaletImage as string;
  const chaletPrice = Number(params.chaletPrice ?? 0);
  const capacity    = Number(params.capacity    ?? 1);
 
  const todayStr = toISO(new Date());
 
  const [checkIn,    setCheckIn]    = useState("");
  const [checkOut,   setCheckOut]   = useState("");
  const [selecting,  setSelecting]  = useState<"checkIn"|"checkOut">("checkIn");
  const [guests,     setGuests]     = useState(1);
  const [notes,      setNotes]      = useState("");
  const [loading,    setLoading]    = useState(false);
  const [step,       setStep]       = useState<"form"|"summary">("form");
 
  const nights     = checkIn && checkOut ? calcNights(checkIn, checkOut) : 0;
  const totalPrice = nights * chaletPrice;
 
  // ─── اختيار تاريخ ─────────────────────────────────────────────
  function handleDateSelect(ds: string) {
    if (selecting === "checkIn") {
      setCheckIn(ds); setCheckOut(""); setSelecting("checkOut");
    } else {
      if (ds <= checkIn) {
        setCheckIn(ds); setCheckOut(""); setSelecting("checkOut");
      } else {
        setCheckOut(ds);
      }
    }
  }
 
  // ─── Validation ───────────────────────────────────────────────
  function validate(): string | null {
    if (!checkIn)          return "يرجى تحديد تاريخ الدخول";
    if (!checkOut)         return "يرجى تحديد تاريخ الخروج";
    if (nights < 1)        return "يجب حجز ليلة واحدة على الأقل";
    if (guests < 1)        return "عدد الضيوف يجب أن يكون 1 على الأقل";
    if (guests > capacity) return `الحد الأقصى ${capacity} أشخاص لهذا الشاليه`;
    return null;
  }
 
async function handleConfirm() {
  const user = await StorageService.getUser();
  if (!user?.userId) {
    Alert.alert("تنبيه", "يجب تسجيل الدخول أولاً");
    router.push("/login");
    return;
  }

  setLoading(true);
  try {
    await addBooking({
      userId:      user.userId, 
      chaletId,
      chaletName,
      chaletImage: chaletImage ?? "",
      chaletPrice,
      checkIn,
      checkOut,
      guests,
      notes:       notes.trim(),
      totalPrice,
      nights,
      status:      "pending",
    });
    Alert.alert(
      "✅ تم الحجز بنجاح",
      `تم إرسال طلب حجزك لـ "${chaletName}".\nسيتم مراجعته من المالك قريباً.`,
      [{ text: "حسناً", onPress: () => router.replace("/(tabs)") }]
    );
  } catch {
    Alert.alert("خطأ", "حدث خطأ أثناء الحجز، حاول مجدداً");
  } finally {
    setLoading(false);
  }
}
 
  function goSummary() {
    const err = validate();
    if (err) { Alert.alert("تنبيه", err); return; }
    setStep("summary");
  }
 

  if (step === "summary") {
    return (
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
 
          <View style={s.topBar}>
            <TouchableOpacity onPress={() => setStep("form")} style={s.backBtn}>
              <Text style={s.backIco}>←</Text>
            </TouchableOpacity>
            <Text style={s.pageTitle}>ملخص الحجز</Text>
            <View style={{width:36}}/>
          </View>
 
          {!!chaletImage && (
            <Image source={{uri: chaletImage}} style={s.heroImg} resizeMode="cover"/>
          )}
 
          <View style={s.card}>
            <Text style={s.chaletName}>{chaletName}</Text>
            <View style={s.divider}/>
 
            <Row label="تاريخ الدخول"  value={formatDisplay(checkIn)}/>
            <Row label="تاريخ الخروج"  value={formatDisplay(checkOut)}/>
            <Row label="عدد الليالي"   value={`${nights} ليلة`}/>
            <Row label="عدد الضيوف"    value={`${guests} أشخاص`}/>
            {!!notes && <Row label="ملاحظات" value={notes}/>}
 
            <View style={s.divider}/>
            <Row label="السعر / ليلة"            value={`${chaletPrice} ₪`}/>
            <Row label={`${nights} × ${chaletPrice} ₪`} value={`${totalPrice} ₪`}/>
 
            <View style={s.totalRow}>
              <Text style={s.totalLbl}>المجموع الكلي</Text>
              <Text style={s.totalVal}>{totalPrice} ₪</Text>
            </View>
          </View>
 
          <View style={s.pendingBox}>
            <Text style={s.pendingTxt}>⏳ سيكون الحجز بحالة انتظار حتى يؤكده المالك</Text>
          </View>
 
          <TouchableOpacity
            style={[s.confirmBtn, loading && s.disabledBtn]}
            onPress={handleConfirm} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff"/>
              : <Text style={s.confirmTxt}>تأكيد الحجز</Text>}
          </TouchableOpacity>
 
        </ScrollView>
      </SafeAreaView>
    );
  }
 

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
 
        {/* Header */}
        <View style={s.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Text style={s.backIco}>←</Text>
          </TouchableOpacity>
          <Text style={s.pageTitle}>حجز الشاليه</Text>
          <View style={{width:36}}/>
        </View>
 
        <View style={s.chaletCard}>
          {!!chaletImage
            ? <Image source={{uri: chaletImage}} style={s.chaletThumb} resizeMode="cover"/>
            : <View style={[s.chaletThumb,{backgroundColor:"#E5E7EB"}]}/>}
          <View style={s.chaletInfo}>
            <Text style={s.chaletName}>{chaletName}</Text>
            <Text style={s.chaletPriceTxt}>{chaletPrice} ₪ / ليلة</Text>
            <Text style={s.capacityTxt}>الحد الأقصى: {capacity} أشخاص</Text>
          </View>
        </View>
 
        <View style={s.section}>
          <Text style={s.sectionTitle}>📅 اختر التواريخ</Text>
 
          <View style={s.toggleRow}>
            <TouchableOpacity
              style={[s.toggleBtn, selecting==="checkIn" && s.toggleActive]}
              onPress={() => setSelecting("checkIn")}>
              <Text style={[s.toggleTxt, selecting==="checkIn" && s.toggleActiveTxt]}>
                الدخول {checkIn ? formatDisplay(checkIn) : ""}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.toggleBtn, selecting==="checkOut" && s.toggleActive]}
              onPress={() => setSelecting("checkOut")}>
              <Text style={[s.toggleTxt, selecting==="checkOut" && s.toggleActiveTxt]}>
                الخروج {checkOut ? formatDisplay(checkOut) : ""}
              </Text>
            </TouchableOpacity>
          </View>
 
          <MiniCalendar
            selectedStart={checkIn} selectedEnd={checkOut}
            onSelect={handleDateSelect} minDate={todayStr}/>
 
          {nights > 0 && (
            <View style={s.nightsBadge}>
              <Text style={s.nightsTxt}>🌙 {nights} ليلة &nbsp;·&nbsp; الإجمالي: {totalPrice} ₪</Text>
            </View>
          )}
        </View>
 
        <View style={s.section}>
          <Text style={s.sectionTitle}>👥 عدد الضيوف</Text>
          <View style={s.guestRow}>
            <TouchableOpacity
              style={[s.guestBtn, guests<=1 && s.guestBtnOff]}
              disabled={guests<=1}
              onPress={() => setGuests(g => Math.max(1,g-1))}>
              <Text style={s.guestBtnTxt}>−</Text>
            </TouchableOpacity>
            <View style={s.guestCenter}>
              <Text style={s.guestNum}>{guests}</Text>
              <Text style={s.guestLbl}>أشخاص</Text>
            </View>
            <TouchableOpacity
              style={[s.guestBtn, guests>=capacity && s.guestBtnOff]}
              disabled={guests>=capacity}
              onPress={() => setGuests(g => Math.min(capacity,g+1))}>
              <Text style={s.guestBtnTxt}>+</Text>
            </TouchableOpacity>
          </View>
          {guests >= capacity && (
            <Text style={s.capWarn}>⚠️ وصلت للحد الأقصى ({capacity} أشخاص)</Text>
          )}
        </View>
 
        {/* ── ملاحظات ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>📝 ملاحظات (اختياري)</Text>
          <TextInput
            style={s.notes} multiline numberOfLines={4}
            placeholder="أي طلبات خاصة..." placeholderTextColor="#aaa"
            value={notes} onChangeText={setNotes}
            textAlignVertical="top" textAlign="right"/>
        </View>
 
        <TouchableOpacity style={s.nextBtn} onPress={goSummary}>
          <Text style={s.nextTxt}>متابعة لمراجعة الحجز ←</Text>
        </TouchableOpacity>
 
      </ScrollView>
    </SafeAreaView>
  );
}
 
function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.summaryRow}>
      <Text style={s.summaryVal}>{value}</Text>
      <Text style={s.summaryLbl}>{label}</Text>
    </View>
  );
}
 
const s = StyleSheet.create({
  safe:     { flex:1, backgroundColor:"#F3F0E9" },
  scroll:   { paddingHorizontal:20, paddingBottom:40, gap:20 },
 
  topBar:    { flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingTop:8 },
  backBtn:   { width:36, height:36, justifyContent:"center", alignItems:"center" },
  backIco:   { fontSize:22, color:"#18251D" },
  pageTitle: { fontSize:18, fontWeight:"bold", color:"#18251D" },
 
  heroImg:   { width:"100%", height:200, borderRadius:14 },
 
  chaletCard: { flexDirection:"row", backgroundColor:"#fff", borderRadius:14,
    overflow:"hidden", shadowColor:"#000", shadowOffset:{width:0,height:1},
    shadowOpacity:0.07, shadowRadius:4, elevation:2 },
  chaletThumb:{ width:90, height:90 },
  chaletInfo: { flex:1, justifyContent:"center", gap:4, paddingHorizontal:12 },
  chaletName: { fontSize:15, fontWeight:"700", color:"#18251D", textAlign:"right" },
  chaletPriceTxt:{ fontSize:13, color:"#31202A", fontWeight:"600", textAlign:"right" },
  capacityTxt:{ fontSize:12, color:"#6B7280", textAlign:"right" },
 
  section:      { gap:12 },
  sectionTitle: { fontSize:15, fontWeight:"700", color:"#18251D", textAlign:"right" },
 
  toggleRow:   { flexDirection:"row", gap:8 },
  toggleBtn:   { flex:1, paddingVertical:10, borderRadius:10, borderWidth:1.5,
    borderColor:"#D1C8BC", backgroundColor:"#fff", alignItems:"center" },
  toggleActive:{ borderColor:"#31202A", backgroundColor:"#31202A" },
  toggleTxt:   { fontSize:11, color:"#6B7280", textAlign:"center" },
  toggleActiveTxt:{ color:"#fff", fontWeight:"600" },
 
  nightsBadge: { backgroundColor:"#31202A", borderRadius:10,
    paddingVertical:12, paddingHorizontal:16, alignItems:"center" },
  nightsTxt:   { color:"#fff", fontSize:14, fontWeight:"700" },
 
  guestRow:    { flexDirection:"row", alignItems:"center", justifyContent:"center", gap:28 },
  guestBtn:    { width:46, height:46, borderRadius:23, backgroundColor:"#31202A",
    justifyContent:"center", alignItems:"center" },
  guestBtnOff: { backgroundColor:"#D1C8BC" },
  guestBtnTxt: { color:"#fff", fontSize:24, fontWeight:"bold", lineHeight:28 },
  guestCenter: { alignItems:"center" },
  guestNum:    { fontSize:34, fontWeight:"bold", color:"#18251D" },
  guestLbl:    { fontSize:12, color:"#6B7280" },
  capWarn:     { color:"#DC2626", fontSize:12, textAlign:"center" },
 
  notes: { backgroundColor:"#fff", borderRadius:12, borderWidth:1,
    borderColor:"#D1C8BC", padding:14, fontSize:14, color:"#18251D", minHeight:100 },
 
  nextBtn:  { backgroundColor:"#31202A", borderRadius:12, padding:16, alignItems:"center" },
  nextTxt:  { color:"#fff", fontSize:16, fontWeight:"bold" },
 
  card: { backgroundColor:"#fff", borderRadius:16, padding:20, gap:10,
    shadowColor:"#000", shadowOffset:{width:0,height:1},
    shadowOpacity:0.06, shadowRadius:6, elevation:2 },
  divider:    { height:1, backgroundColor:"#F0EDE8" },
  summaryRow: { flexDirection:"row", justifyContent:"space-between" },
  summaryLbl: { fontSize:13, color:"#6B7280" },
  summaryVal: { fontSize:13, fontWeight:"600", color:"#18251D" },
  totalRow:   { flexDirection:"row", justifyContent:"space-between",
    backgroundColor:"#F3F0E9", borderRadius:10, padding:12, marginTop:4 },
  totalLbl:   { fontSize:15, fontWeight:"bold", color:"#18251D" },
  totalVal:   { fontSize:17, fontWeight:"bold", color:"#31202A" },
 
  pendingBox: { backgroundColor:"#FEF3C7", borderRadius:10,
    paddingVertical:10, paddingHorizontal:14 },
  pendingTxt: { color:"#92400E", fontSize:13, fontWeight:"600", textAlign:"center" },
 
  confirmBtn:  { backgroundColor:"#517c63", borderRadius:12, padding:16, alignItems:"center" },
  confirmTxt:  { color:"#fff", fontSize:16, fontWeight:"bold" },
  disabledBtn: { backgroundColor:"#9CA3AF" },
});
 
const cal = StyleSheet.create({
  box:      { backgroundColor:"#fff", borderRadius:16, padding:16, gap:8,
    shadowColor:"#000", shadowOffset:{width:0,height:1},
    shadowOpacity:0.06, shadowRadius:4, elevation:2 },
  nav:      { flexDirection:"row", alignItems:"center", justifyContent:"space-between" },
  navBtn:   { width:36, height:36, justifyContent:"center", alignItems:"center" },
  navTxt:   { fontSize:24, color:"#31202A", fontWeight:"bold" },
  monthTxt: { fontSize:15, fontWeight:"bold", color:"#18251D" },
  dayRow:   { flexDirection:"row", justifyContent:"space-around" },
  dayLbl:   { fontSize:12, color:"#9CA3AF", width:36, textAlign:"center" },
  grid:     { flexDirection:"row", flexWrap:"wrap" },
  cell:     { width:"14.28%", aspectRatio:1, justifyContent:"center", alignItems:"center" },
  pastCell: { opacity:0.3 },
  rangeCell:{ backgroundColor:"#F3F0E9" },
  selCell:  { backgroundColor:"#31202A", borderRadius:100 },
  cellTxt:  { fontSize:13, color:"#18251D" },
  pastTxt:  { color:"#9CA3AF" },
  rangeTxt: { color:"#7C5C3E", fontWeight:"600" },
  selTxt:   { color:"#fff", fontWeight:"bold" },
  legend:   { gap:6, marginTop:4 },
  legendRow:{ flexDirection:"row", alignItems:"center", gap:8 },
  dot:      { width:10, height:10, borderRadius:5 },
  legendTxt:{ fontSize:12, color:"#6B7280" },
});