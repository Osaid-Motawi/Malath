import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
<<<<<<< HEAD
  ActivityIndicator, Image, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Booking, BookingStatus, getMyBookings, cancelBooking } from "../../services/bookingService";
 import { router } from "expo-router";
import Svg, { Path } from "react-native-svg";
const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 6L9 12L15 18"
      stroke="#4F2396"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
// ─── Status Badge ─────────────────────────────────────────────────
const STATUS: Record<BookingStatus, { label: string; bg: string; color: string; icon: string }> = {
  pending:   { label:"قيد الانتظار", bg:"#FEF3C7", color:"#92400E", icon:"⏳" },
  confirmed: { label:"مؤكد",         bg:"#D1FAE5", color:"#065F46", icon:"✅" },
  cancelled: { label:"ملغي",         bg:"#FEE2E2", color:"#991B1B", icon:"❌" },
  completed: { label:"منتهي",        bg:"#E0E7FF", color:"#3730A3", icon:"🏁" },
};
 
function StatusBadge({ status }: { status: BookingStatus }) {
  const c = STATUS[status];
  return (
    <View style={[b.box, { backgroundColor: c.bg }]}>
      <Text style={[b.txt, { color: c.color }]}>{c.icon} {c.label}</Text>
    </View>
  );
}
 
function formatDisplay(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  const months = ["يناير","فبراير","مارس","أبريل","مايو","يونيو",
    "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
  return `${d} ${months[parseInt(m,10)-1]} ${y}`;
}
 
function BookingCard({ item, onCancel }: { item: Booking; onCancel: (id: string) => void }) {
  return (
    <View style={c.card}>
      <View style={c.cardTop}>
        {item.chaletImage
          ? <Image source={{ uri: item.chaletImage }} style={c.img} resizeMode="cover"/>
          : <View style={[c.img, { backgroundColor:"#E5E7EB" }]}/>}
        <View style={c.topInfo}>
          <Text style={c.name} numberOfLines={2}>{item.chaletName}</Text>
          <StatusBadge status={item.status}/>
        </View>
      </View>
 
      <View style={c.details}>
        <DRow label="📅 الدخول"   value={formatDisplay(item.checkIn)}/>
        <DRow label="📅 الخروج"   value={formatDisplay(item.checkOut)}/>
        <DRow label="🌙 الليالي"  value={`${item.nights} ليلة`}/>
        <DRow label="👥 الضيوف"   value={`${item.guests} أشخاص`}/>
        {!!item.notes && <DRow label="📝 ملاحظات" value={item.notes}/>}
      </View>
 
      <View style={c.priceBar}>
        <Text style={c.priceVal}>{item.totalPrice} ₪</Text>
        <Text style={c.priceLbl}>المجموع الكلي</Text>
      </View>
 
      {item.status === "pending" && (
        <TouchableOpacity style={c.cancelBtn} onPress={() => onCancel(item.id)}>
          <Text style={c.cancelTxt}>إلغاء الحجز</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
 
function DRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={c.drow}>
      <Text style={c.dval}>{value}</Text>
      <Text style={c.dlbl}>{label}</Text>
    </View>
  );
}
 
=======
  ActivityIndicator, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Booking, BookingStatus, getMyBookings, deleteBooking } from "../../services/bookingService";
import BookingCard from "../components/BookingCard";
import { BookingStepsIcon } from "../components/CustomIcon";

>>>>>>> 74d76326fea655e59bdb0f26434fb6c801b3bf4e
type Tab = "all" | BookingStatus;
 
const TABS: { key: Tab; label: string }[] = [
<<<<<<< HEAD
  { key:"all",       label:"الكل"       },
  { key:"pending",   label:"⏳ انتظار"  },
  { key:"confirmed", label:"✅ مؤكد"    },
  { key:"completed", label:"🏁 منتهي"  },
  { key:"cancelled", label:"❌ ملغي"    },
];
 
=======
  { key: "all",       label: "الكل"    },
  { key: "pending",   label: "انتظار"  },
  { key: "confirmed", label: "مؤكد"    },
  { key: "rejected",  label: "مرفوض"   },
];

>>>>>>> 74d76326fea655e59bdb0f26434fb6c801b3bf4e
export default function MyBookingPage() {
  const [bookings,  setBookings]  = useState<Booking[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("all");
<<<<<<< HEAD
 
  useEffect(() => { load(); }, []);
 
  async function load() {
    setLoading(true);
    try {
      const data = await getMyBookings();
      data.sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
      setBookings(data);
    } catch {
      Alert.alert("خطأ", "فشل تحميل الحجوزات");
    } finally {
      setLoading(false);
    }
  }
 
  function handleCancel(id: string) {
    Alert.alert("إلغاء الحجز", "هل أنت متأكد؟", [
      { text:"تراجع", style:"cancel" },
      { text:"نعم، إلغاء", style:"destructive", onPress: async () => {
        await cancelBooking(id);
        setBookings(prev => prev.map(b => b.id===id ? {...b, status:"cancelled"} : b));
      }},
    ]);
  }
 
  const filtered = activeTab === "all"
    ? bookings
    : bookings.filter(b => b.status === activeTab);
 
  if (loading) {
    return (
      <SafeAreaView style={p.safe}>
        <ActivityIndicator size="large" color="#31202A" style={{ flex:1 }}/>
=======

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
>>>>>>> 74d76326fea655e59bdb0f26434fb6c801b3bf4e
      </SafeAreaView>
    );
  }
 
  return (
<<<<<<< HEAD
    <SafeAreaView style={p.safe}>
      <View style={p.header}>
        <TouchableOpacity style={p.backBtn} onPress={() => router.back()}>
  <BackIcon />
</TouchableOpacity>
        <Text style={p.title}>حجوزاتي</Text>
        {bookings.length > 0 && (
          <View style={p.badge}>
            <Text style={p.badgeTxt}>{bookings.length}</Text>
          </View>
        )}
      </View>
 
      {/* Tabs */}
      <FlatList
        horizontal data={TABS} keyExtractor={t => t.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={p.tabs}
        renderItem={({ item: t }) => (
          <TouchableOpacity
            style={[p.tab, activeTab===t.key && p.tabActive]}
            onPress={() => setActiveTab(t.key)}>
            <Text style={[p.tabTxt, activeTab===t.key && p.tabTxtActive]}>{t.label}</Text>
          </TouchableOpacity>
        )}
      />
 
      {filtered.length === 0 ? (
        <View style={p.empty}>
          <Text style={p.emptyIco}>🗓️</Text>
          <Text style={p.emptyTxt}>لا توجد حجوزات</Text>
          <Text style={p.emptySub}>
            {activeTab==="all" ? "لم تقم بأي حجز بعد" : `لا يوجد حجوزات بهذه الحالة`}
=======
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
>>>>>>> 74d76326fea655e59bdb0f26434fb6c801b3bf4e
          </Text>
        </View>
      ) : (
        <FlatList
<<<<<<< HEAD
          data={filtered} keyExtractor={item => item.id}
          contentContainerStyle={p.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <BookingCard item={item} onCancel={handleCancel}/>}
        />
      )}
    </SafeAreaView>
  );
}
 
// ─── Styles ───────────────────────────────────────────────────────
const b = StyleSheet.create({
  box: { borderRadius:20, paddingHorizontal:10, paddingVertical:4, alignSelf:"flex-start" },
  txt: { fontSize:12, fontWeight:"700" },
});
 
const c = StyleSheet.create({
  card: { backgroundColor:"#fff", borderRadius:16, marginBottom:16,
    shadowColor:"#000", shadowOffset:{width:0,height:1},
    shadowOpacity:0.07, shadowRadius:6, elevation:2, overflow:"hidden" },
  cardTop:  { flexDirection:"row", gap:12, padding:12 },
  img:      { width:80, height:80, borderRadius:10 },
  topInfo:  { flex:1, gap:8, justifyContent:"center" },
  name:     { fontSize:15, fontWeight:"700", color:"#18251D", textAlign:"right" },
  details:  { paddingHorizontal:14, paddingBottom:12, gap:6 },
  drow:     { flexDirection:"row", justifyContent:"space-between" },
  dlbl:     { fontSize:13, color:"#6B7280" },
  dval:     { fontSize:13, fontWeight:"600", color:"#18251D" },
  priceBar: { flexDirection:"row", justifyContent:"space-between", alignItems:"center",
    backgroundColor:"#F3F0E9", paddingHorizontal:14, paddingVertical:10 },
  priceLbl: { fontSize:13, color:"#6B7280" },
  priceVal: { fontSize:16, fontWeight:"bold", color:"#31202A" },
  cancelBtn:{ margin:12, marginTop:6, backgroundColor:"#FEE2E2",
    borderRadius:10, padding:12, alignItems:"center" },
  cancelTxt:{ color:"#DC2626", fontWeight:"700", fontSize:14 },
});
 
const p = StyleSheet.create({
  safe:      { flex:1, backgroundColor:"#F3F0E9" },
  header:    { flexDirection:"row", alignItems:"center", gap:10,
    paddingHorizontal:20, paddingTop:16, paddingBottom:8 },
  title:     { fontSize:26, fontWeight:"bold", color:"#18251D" },
  badge:     { backgroundColor:"#31202A", borderRadius:12, paddingHorizontal:8, paddingVertical:2 },
  badgeTxt:  { color:"#fff", fontSize:13, fontWeight:"bold" },
  tabs:      { paddingHorizontal:20, gap:8, paddingBottom:12 },
  tab:       { paddingHorizontal:14, paddingVertical:8, borderRadius:20,
    backgroundColor:"#fff", borderWidth:1, borderColor:"#D1C8BC" },
  tabActive: { backgroundColor:"#31202A", borderColor:"#31202A" },
  tabTxt:    { fontSize:13, color:"#6B7280", fontWeight:"600" },
  tabTxtActive:{ color:"#fff" },
  list:      { paddingHorizontal:20, paddingBottom:30 },
  empty:     { flex:1, justifyContent:"center", alignItems:"center", gap:12 },
  emptyIco:  { fontSize:60 },
  emptyTxt:  { fontSize:20, fontWeight:"bold", color:"#374151" },
  emptySub:  { fontSize:14, color:"#9CA3AF", textAlign:"center" },
    backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EDE9FE",
    justifyContent: "center",
    alignItems: "center",
  },
=======
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
>>>>>>> 74d76326fea655e59bdb0f26434fb6c801b3bf4e
});