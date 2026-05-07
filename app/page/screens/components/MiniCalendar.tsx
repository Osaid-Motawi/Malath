import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";



interface Props {
  selectedStart: string;
  selectedEnd: string;
  onSelect: (date: string) => void;
  minDate: string;
  bookedDates: string[];  
  loading?: boolean;
}


export function formatDisplay(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  const months = [
    "يناير","فبراير","مارس","أبريل","مايو","يونيو",
    "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",
  ];
  return `${d} ${months[parseInt(m, 10) - 1]} ${y}`;
}

const MONTH_NAMES = [
  "يناير","فبراير","مارس","أبريل","مايو","يونيو",
  "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",
];


export default function MiniCalendar({
  selectedStart, selectedEnd, onSelect, minDate, bookedDates, loading,
}: Props) {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay   = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  if (loading) {
    return (
      <View style={[s.box, { justifyContent: "center", alignItems: "center", minHeight: 200 }]}>
        <ActivityIndicator color="#31202A" />
        <Text style={{ color: "#6B7280", marginTop: 8, fontSize: 13 }}>جاري التحقق من التواريخ...</Text>
      </View>
    );
  }

  return (
    <View style={s.box}>
      
      <View style={s.nav}>
        <TouchableOpacity onPress={prevMonth} style={s.navBtn}>
          <Text style={s.navTxt}>‹</Text>
        </TouchableOpacity>
        <Text style={s.monthTxt}>{MONTH_NAMES[viewMonth]} {viewYear}</Text>
        <TouchableOpacity onPress={nextMonth} style={s.navBtn}>
          <Text style={s.navTxt}>›</Text>
        </TouchableOpacity>
      </View>

      
      <View style={s.dayRow}>
        {["ح","ن","ث","ر","خ","ج","س"].map(d => (
          <Text key={d} style={s.dayLbl}>{d}</Text>
        ))}
      </View>

      
      <View style={s.grid}>
        {cells.map((day, idx) => {
          if (!day) return <View key={`e${idx}`} style={s.cell} />;

          const ds = `${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
          const isPast   = ds < minDate;
          const isBooked = bookedDates.includes(ds);
          const isStart  = ds === selectedStart;
          const isEnd    = ds === selectedEnd;
          const inRange  = !!(selectedStart && selectedEnd && ds > selectedStart && ds < selectedEnd);
          const disabled = isPast || isBooked;

          return (
            <TouchableOpacity
              key={ds}
              disabled={disabled}
              style={[
                s.cell,
                isPast   && s.pastCell,
                isBooked && s.bookedCell,
                inRange  && s.rangeCell,
                (isStart || isEnd) && s.selCell,
              ]}
              onPress={() => onSelect(ds)}
            >
              <Text style={[
                s.cellTxt,
                isPast   && s.pastTxt,
                isBooked && s.bookedTxt,
                inRange  && s.rangeTxt,
                (isStart || isEnd) && s.selTxt,
              ]}>
                {day}
              </Text>
              
              {isBooked && <View style={s.bookedDot} />}
            </TouchableOpacity>
          );
        })}
      </View>

      
      <View style={s.legendRow}>
        <View style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: "#DC2626" }]} />
          <Text style={s.legendTxt}>محجوز</Text>
        </View>
        {selectedStart && (
          <View style={s.legendItem}>
            <View style={[s.legendDot, { backgroundColor: "#31202A" }]} />
            <Text style={s.legendTxt}>دخول: {formatDisplay(selectedStart)}</Text>
          </View>
        )}
        {selectedEnd && (
          <View style={s.legendItem}>
            <View style={[s.legendDot, { backgroundColor: "#7C5C3E" }]} />
            <Text style={s.legendTxt}>خروج: {formatDisplay(selectedEnd)}</Text>
          </View>
        )}
      </View>
    </View>
  );
}


const s = StyleSheet.create({
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

  cell:       { width:"14.28%", aspectRatio:1, justifyContent:"center", alignItems:"center" },
  pastCell:   { opacity: 0.3 },
  bookedCell: { backgroundColor:"#FEE2E2", borderRadius:8 },
  rangeCell:  { backgroundColor:"#F3F0E9" },
  selCell:    { backgroundColor:"#31202A", borderRadius:100 },

  cellTxt:    { fontSize:13, color:"#18251D" },
  pastTxt:    { color:"#9CA3AF" },
  bookedTxt:  { color:"#DC2626", fontWeight:"600", textDecorationLine:"line-through" },
  rangeTxt:   { color:"#7C5C3E", fontWeight:"600" },
  selTxt:     { color:"#fff", fontWeight:"bold" },

  bookedDot:  { width:4, height:4, borderRadius:2, backgroundColor:"#DC2626",
    position:"absolute", bottom:3 },

  legendRow:  { flexDirection:"row", flexWrap:"wrap", gap:12, marginTop:4 },
  legendItem: { flexDirection:"row", alignItems:"center", gap:6 },
  legendDot:  { width:10, height:10, borderRadius:5 },
  legendTxt:  { fontSize:11, color:"#6B7280" },
});