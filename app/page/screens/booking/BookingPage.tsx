import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Alert, Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import StorageService from "../../services/StorageService";
import { addBooking, calcNights, getBookedDates, hasConflict } from "../../services/bookingService";
import MiniCalendar, { formatDisplay } from "../components/MiniCalendar";
import SummaryCard from "../components/SummaryCard";
import GuestCounter from "../components/GuestCounter";
import { BookingStepsIcon, CalendarIcon, NoteIcon, MoonIcon } from "../components/CustomIcon";

export default function BookingPage() {
  const params      = useLocalSearchParams();
  const chaletId    = params.chaletId    as string;
  const chaletName  = params.chaletName  as string;
  const chaletImage = params.chaletImage as string;
  const chaletPrice = Number(params.chaletPrice ?? 0);
  const capacity    = Number(params.capacity    ?? 1);

  const todayStr = new Date().toISOString().split("T")[0];

  const [checkIn,      setCheckIn]      = useState("");
  const [checkOut,     setCheckOut]     = useState("");
  const [selecting,    setSelecting]    = useState<"checkIn" | "checkOut">("checkIn");
  const [guests,       setGuests]       = useState(1);
  const [notes,        setNotes]        = useState("");
  const [loading,      setLoading]      = useState(false);
  const [step,         setStep]         = useState<"form" | "summary">("form");
  const [bookedDates,  setBookedDates]  = useState<string[]>([]);
  const [datesLoading, setDatesLoading] = useState(true);

  const nights     = checkIn && checkOut ? calcNights(checkIn, checkOut) : 0;
  const totalPrice = nights * chaletPrice;

  useEffect(() => {
    getBookedDates(chaletId)
      .then(setBookedDates)
      .finally(() => setDatesLoading(false));
  }, [chaletId]);

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

  function validate(): string | null {
    if (!checkIn)          return "يرجى تحديد تاريخ الدخول";
    if (!checkOut)         return "يرجى تحديد تاريخ الخروج";
    if (nights < 1)        return "يجب حجز ليلة واحدة على الأقل";
    if (guests < 1)        return "عدد الضيوف يجب أن يكون 1 على الأقل";
    if (guests > capacity) return `الحد الأقصى ${capacity} أشخاص لهذا الشاليه`;
    return null;
  }

  async function goSummary() {
    const err = validate();
    if (err) { Alert.alert("تنبيه", err); return; }
    setLoading(true);
    const conflict = await hasConflict(chaletId, checkIn, checkOut);
    setLoading(false);
    if (conflict) {
      Alert.alert("التواريخ محجوزة", "هذا الشاليه محجوز في الفترة التي اخترتها، يرجى اختيار تواريخ أخرى.");
      return;
    }
    setStep("summary");
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
        userId: user.userId, chaletId, chaletName,
        chaletImage: chaletImage ?? "", chaletPrice,
        checkIn, checkOut, guests, notes: notes.trim(),
        totalPrice, nights, status: "pending",
      });
      router.replace("/(tabs)");
    } catch {
      Alert.alert("خطأ", "حدث خطأ أثناء الحجز، حاول مجدداً");
    } finally {
      setLoading(false);
    }
  }

  
  if (step === "summary") {
    return (
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          <View style={s.topBar}>
            <TouchableOpacity onPress={() => setStep("form")} style={s.backBtn}>
              <BookingStepsIcon />
            </TouchableOpacity>
            <Text style={s.pageTitle}>ملخص الحجز</Text>
            <View style={{ width: 36 }} />
          </View>

          <SummaryCard
            chaletName={chaletName}
            chaletImage={chaletImage}
            checkIn={checkIn}
            checkOut={checkOut}
            nights={nights}
            guests={guests}
            notes={notes}
            chaletPrice={chaletPrice}
            totalPrice={totalPrice}
            loading={loading}
            onConfirm={handleConfirm}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        
        <View style={s.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <BookingStepsIcon />
          </TouchableOpacity>
          <Text style={s.pageTitle}>حجز الشاليه</Text>
          <View style={{ width: 36 }} />
        </View>

        
        <View style={s.chaletCard}>
          {!!chaletImage
            ? <Image source={{ uri: chaletImage }} style={s.chaletThumb} resizeMode="cover" />
            : <View style={[s.chaletThumb, { backgroundColor: "#E5E7EB" }]} />}
          <View style={s.chaletInfo}>
            <Text style={s.chaletName}>{chaletName}</Text>
            <Text style={s.chaletPriceTxt}>{chaletPrice} ₪ / ليلة</Text>
            <Text style={s.capacityTxt}>الحد الأقصى: {capacity} أشخاص</Text>
          </View>
        </View>

        
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <CalendarIcon />
            <Text style={s.sectionTitle}>اختر التواريخ</Text>
          </View>

          <View style={s.toggleRow}>
            <TouchableOpacity
              style={[s.toggleBtn, selecting === "checkIn" && s.toggleActive]}
              onPress={() => setSelecting("checkIn")}>
              <Text style={[s.toggleTxt, selecting === "checkIn" && s.toggleActiveTxt]}>
                الدخول{checkIn ? `\n${formatDisplay(checkIn)}` : ""}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.toggleBtn, selecting === "checkOut" && s.toggleActive]}
              onPress={() => setSelecting("checkOut")}>
              <Text style={[s.toggleTxt, selecting === "checkOut" && s.toggleActiveTxt]}>
                الخروج{checkOut ? `\n${formatDisplay(checkOut)}` : ""}
              </Text>
            </TouchableOpacity>
          </View>

          <MiniCalendar
            selectedStart={checkIn} selectedEnd={checkOut}
            onSelect={handleDateSelect} minDate={todayStr}
            bookedDates={bookedDates} loading={datesLoading}
          />

          {nights > 0 && (
            <View style={s.nightsBadge}>
              <MoonIcon />
              <Text style={s.nightsTxt}>{nights} ليلة  ·  الإجمالي: {totalPrice} ₪</Text>
            </View>
          )}
        </View>

        
        <GuestCounter guests={guests} capacity={capacity} onChange={setGuests} />

       
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <NoteIcon />
            <Text style={s.sectionTitle}>ملاحظات (اختياري)</Text>
          </View>
          <TextInput
            style={s.notes} multiline numberOfLines={4}
            placeholder="أي طلبات خاصة..." placeholderTextColor="#aaa"
            value={notes} onChangeText={setNotes}
            textAlignVertical="top" textAlign="right"
          />
        </View>

        <TouchableOpacity
          style={[s.nextBtn, loading && s.disabledBtn]}
          onPress={goSummary} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.nextTxt}>متابعة لمراجعة الحجز</Text>}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: "#F3F0E9" },
  scroll: { paddingHorizontal: 20, paddingBottom: 40, gap: 20 },
  topBar:    { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 8 },
  backBtn:   { width: 36, height: 36, justifyContent: "center", alignItems: "center" },
  pageTitle: { fontSize: 18, fontWeight: "bold", color: "#18251D" },
  chaletCard: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 14,
    overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 },
  chaletThumb:    { width: 90, height: 90 },
  chaletInfo:     { flex: 1, justifyContent: "center", gap: 4, paddingHorizontal: 12 },
  chaletName:     { fontSize: 15, fontWeight: "700", color: "#18251D", textAlign: "right" },
  chaletPriceTxt: { fontSize: 13, color: "#31202A", fontWeight: "600", textAlign: "right" },
  capacityTxt:    { fontSize: 12, color: "#6B7280", textAlign: "right" },
  section:       { gap: 12 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, justifyContent: "flex-end" },
  sectionTitle:  { fontSize: 15, fontWeight: "700", color: "#18251D" },
  toggleRow:       { flexDirection: "row", gap: 8 },
  toggleBtn:       { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5,
    borderColor: "#D1C8BC", backgroundColor: "#fff", alignItems: "center" },
  toggleActive:    { borderColor: "#31202A", backgroundColor: "#31202A" },
  toggleTxt:       { fontSize: 11, color: "#6B7280", textAlign: "center" },
  toggleActiveTxt: { color: "#fff", fontWeight: "600" },
  nightsBadge: { backgroundColor: "#31202A", borderRadius: 10, paddingVertical: 12,
    paddingHorizontal: 16, flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 8 },
  nightsTxt:   { color: "#fff", fontSize: 14, fontWeight: "700" },
  notes: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 1,
    borderColor: "#D1C8BC", padding: 14, fontSize: 14, color: "#18251D", minHeight: 100 },
  nextBtn:     { backgroundColor: "#31202A", borderRadius: 12, padding: 16, alignItems: "center" },
  nextTxt:     { color: "#fff", fontSize: 16, fontWeight: "bold" },
  disabledBtn: { backgroundColor: "#9CA3AF" },
});