import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import StorageService from "../../services/StorageService";
import {
  addBooking,
  calcNights,
  getBookedDates,
  hasConflict,
} from "../../services/bookingService";

import GuestCounter from "../components/GuestCounter";
import MiniCalendar, { formatDisplay } from "../components/MiniCalendar";
import SummaryCard from "../components/SummaryCard";

import {
  CalendarIcon,
  MoonIcon,
  NoteIcon,
} from "../components/CustomIcon";

const PURPLE = "#6A0DAD";

export default function BookingPage() {
  const params = useLocalSearchParams();

  const chaletId = params.chaletId as string;
  const chaletName = params.chaletName as string;
  const chaletImage = params.chaletImage as string;
  const chaletPrice = Number(params.chaletPrice ?? 0);
  const capacity = Number(params.capacity ?? 1);

  const todayStr = new Date().toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [selecting, setSelecting] = useState<"checkIn" | "checkOut">("checkIn");
  const [guests, setGuests] = useState(1);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "summary">("form");
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [datesLoading, setDatesLoading] = useState(true);

  const nights = checkIn && checkOut ? calcNights(checkIn, checkOut) : 0;
  const totalPrice = nights * chaletPrice;

  useEffect(() => {
    getBookedDates(chaletId)
      .then(setBookedDates)
      .finally(() => setDatesLoading(false));
  }, [chaletId]);

  function handleDateSelect(ds: string) {
    if (selecting === "checkIn") {
      setCheckIn(ds);
      setCheckOut("");
      setSelecting("checkOut");
    } else {
      if (ds <= checkIn) {
        setCheckIn(ds);
        setCheckOut("");
        setSelecting("checkOut");
      } else {
        setCheckOut(ds);
      }
    }
  }

  function validate(): string | null {
    if (!checkIn) return "يرجى تحديد تاريخ الدخول";
    if (!checkOut) return "يرجى تحديد تاريخ الخروج";
    if (nights < 1) return "يجب حجز ليلة واحدة على الأقل";
    if (guests < 1) return "عدد الضيوف يجب أن يكون 1 على الأقل";
    if (guests > capacity) return `الحد الأقصى ${capacity} أشخاص لهذا الشاليه`;
    return null;
  }

  async function goSummary() {
    const err = validate();

    if (err) {
      Alert.alert("تنبيه", err);
      return;
    }

    setLoading(true);

    const conflict = await hasConflict(chaletId, checkIn, checkOut);

    setLoading(false);

    if (conflict) {
      Alert.alert(
        "التواريخ محجوزة",
        "هذا الشاليه محجوز في الفترة التي اخترتها، يرجى اختيار تواريخ أخرى."
      );
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
        userId: user.userId,
        chaletId,
        chaletName,
        chaletImage: chaletImage ?? "",
        chaletPrice,
        checkIn,
        checkOut,
        guests,
        notes: notes.trim(),
        totalPrice,
        nights,
        status: "pending",
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
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
        >
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
            onBack={() => setStep("form")}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={s.backBtn}
            activeOpacity={0.8}
          >
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>

          <Text style={s.pageTitle}>حجز الشاليه</Text>

          <View style={{ width: 42 }} />
        </View>

        <View style={s.chaletCard}>
          {!!chaletImage ? (
            <Image
              source={{ uri: chaletImage }}
              style={s.chaletThumb}
              resizeMode="cover"
            />
          ) : (
            <View style={[s.chaletThumb, { backgroundColor: "#E5E7EB" }]} />
          )}

          <View style={s.chaletInfo}>
            <Text style={s.chaletName}>{chaletName}</Text>
            <Text style={s.chaletPriceTxt}>{chaletPrice} ₪ / ليلة</Text>
            <Text style={s.capacityTxt}>الحد الأقصى: {capacity} أشخاص</Text>
          </View>
        </View>

        <View style={s.section}>
          <View style={s.sectionHeader}>
            <CalendarIcon />
            <Text style={s.sectionTitle}>حدد التاريخ</Text>
          </View>

          <View style={s.simpleDateContainer}>
            <TouchableOpacity
              style={[
                s.simpleDateCard,
                selecting === "checkIn" && s.simpleDateCardActive,
              ]}
              onPress={() => setSelecting("checkIn")}
            >
              <Text
                style={[
                  s.simpleDateLabel,
                  selecting === "checkIn" && s.simpleDateLabelActive,
                ]}
              >
                تاريخ الدخول
              </Text>

              <Text
                style={[
                  s.simpleDateValue,
                  selecting === "checkIn" && s.simpleDateValueActive,
                ]}
              >
                {checkIn ? formatDisplay(checkIn) : "اختر التاريخ"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                s.simpleDateCard,
                selecting === "checkOut" && s.simpleDateCardActive,
              ]}
              onPress={() => setSelecting("checkOut")}
            >
              <Text
                style={[
                  s.simpleDateLabel,
                  selecting === "checkOut" && s.simpleDateLabelActive,
                ]}
              >
                تاريخ الخروج
              </Text>

              <Text
                style={[
                  s.simpleDateValue,
                  selecting === "checkOut" && s.simpleDateValueActive,
                ]}
              >
                {checkOut ? formatDisplay(checkOut) : "اختر التاريخ"}
              </Text>
            </TouchableOpacity>
          </View>

          <MiniCalendar
            selectedStart={checkIn}
            selectedEnd={checkOut}
            onSelect={handleDateSelect}
            minDate={todayStr}
            bookedDates={bookedDates}
            loading={datesLoading}
          />

          {nights > 0 && (
            <View style={s.nightsBadge}>
              <MoonIcon />
              <Text style={s.nightsTxt}>
                {nights} ليلة · الإجمالي: {totalPrice} ₪
              </Text>
            </View>
          )}
        </View>

        <GuestCounter
          guests={guests}
          capacity={capacity}
          onChange={setGuests}
        />

        <View style={s.section}>
          <View style={s.sectionHeader}>
            <NoteIcon />
            <Text style={s.sectionTitle}>ملاحظات اختياري</Text>
          </View>

          <TextInput
            style={s.notes}
            multiline
            numberOfLines={4}
            placeholder="أي طلبات خاصة..."
            placeholderTextColor="#aaa"
            value={notes}
            onChangeText={setNotes}
            textAlignVertical="top"
            textAlign="right"
          />
        </View>

        <TouchableOpacity
          style={[s.nextBtn, loading && s.disabledBtn]}
          onPress={goSummary}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.nextTxt}>متابعة لمراجعة الحجز</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  scroll: { paddingHorizontal: 20, paddingBottom: 40, gap: 22, backgroundColor: "#FFFFFF" },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 8, paddingBottom: 8 },
  backBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#F4ECFF", justifyContent: "center", alignItems: "center" },
  backArrow: { fontSize: 26, fontWeight: "900", color: PURPLE, lineHeight: 28 },
  pageTitle: { fontSize: 22, fontWeight: "900", color: PURPLE },
  chaletCard: { flexDirection: "row", backgroundColor: "#FFFFFF", borderRadius: 22, overflow: "hidden", borderWidth: 1, borderColor: "#E9DDFB", shadowColor: PURPLE, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  chaletThumb: { width: 100, height: 100 },
  chaletInfo: { flex: 1, justifyContent: "center", gap: 6, paddingHorizontal: 14 },
  chaletName: { fontSize: 17, fontWeight: "800", color: "#1F1F1F", textAlign: "right" },
  chaletPriceTxt: { fontSize: 14, color: PURPLE, fontWeight: "700", textAlign: "right" },
  capacityTxt: { fontSize: 12, color: PURPLE, textAlign: "right", fontWeight: "700" },
  section: { backgroundColor: "#FFFFFF", borderRadius: 22, padding: 18, borderWidth: 1, borderColor: "#EEE7FA", gap: 14 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: PURPLE },
  simpleDateContainer: { flexDirection: "row", gap: 10 },
  simpleDateCard: { flex: 1, backgroundColor: "#FAF7FF", borderWidth: 1.5, borderColor: "#E5D8FA", borderRadius: 16, paddingVertical: 14, paddingHorizontal: 12, alignItems: "center" },
  simpleDateCardActive: { backgroundColor: PURPLE, borderColor: PURPLE },
  simpleDateLabel: { fontSize: 12, color: "#7C7C7C", marginBottom: 6, fontWeight: "700" },
  simpleDateLabelActive: { color: "#E9DDFB" },
  simpleDateValue: { fontSize: 14, fontWeight: "800", color: "#1F1F1F" },
  simpleDateValueActive: { color: "#FFFFFF" },
  nightsBadge: { backgroundColor: PURPLE, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  nightsTxt: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
  notes: { backgroundColor: "#FAF7FF", borderRadius: 16, borderWidth: 1.5, borderColor: "#E2D4FA", padding: 16, fontSize: 14, color: "#1F1F1F", minHeight: 110 },
  nextBtn: { backgroundColor: PURPLE, borderRadius: 18, paddingVertical: 18, alignItems: "center", shadowColor: PURPLE, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 10, elevation: 4 },
  nextTxt: { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },
  disabledBtn: { backgroundColor: "#B8A2D9" },
});