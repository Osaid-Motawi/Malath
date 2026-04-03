import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useChalets } from "../components/ChaletContext";
import ChaletCard from "../components/ChaletCard";
import { HomeIcon, ChaletIcon } from "../components/CustomIcon";
export default function FavoritesPage() {
  const { chalets, favorites } = useChalets();

  const favoriteChalets = chalets.filter((c) =>
    favorites.includes(c.id)
  );

  if (favoriteChalets.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>المفضلة</Text>

        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🤍</Text>
          <Text style={styles.emptyText}>لا يوجد شاليهات في المفضلة</Text>
          <Text style={styles.emptySubText}>
            اضغط على القلب لإضافة شاليه
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>المفضلة</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {favoriteChalets.length}
          </Text>
        </View>
      </View>
      <Text style={styles.subtitle}>
        {favoriteChalets.length} شاليه محفوظ
      </Text>

      <FlatList
        data={favoriteChalets}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ChaletCard chalet={item} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 6,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1a1a1a",
  },

  badge: {
    marginLeft: 8,
    backgroundColor: "#EF4444",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  badgeText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 13,
    color: "#030303",
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  list: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },

  cardWrapper: {
    width: "48%",
  },

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 70,
    marginBottom: 10,
  },

  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#374151",
  },

  emptySubText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },
});