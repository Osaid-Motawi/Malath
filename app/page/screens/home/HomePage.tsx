import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import * as SQLite from "expo-sqlite";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useChalet } from "../components/ChaletContext";
import ChaletGridList from "../components/ChaletGridList";
import ChaletSections from "../components/ChaletSections";
import HeroFadeSlider from "../components/HeroFadeSlider";
import SearchHeader from "../components/SearchHeader";

const database = SQLite.openDatabaseSync("malath.db");

export default function HomePage() {
  const insets = useSafeAreaInsets();
  const { chalets, loading } = useChalet();

  const [offlineChalets, setOfflineChalets] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showFeaturedPage, setShowFeaturedPage] = useState(false);

  useEffect(() => {
    database.execSync(`
      CREATE TABLE IF NOT EXISTS home_chalets (
        id TEXT PRIMARY KEY NOT NULL,
        data TEXT NOT NULL
      );
    `);
  }, []);

  useEffect(() => {
    if (chalets.length > 0) {
      chalets.forEach((chalet) => {
        database.runSync(
          "INSERT OR REPLACE INTO home_chalets (id, data) VALUES (?, ?);",
          [chalet.id, JSON.stringify(chalet)]
        );
      });
    } else {
      try {
        const rows = database.getAllSync<{ data: string }>(
          "SELECT data FROM home_chalets;"
        );

        const savedData = rows.map((row) => JSON.parse(row.data));
        setOfflineChalets(savedData);
      } catch (error) {
        console.log("Offline Home Error:", error);
      }
    }
  }, [chalets]);

  const homeData = chalets.length > 0 ? chalets : offlineChalets;

  if (loading && homeData.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>MALATH</Text>
      </View>
    );
  }

  const featuredChalets = homeData.filter((c) => (c?.rating ?? 0) >= 9);

  const searchResults = homeData.filter((c) =>
    c?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showSearch = isSearchActive && searchQuery.length > 0;

  const openFeaturedPage = () => {
    setShowFeaturedPage(true);
    setIsSearchActive(false);
    setSearchQuery("");
  };

  if (showFeaturedPage) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => setShowFeaturedPage(false)}
              style={styles.backButton}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>

            <Text style={styles.logo}>الأعلى تقييماً</Text>
          </View>
        </View>

        <ChaletGridList data={featuredChalets} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <SearchHeader
            isSearchActive={isSearchActive}
            setIsSearchActive={setIsSearchActive}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <Text style={styles.logo}>MALATH</Text>
        </View>
      </View>

      <View style={styles.content}>
        {showSearch ? (
          <ChaletGridList data={searchResults} />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <HeroFadeSlider slides={homeData} />

            <View style={styles.section}>
              <ChaletSections
                title="الأعلى تقييماً"
                data={featuredChalets}
                onSeeAll={openFeaturedPage}
              />
            </View>

            <View style={styles.bottomSpace} />
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 22, fontWeight: "900", color: "#6A0DAD" },
  header: { backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  headerContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, height: 60 },
  logo: { fontSize: 20, fontWeight: "900", color: "#6A0DAD" },
  backButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#F4ECFF", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#E6D7FF" },
  backArrow: { fontSize: 24, fontWeight: "900", color: "#6A0DAD" },
  section: { marginTop: -25, backgroundColor: "#FFFFFF", borderTopLeftRadius: 35, borderTopRightRadius: 35, paddingTop: 25 },
  bottomSpace: { height: 100 },
});