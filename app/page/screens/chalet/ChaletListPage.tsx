import EmptyState from "../components/EmptyState";
import ChaletCard from "../components/ChaletCard";
import CityCard from "../components/CityCard";
import ChaletFilters from "../components/ChaletFilters";
import React, { useEffect, useState } from "react";
import {ActivityIndicator,FlatList,ScrollView,StyleSheet,Text,TouchableOpacity,View} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Chalet, getChalets } from "../../services/chaletService";

const cities = [
  { name: "رام الله", image: require("../../../../assets/images/cities/ramallah.jpg") },
  { name: "الخليل", image: require("../../../../assets/images/cities/hebron.jpg") },
  { name: "بيت لحم", image: require("../../../../assets/images/cities/bethlehem.jpg") },
  { name: "نابلس", image: require("../../../../assets/images/cities/nablus.jpg") },
  { name: "أريحا", image: require("../../../../assets/images/cities/jericho.jpg") },
  { name: "قلقيلية", image: require("../../../../assets/images/cities/qalqilya.jpg") },
  { name: "سلفيت", image: require("../../../../assets/images/cities/salfit.jpg") },
  { name: "جنين", image: require("../../../../assets/images/cities/jenin.png") },
  { name: "طولكرم", image: require("../../../../assets/images/cities/tulkarm.jpg") }
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
  "طولكرم": ["طولكرم", "Tulkarm"]
};
type OfferFilter = "all" | "offers" | "no_offers";
type CapacityFilter = "all" | "two" | "four_six" | "six_eight" | "nine_plus";
export default function ChaletListPage() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [chalets, setChalets] = useState<Chalet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [offerFilter, setOfferFilter] = useState<OfferFilter>("all");
  const [capacityFilter, setCapacityFilter] = useState<CapacityFilter>("all");

  const handleCityPress = (city: string) => {
    setSelectedCity(city);
    setOfferFilter("all");
    setCapacityFilter("all");
  };

  const handleBackToCities = () => {
    setSelectedCity(null);
    setOfferFilter("all");
    setCapacityFilter("all");
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

  const filteredChalets = chalets.filter((chalet) => {
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
    const capacity = chalet.capacity ?? 0;
    if (capacityFilter === "two") return capacity === 2;
    if (capacityFilter === "four_six") return capacity >= 4 && capacity <= 6;
    if (capacityFilter === "six_eight") return capacity >= 6 && capacity <= 8;
    if (capacityFilter === "nine_plus") return capacity >= 9;

    return true;
  });
  const renderCitySelection = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.citiesContainer}
    >
      <Text style={styles.title}>اختر مدينة</Text>
      {cities.map((city) => (
        <CityCard
          key={city.name}
          city={city.name}
          image={city.image}
          onPress={() => handleCityPress(city.name)}
        />
      ))}
    </ScrollView>
  );
  const renderSelectedCityHeader = () => (
    <View>
      <Text style={styles.title}>الشاليهات في {selectedCity}</Text>
      <TouchableOpacity
        onPress={handleBackToCities}
        style={styles.backButton}
        activeOpacity={0.8}
      >
        <Text style={styles.backButtonText}>رجوع للمدن</Text>
      </TouchableOpacity>
      <ChaletFilters
        offerFilter={offerFilter}
        onOfferChange={setOfferFilter}
        capacityFilter={capacityFilter}
        onCapacityChange={setCapacityFilter}
        resultsCount={filteredChalets.length}
      />
    </View>
  );
  const renderSelectedCityContent = () => {
    if (loading) {
      return (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#4F2396" />
          <Text style={styles.loadingText}>جاري تحميل الشاليهات...</Text>
        </View>
      );
    }
    if (error) {
      return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.cardsList}>
          {renderSelectedCityHeader()}
          <EmptyState type="error" onAction={loadChalets} />
        </ScrollView>
      );
    }
    if (filteredChalets.length === 0) {
      return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.cardsList}>
          {renderSelectedCityHeader()}
          <EmptyState
            type="no_city"
            onAction={() => {
              setOfferFilter("all");
              setCapacityFilter("all");
            }}
          />
        </ScrollView>
      );
    }
    return (
      <FlatList
        data={filteredChalets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChaletCard chalet={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.cardsList}
        ListHeaderComponent={renderSelectedCityHeader()}
      />
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      {!selectedCity ? renderCitySelection() : renderSelectedCityContent()}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "right",
    marginBottom: 18,
    color: "#17131D",
  },
  backButton: {
    alignSelf: "flex-end",
    marginBottom: 18,
    backgroundColor: "#4F2396",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#4F2396",
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  citiesContainer: {
    paddingBottom: 36,
  },
  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#969496",
    fontWeight: "500",
  },
  cardsList: {
    paddingBottom: 24,
  }
});