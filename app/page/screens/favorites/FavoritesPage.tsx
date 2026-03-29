import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import { useChalets } from "../components/ChaletContext";
import ChaletCard from "../components/ChaletCard";

export default function FavoritesPage() {
  const { chalets, favorites } = useChalets();

  const favoriteChalets = chalets.filter((c) => favorites.includes(c.id));

  if (favoriteChalets.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>🤍</Text>
        <Text style={styles.emptyText}>لا يوجد شاليهات في المفضلة</Text>
        <Text style={styles.emptySubText}>اضغط على القلب لإضافة شاليه</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>❤️ المفضلة</Text>
      <FlatList
        data={favoriteChalets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChaletCard chalet={item} />}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    padding: 16,
    color: "#1a1a1a",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  emptyIcon: {
    fontSize: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
  },
  emptySubText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
});