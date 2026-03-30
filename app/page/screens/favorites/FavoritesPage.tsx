import React, { useState } from "react";
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, SafeAreaView, Dimensions,
} from "react-native";
import { useChalets } from "../components/ChaletContext";
import ChaletCard from "../components/ChaletCard";

const ITEMS_PER_PAGE = 4;

export default function FavoritesPage() {
  const { chalets, favorites } = useChalets();
  const [currentPage, setCurrentPage] = useState(1);

  const favoriteChalets = chalets.filter((c) => favorites.includes(c.id));
  const totalPages = Math.ceil(favoriteChalets.length / ITEMS_PER_PAGE);

  const currentChalets = favoriteChalets.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
  );

  if (favoriteChalets.length === 0) {
    return (
        <SafeAreaView style={styles.safe}>
          <View style={styles.header}>
            <Text style={styles.title}>المفضلة</Text>
          </View>
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🤍</Text>
            <Text style={styles.emptyText}>لا يوجد شاليهات في المفضلة</Text>
            <Text style={styles.emptySubText}>اضغط على القلب لإضافة شاليه</Text>
          </View>
        </SafeAreaView>
    );
  }

  return (
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>المفضلة</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{favoriteChalets.length}</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>{favoriteChalets.length} شاليه محفوظ</Text>

        <FlatList
            data={currentChalets}
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

        {totalPages > 1 && (
            <View style={styles.pagination}>
              <TouchableOpacity
                  style={[styles.pageBtn, currentPage === 1 && styles.pageBtnDisabled]}
                  onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
              >
                <Text style={styles.pageBtnText}>‹</Text>
              </TouchableOpacity>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <TouchableOpacity
                      key={page}
                      style={[styles.pageNumber, currentPage === page && styles.pageNumberActive]}
                      onPress={() => setCurrentPage(page)}
                  >
                    <Text style={[styles.pageNumberText, currentPage === page && styles.pageNumberTextActive]}>
                      {page}
                    </Text>
                  </TouchableOpacity>
              ))}

              <TouchableOpacity
                  style={[styles.pageBtn, currentPage === totalPages && styles.pageBtnDisabled]}
                  onPress={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
              >
                <Text style={styles.pageBtnText}>›</Text>
              </TouchableOpacity>
            </View>
        )}
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F3F4F6" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
    gap: 10,
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#1a1a1a" },
  countBadge: {
    backgroundColor: "#EF4444",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countText: { color: "#fff", fontSize: 13, fontWeight: "bold" },
  subtitle: { fontSize: 13, color: "#6B7280", paddingHorizontal: 20, marginBottom: 8 },
  list: { padding: 12 },
  row: { justifyContent: "space-between" },
  cardWrapper: { width: "48.5%" },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  emptyIcon: { fontSize: 70 },
  emptyText: { fontSize: 20, fontWeight: "bold", color: "#374151" },
  emptySubText: { fontSize: 14, color: "#9CA3AF", textAlign: "center" },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    gap: 8,
  },
  pageBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pageBtnDisabled: { opacity: 0.3 },
  pageBtnText: { fontSize: 20, color: "#1a1a1a" },
  pageNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pageNumberActive: { backgroundColor: "#2563EB" },
  pageNumberText: { fontSize: 14, fontWeight: "bold", color: "#374151" },
  pageNumberTextActive: { color: "#fff" },
});