import EmptyState from "../components/EmptyState";
import ChaletCard from "../components/ChaletCard";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Chalet, getChalets } from "../../services/chaletService";
import CityCard from "../components/CityCard";

const cities = [
  {
    name: "رام الله",
    image: require("../../../../assets/images/cities/ramallah.jpg"),
  },
  {
    name: "الخليل",
    image: require("../../../../assets/images/cities/hebron.jpg"),
  },
  {
    name: "بيت لحم",
    image: require("../../../../assets/images/cities/bethlehem.jpg"),
  },
  {
    name: "نابلس",
    image: require("../../../../assets/images/cities/nablus.jpg"),
  },
  {
    name: "أريحا",
    image: require("../../../../assets/images/cities/jericho.jpg"),
  },
  {
    name: "قلقيلية",
    image: require("../../../../assets/images/cities/qalqilya.jpg"),
  },
  {
    name: "سلفيت",
    image: require("../../../../assets/images/cities/salfit.jpg"),
  },
  {
    name: "جنين",
    image: require("../../../../assets/images/cities/jenin.png"),
  },
  {
    name: "طولكرم",
    image: require("../../../../assets/images/cities/tulkarm.jpg"),
  },
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

type CapacityFilter =
  | "all"
  | "two"
  | "four_six"
  | "six_eight"
  | "nine_plus";

export default function ChaletListPage() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [chalets, setChalets] = useState<Chalet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [offerFilter, setOfferFilter] = useState<OfferFilter>("all");
  const [capacityFilter, setCapacityFilter] =
    useState<CapacityFilter>("all");

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
  }, [selectedCity]);

  const filteredChalets = chalets.filter((chalet) => {
    if (!selectedCity) return false;

    const aliases = cityAliases[selectedCity] || [selectedCity];
    const locationText = chalet.location?.toLowerCase?.() || "";
    const areaText = chalet.area?.toLowerCase?.() || "";

    const matchesCity = aliases.some((alias) => {
      const normalizedAlias = alias.toLowerCase();
      return (
        locationText.includes(normalizedAlias) ||
        areaText.includes(normalizedAlias)
      );
    });

    if (!matchesCity) return false;

    const hasOffer = (chalet.discount ?? 0) > 0;

    if (offerFilter === "offers" && !hasOffer) return false;
    if (offerFilter === "no_offers" && hasOffer) return false;

    const chaletCapacity = chalet.capacity ?? 0;

    if (capacityFilter === "two") {
      return chaletCapacity === 2;
    }

    if (capacityFilter === "four_six") {
      return chaletCapacity >= 4 && chaletCapacity <= 6;
    }

    if (capacityFilter === "six_eight") {
      return chaletCapacity >= 6 && chaletCapacity <= 8;
    }

    if (capacityFilter === "nine_plus") {
      return chaletCapacity >= 9;
    }

    return true;
  });

const renderCitySelection = () => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.citiesContainer}
    >
      {cities.map((city, index) => (
        <CityCard
          key={index}
          city={city.name}
          image={city.image}
          onPress={() => handleCityPress(city.name)}
        />
      ))}
    </ScrollView>
  );
};

  const renderCapacityFilters = () => {
    const options: CapacityFilter[] = [
      "all",
      "two",
      "four_six",
      "six_eight",
      "nine_plus",
    ];

    return (
      <View style={styles.capacitySection}>
        <Text style={styles.filterLabel}>عدد الأشخاص</Text>

        <View style={styles.filterRow}>
          {options.map((option) => {
            const isActive = capacityFilter === option;

            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.filterChip,
                  isActive && styles.filterChipActive,
                ]}
                onPress={() => setCapacityFilter(option)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {option === "all"
                    ? "كل السعات"
                    : option === "two"
                    ? "شخصين"
                    : option === "four_six"
                    ? "4 - 6"
                    : option === "six_eight"
                    ? "6 - 8"
                    : "9+"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderFilters = () => {
    return (
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>العروض</Text>

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              offerFilter === "all" && styles.filterChipActive,
            ]}
            onPress={() => setOfferFilter("all")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterChipText,
                offerFilter === "all" && styles.filterChipTextActive,
              ]}
            >
              الكل
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              offerFilter === "offers" && styles.filterChipActive,
            ]}
            onPress={() => setOfferFilter("offers")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterChipText,
                offerFilter === "offers" && styles.filterChipTextActive,
              ]}
            >
              عليها عروض
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              offerFilter === "no_offers" && styles.filterChipActive,
            ]}
            onPress={() => setOfferFilter("no_offers")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterChipText,
                offerFilter === "no_offers" && styles.filterChipTextActive,
              ]}
            >
              بدون عروض
            </Text>
          </TouchableOpacity>
        </View>

        {renderCapacityFilters()}

        <Text style={styles.resultsCount}>
          عدد الشاليهات: {filteredChalets.length}
        </Text>
      </View>
    );
  };

  const renderSelectedCityContent = () => {
    if (loading) {
      return (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#14532d" />
          <Text style={styles.loadingText}>جاري تحميل الشاليهات...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.selectedCityContent}>
          {renderFilters()}
          <EmptyState type="error" onAction={loadChalets} />
        </View>
      );
    }

    return (
      <View style={styles.selectedCityContent}>
        {renderFilters()}

        {filteredChalets.length === 0 ? (
          <EmptyState
            type="no_city"
            onAction={() => {
              setOfferFilter("all");
              setCapacityFilter("all");
            }}
          />
        ) : (
          <FlatList
            data={filteredChalets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ChaletCard chalet={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.cardsList}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        {selectedCity ? `الشاليهات في ${selectedCity}` : "اختر مدينة"}
      </Text>

      {selectedCity && (
        <TouchableOpacity
          onPress={handleBackToCities}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>رجوع للمدن</Text>
        </TouchableOpacity>
      )}

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

  selectedCityContent: {
    flex: 1,
  },

  filterSection: {
    marginBottom: 14,
  },

  capacitySection: {
    marginBottom: 12,
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
  },
});