import { router } from "expo-router";
import React from "react";

import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ChaletCard from "../components/ChaletCard";
import { useChalet } from "../components/ChaletContext";
import { WhiteHeartIcon } from "../components/CustomIcon";

const PURPLE = "#6A0DAD";

const FavoritesPage = () => {
  const { chalets, favorites } = useChalet();

  const favoriteChalets = chalets.filter((c) =>
    favorites.includes(c.id)
  );

  const renderHeader = () => (
    <View style={styles.header}>

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
      >
        <Text style={styles.backArrow}>
          ←
        </Text>
      </TouchableOpacity>

      <Text style={styles.title}>
        المفضلة
      </Text>

    </View>
  );

  if (favoriteChalets.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>

        {renderHeader()}

        <View style={styles.empty}>

          <WhiteHeartIcon />

          <Text style={styles.emptyText}>
            لا يوجد شاليهات في المفضلة
          </Text>

          <Text style={styles.emptySubText}>
            اضغط على القلب لإضافة شاليه
          </Text>

        </View>

      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>

      {renderHeader()}

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
};

const styles = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F4ECFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6D7FF",
  },

  backArrow: {
    fontSize: 26,
    fontWeight: "900",
    color: PURPLE,
    lineHeight: 28,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    color: PURPLE,
    textAlign: "right",
    flex: 1,
    marginRight: 14,
  },

  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "right",
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 10,
    fontWeight: "700",
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
    paddingHorizontal: 20,
  },

  emptyText: {
    fontSize: 20,
    fontWeight: "900",
    color: PURPLE,
    marginTop: 14,
    textAlign: "center",
  },

  emptySubText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 6,
    textAlign: "center",
    fontWeight: "700",
  },

});

export default FavoritesPage;