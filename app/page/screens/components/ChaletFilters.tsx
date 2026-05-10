import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type OfferFilter = "all" | "offers" | "no_offers";
type CapacityFilter = "all" | "two" | "four_six" | "six_eight" | "nine_plus";

interface Props {
  offerFilter: OfferFilter;
  onOfferChange: (value: OfferFilter) => void;
  capacityFilter: CapacityFilter;
  onCapacityChange: (value: CapacityFilter) => void;
  resultsCount: number;
}

export default function ChaletFilters({
  offerFilter,
  onOfferChange,
  capacityFilter,
  onCapacityChange,
  resultsCount,
}: Props) {
  return (
    <View style={styles.filterSection}>
      <Text style={styles.filterLabel}>العروض</Text>

      <View style={styles.filterRow}>
        <FilterButton
          label="الكل"
          active={offerFilter === "all"}
          onPress={() => onOfferChange("all")}
        />

        <FilterButton
          label="عليها عروض"
          active={offerFilter === "offers"}
          onPress={() => onOfferChange("offers")}
        />

        <FilterButton
          label="بدون عروض"
          active={offerFilter === "no_offers"}
          onPress={() => onOfferChange("no_offers")}
        />
      </View>

      <Text style={styles.filterLabel}>عدد الأشخاص</Text>

      <View style={styles.filterRow}>
        <FilterButton
          label="كل السعات"
          active={capacityFilter === "all"}
          onPress={() => onCapacityChange("all")}
        />

        <FilterButton
          label="شخصين"
          active={capacityFilter === "two"}
          onPress={() => onCapacityChange("two")}
        />

        <FilterButton
          label="4 - 6"
          active={capacityFilter === "four_six"}
          onPress={() => onCapacityChange("four_six")}
        />

        <FilterButton
          label="6 - 8"
          active={capacityFilter === "six_eight"}
          onPress={() => onCapacityChange("six_eight")}
        />

        <FilterButton
          label="9+"
          active={capacityFilter === "nine_plus"}
          onPress={() => onCapacityChange("nine_plus")}
        />
      </View>

      <Text style={styles.resultsCount}>عدد الشاليهات: {resultsCount}</Text>
    </View>
  );
}

function FilterButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.filterChip, active && styles.filterChipActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  filterSection: {
    marginBottom: 14,
  },
  filterLabel: {
    textAlign: "right",
    fontSize: 15,
    fontWeight: "800",
    color: "#17131D",
    marginBottom: 10,
    marginTop: 4,
  },
  filterRow: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },
  filterChip: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#4F2396",
  },
  filterChipActive: {
    backgroundColor: "#4F2396",
    borderColor: "#4F2396",
  },
  filterChipText: {
    color: "#4F2396",
    fontSize: 14,
    fontWeight: "700",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
  resultsCount: {
    textAlign: "right",
    color: "#6C6C6B",
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
  },
});