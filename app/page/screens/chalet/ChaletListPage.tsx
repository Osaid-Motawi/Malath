import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Chalet, getChalets } from "../../services/chaletService";
import ChaletCard from "../components/ChaletCard";
import CityCard from "../components/CityCard";
import EmptyState from "../components/EmptyState";

const PURPLE = "#6A0DAD";

const cities = [
  { name: "رام الله", image: require("../../../../assets/images/cities/ramallah.jpg") },
  { name: "الخليل", image: require("../../../../assets/images/cities/hebron.jpg") },
  { name: "بيت لحم", image: require("../../../../assets/images/cities/bethlehem.jpg") },
  { name: "نابلس", image: require("../../../../assets/images/cities/nablus.jpg") },
  { name: "أريحا", image: require("../../../../assets/images/cities/jericho.jpg") },
  { name: "قلقيلية", image: require("../../../../assets/images/cities/qalqilya.jpg") },
  { name: "سلفيت", image: require("../../../../assets/images/cities/salfit.jpg") },
  { name: "جنين", image: require("../../../../assets/images/cities/jenin.png") },
  { name: "طولكرم", image: require("../../../../assets/images/cities/tulkarm.jpg") },
];

const cityAliases: Record<string, string[]> = {
  "رام الله": ["رام الله", "رام الله والبيرة", "Ramallah"],
  "الخليل": ["الخليل", "Hebron"],
  "بيت لحم": ["بيت لحم", "Bethlehem", "بيت لححم"],
  "نابلس": ["نابلس", "Nablus"],
  "أريحا": ["أريحا", "اريحا", "Jericho"],
  "قلقيلية": ["قلقيلية", "Qalqilya"],
  "سلفيت": ["سلفيت", "Salfit"],
  "جنين": ["جنين", "Jenin"],
  "طولكرم": ["طولكرم", "Tulkarm"],
};

type OfferFilter = "all" | "offers" | "no_offers";
type CapacityFilter = "all" | "two" | "four_six" | "six_eight" | "nine_plus";
type PoolFilter = "all" | "with_pool" | "without_pool";
type OpenFilter = "offers" | "capacity" | "pool" | null;

export default function ChaletListPage() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [chalets, setChalets] = useState<Chalet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [offerFilter, setOfferFilter] = useState<OfferFilter>("all");
  const [capacityFilter, setCapacityFilter] = useState<CapacityFilter>("all");
  const [poolFilter, setPoolFilter] = useState<PoolFilter>("all");
  const [openFilter, setOpenFilter] = useState<OpenFilter>(null);

  const handleCityPress = (city: string) => {
    setSelectedCity(city);
    setOfferFilter("all");
    setCapacityFilter("all");
    setPoolFilter("all");
    setOpenFilter(null);
  };

  const handleBackToCities = () => {
    setSelectedCity(null);
    setOfferFilter("all");
    setCapacityFilter("all");
    setPoolFilter("all");
    setOpenFilter(null);
  };

  const loadChalets = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getChalets();
      setChalets(data);
    } catch (err) {
      console.log("Error loading chalets:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCity && chalets.length === 0) {
      loadChalets();
    }
  }, [selectedCity, chalets.length]);

  const filteredChalets = useMemo(() => {
    return chalets.filter((chalet) => {
      if (!selectedCity) return false;

      const aliases = cityAliases[selectedCity] || [selectedCity];
      const locationText = chalet.location?.toLowerCase?.() || "";
      const areaText = chalet.area?.toLowerCase?.() || "";

      const matchesCity = aliases.some((alias) => {
        const normalizedAlias = alias.toLowerCase();
        return locationText.includes(normalizedAlias) || areaText.includes(normalizedAlias);
      });

      if (!matchesCity) return false;

      const hasOffer = (chalet.discount ?? 0) > 0;

      if (offerFilter === "offers" && !hasOffer) return false;
      if (offerFilter === "no_offers" && hasOffer) return false;

      const chaletCapacity = chalet.capacity ?? 0;

      if (capacityFilter === "two" && chaletCapacity !== 2) return false;
      if (capacityFilter === "four_six" && !(chaletCapacity >= 4 && chaletCapacity <= 6)) return false;
      if (capacityFilter === "six_eight" && !(chaletCapacity >= 6 && chaletCapacity <= 8)) return false;
      if (capacityFilter === "nine_plus" && chaletCapacity < 9) return false;

      const hasPool = chalet.amenities?.Pool === true || (chalet.amenities as any)?.pool === true;

      if (poolFilter === "with_pool" && !hasPool) return false;
      if (poolFilter === "without_pool" && hasPool) return false;

      return true;
    });
  }, [chalets, selectedCity, offerFilter, capacityFilter, poolFilter]);

  const renderFixedHeader = (title: string, onBack: () => void) => (
    <View style={styles.fixedHeader}>
      <TouchableOpacity onPress={onBack} style={styles.backIconButton} activeOpacity={0.8}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>
    </View>
  );

  const renderCitySelection = () => {
    return (
      <View style={styles.screen}>
        {renderFixedHeader("اختر مدينة", () => router.push("/"))}

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.citiesContainer}>
          {cities.map((city) => (
            <CityCard key={city.name} city={city.name} image={city.image} onPress={() => handleCityPress(city.name)} />
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderOfferFilters = () => {
    const isOpen = openFilter === "offers";

    return (
      <View style={styles.filterGroup}>
        <TouchableOpacity style={styles.filterTitleButton} onPress={() => setOpenFilter(isOpen ? null : "offers")}>
          <Text style={styles.filterLabel}>العروض {isOpen ? "⌃" : "⌄"}</Text>
        </TouchableOpacity>

        {isOpen && (
          <View style={styles.optionsBox}>
            <TouchableOpacity style={[styles.filterChip, offerFilter === "all" && styles.filterChipActive]} onPress={() => setOfferFilter("all")}>
              <Text style={[styles.filterChipText, offerFilter === "all" && styles.filterChipTextActive]}>الكل</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.filterChip, offerFilter === "offers" && styles.filterChipActive]} onPress={() => setOfferFilter("offers")}>
              <Text style={[styles.filterChipText, offerFilter === "offers" && styles.filterChipTextActive]}>عروض</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.filterChip, offerFilter === "no_offers" && styles.filterChipActive]} onPress={() => setOfferFilter("no_offers")}>
              <Text style={[styles.filterChipText, offerFilter === "no_offers" && styles.filterChipTextActive]}>بدون</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderCapacityFilters = () => {
    const isOpen = openFilter === "capacity";

    return (
      <View style={styles.filterGroup}>
        <TouchableOpacity style={styles.filterTitleButton} onPress={() => setOpenFilter(isOpen ? null : "capacity")}>
          <Text style={styles.filterLabel}>الأشخاص {isOpen ? "⌃" : "⌄"}</Text>
        </TouchableOpacity>

        {isOpen && (
          <View style={styles.optionsBox}>
            <TouchableOpacity style={[styles.filterChip, capacityFilter === "all" && styles.filterChipActive]} onPress={() => setCapacityFilter("all")}>
              <Text style={[styles.filterChipText, capacityFilter === "all" && styles.filterChipTextActive]}>الكل</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.filterChip, capacityFilter === "two" && styles.filterChipActive]} onPress={() => setCapacityFilter("two")}>
              <Text style={[styles.filterChipText, capacityFilter === "two" && styles.filterChipTextActive]}>شخصين</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.filterChip, capacityFilter === "four_six" && styles.filterChipActive]} onPress={() => setCapacityFilter("four_six")}>
              <Text style={[styles.filterChipText, capacityFilter === "four_six" && styles.filterChipTextActive]}>4 - 6</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.filterChip, capacityFilter === "six_eight" && styles.filterChipActive]} onPress={() => setCapacityFilter("six_eight")}>
              <Text style={[styles.filterChipText, capacityFilter === "six_eight" && styles.filterChipTextActive]}>6 - 8</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.filterChip, capacityFilter === "nine_plus" && styles.filterChipActive]} onPress={() => setCapacityFilter("nine_plus")}>
              <Text style={[styles.filterChipText, capacityFilter === "nine_plus" && styles.filterChipTextActive]}>9+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderPoolFilters = () => {
    const isOpen = openFilter === "pool";

    return (
      <View style={styles.filterGroup}>
        <TouchableOpacity style={styles.filterTitleButton} onPress={() => setOpenFilter(isOpen ? null : "pool")}>
          <Text style={styles.filterLabel}>المسبح {isOpen ? "⌃" : "⌄"}</Text>
        </TouchableOpacity>

        {isOpen && (
          <View style={styles.optionsBox}>
            <TouchableOpacity style={[styles.filterChip, poolFilter === "all" && styles.filterChipActive]} onPress={() => setPoolFilter("all")}>
              <Text style={[styles.filterChipText, poolFilter === "all" && styles.filterChipTextActive]}>الكل</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.filterChip, poolFilter === "with_pool" && styles.filterChipActive]} onPress={() => setPoolFilter("with_pool")}>
              <Text style={[styles.filterChipText, poolFilter === "with_pool" && styles.filterChipTextActive]}>مع مسبح</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.filterChip, poolFilter === "without_pool" && styles.filterChipActive]} onPress={() => setPoolFilter("without_pool")}>
              <Text style={[styles.filterChipText, poolFilter === "without_pool" && styles.filterChipTextActive]}>بدون مسبح</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderFilters = () => (
    <View style={styles.filtersList}>
      {renderPoolFilters()}
      {renderCapacityFilters()}
      {renderOfferFilters()}
    </View>
  );

  const renderSelectedCityHeader = () => (
    <View>
      {renderFixedHeader(`الشاليهات في ${selectedCity}`, handleBackToCities)}
      {renderFilters()}
    </View>
  );

  const renderSelectedCityContent = () => {
    if (loading) {
      return (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={PURPLE} />
          <Text style={styles.loadingText}>جاري تحميل الشاليهات...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.screen}>
          {renderSelectedCityHeader()}

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.cardsList}>
            <EmptyState type="error" onAction={loadChalets} />
          </ScrollView>
        </View>
      );
    }

    if (filteredChalets.length === 0) {
      return (
        <View style={styles.screen}>
          {renderSelectedCityHeader()}

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.cardsList}>
            <EmptyState
              type="no_city"
              onAction={() => {
                setOfferFilter("all");
                setCapacityFilter("all");
                setPoolFilter("all");
              }}
            />
          </ScrollView>
        </View>
      );
    }

    return (
      <View style={styles.screen}>
        {renderSelectedCityHeader()}

        <FlatList
          data={filteredChalets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChaletCard chalet={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.cardsList}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {!selectedCity ? renderCitySelection() : renderSelectedCityContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 18, paddingTop: 12 },
  screen: { flex: 1 },
  fixedHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#FFFFFF", paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#F3F4F6", zIndex: 10 },
  title: { fontSize: 28, fontWeight: "900", textAlign: "right", color: PURPLE },
  backIconButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#F4ECFF", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#E6D7FF" },
  backArrow: { fontSize: 27, fontWeight: "900", color: PURPLE },
  citiesContainer: { paddingTop: 18, paddingBottom: 36 },
  filtersList: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "flex-start", marginTop: 14, marginBottom: 18 },
  filterGroup: { width: "31%", alignItems: "stretch" },
  filterTitleButton: { backgroundColor: "#F4ECFF", borderWidth: 1, borderColor: "#E6D7FF", borderRadius: 14, paddingVertical: 10, alignItems: "center" },
  filterLabel: { textAlign: "center", fontSize: 14, fontWeight: "900", color: PURPLE },
  optionsBox: { marginTop: 8 },
  filterChip: { height: 36, backgroundColor: "#FFFFFF", borderRadius: 12, borderWidth: 1, borderColor: "#E9D5FF", justifyContent: "center", alignItems: "center", marginBottom: 7, paddingHorizontal: 8 },
  filterChipActive: { backgroundColor: PURPLE, borderColor: PURPLE },
  filterChipText: { color: PURPLE, fontSize: 12, fontWeight: "700" },
  filterChipTextActive: { color: "#FFFFFF" },
  centerBox: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, fontSize: 15, color: "#6B7280", fontWeight: "700" },
  cardsList: { paddingTop: 10, paddingBottom: 24 },
});