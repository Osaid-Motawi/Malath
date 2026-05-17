import React, { useState } from "react";

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  selectedStart: string;
  selectedEnd: string;
  onSelect: (date: string) => void;
  minDate: string;
  bookedDates: string[];
  loading?: boolean;
}

const PURPLE = "#6A0DAD";

export function formatDisplay(dateStr: string): string {
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

const MONTH_NAMES = [
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

export default function MiniCalendar({
  selectedStart,
  selectedEnd,
  onSelect,
  minDate,
  bookedDates,
  loading,
}: Props) {
  const today = new Date();

  const [viewYear, setViewYear] = useState(today.getFullYear());

  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  if (loading) {
    return (
      <View style={s.loadingBox}>
        <ActivityIndicator color={PURPLE} />

        <Text style={s.loadingText}>
          جاري التحقق من التواريخ...
        </Text>
      </View>
    );
  }

  return (
    <View style={s.box}>
      <View style={s.nav}>
        <TouchableOpacity onPress={prevMonth} style={s.navBtn}>
          <Text style={s.navTxt}>‹</Text>
        </TouchableOpacity>

        <Text style={s.monthTxt}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </Text>

        <TouchableOpacity onPress={nextMonth} style={s.navBtn}>
          <Text style={s.navTxt}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={s.dayRow}>
        {["ح", "ن", "ث", "ر", "خ", "ج", "س"].map((d) => (
          <Text key={d} style={s.dayLbl}>
            {d}
          </Text>
        ))}
      </View>

      <View style={s.grid}>
        {cells.map((day, idx) => {
          if (!day) {
            return <View key={`e${idx}`} style={s.cell} />;
          }

          const ds = `${viewYear}-${String(viewMonth + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;

          const isPast = ds < minDate;

          const isBooked = bookedDates.includes(ds);

          const isStart = ds === selectedStart;

          const isEnd = ds === selectedEnd;

          const inRange = !!(
            selectedStart &&
            selectedEnd &&
            ds > selectedStart &&
            ds < selectedEnd
          );

          const disabled = isPast || isBooked;

          return (
            <TouchableOpacity
              key={ds}
              disabled={disabled}
              style={[
                s.cell,
                isPast && s.pastCell,
                isBooked && s.bookedCell,
                inRange && s.rangeCell,
                (isStart || isEnd) && s.selCell,
              ]}
              onPress={() => onSelect(ds)}
            >
              <Text
                style={[
                  s.cellTxt,
                  isPast && s.pastTxt,
                  isBooked && s.bookedTxt,
                  inRange && s.rangeTxt,
                  (isStart || isEnd) && s.selTxt,
                ]}
              >
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
            <View style={[s.legendDot, { backgroundColor: PURPLE }]} />
            <Text style={s.legendTxt}>
              دخول: {formatDisplay(selectedStart)}
            </Text>
          </View>
        )}

        {selectedEnd && (
          <View style={s.legendItem}>
            <View style={[s.legendDot, { backgroundColor: "#B589FF" }]} />
            <Text style={s.legendTxt}>
              خروج: {formatDisplay(selectedEnd)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  box: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#EEE7FA",
  },

  loadingBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEE7FA",
  },

  loadingText: {
    color: "#6B7280",
    marginTop: 8,
    fontSize: 13,
    fontWeight: "700",
  },

  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F4ECFF",
    justifyContent: "center",
    alignItems: "center",
  },

  navTxt: {
    fontSize: 28,
    color: PURPLE,
    fontWeight: "900",
    lineHeight: 30,
  },

  monthTxt: {
    fontSize: 16,
    fontWeight: "900",
    color: PURPLE,
  },

  dayRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  dayLbl: {
    fontSize: 12,
    color: "#9CA3AF",
    width: 36,
    textAlign: "center",
    fontWeight: "800",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  cell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  pastCell: {
    opacity: 0.28,
  },

  bookedCell: {
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
  },

  rangeCell: {
    backgroundColor: "#F4ECFF",
    borderRadius: 12,
  },

  selCell: {
    backgroundColor: PURPLE,
    borderRadius: 100,
  },

  cellTxt: {
    fontSize: 13,
    color: "#1F1F1F",
    fontWeight: "700",
  },

  pastTxt: {
    color: "#9CA3AF",
  },

  bookedTxt: {
    color: "#DC2626",
    fontWeight: "800",
    textDecorationLine: "line-through",
  },

  rangeTxt: {
    color: PURPLE,
    fontWeight: "900",
  },

  selTxt: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  bookedDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#DC2626",
    position: "absolute",
    bottom: 4,
  },

  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 4,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  legendTxt: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "700",
  },
});