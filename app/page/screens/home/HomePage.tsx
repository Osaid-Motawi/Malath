import React from "react";
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from "react-native";
import ChaletCard from "../components/ChaletCard";
import { useChalets } from "../components/ChaletContext";

export default function HomePage() {
  const { chalets, loading } = useChalets();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>جاري التحميل...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏡 الشاليهات المتاحة</Text>
      <FlatList
        data={chalets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChaletCard
            chalet={item}
            onPress={(chalet) => console.log("ضغطت على:", chalet.name)}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  title: { fontSize: 22, fontWeight: "bold", padding: 16, color: "#1a1a1a" },
  loadingText: { color: "#666", fontSize: 14 },
});
