import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Chalet } from "../../services/chaletService";
import { useChalet } from "../components/ChaletContext";
import { HeartIcon, PersonIcon } from "./CustomIcon";

interface Props {
  chalet: Chalet;
  onPress?: (chalet: Chalet) => void;
  cardWidth?: number;
}

const ChaletCard = ({ chalet, onPress }: Props) => {
  
  const { toggleFavorite, isFavorite } = useChalet();

  const image = chalet.image;
  const discount = chalet.discount ?? 0;
  const originalPrice =
  discount > 0 ? Math.round(chalet.price / (1 - discount / 100)) : null;

  function handlePress() {
    if (onPress) {
      onPress(chalet);
    } else {
      router.push({
        pathname: "/chalet-details",
        params: { chaletId: chalet.id },
      });
    }
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.93}>
      <View style={styles.imgWrapper}>
        {image ? (
          <Image
            source={{ uri: chalet.image }}
            style={{ width: "100%", aspectRatio: 4 / 3, backgroundColor: "#e5e7eb" }}
            resizeMode="cover"
          />
        ) : (
          <View style={{ width: "100%", aspectRatio: 4 / 3, backgroundColor: "#e5e7eb" }} />
        )}

        <TouchableOpacity
          style={styles.heartBtn}
          onPress={() => toggleFavorite(chalet.id)}
        >
          <HeartIcon filled={isFavorite(chalet.id)} />
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <View style={styles.topRow}>
          <View style={styles.capacityBox}>
            <PersonIcon />
            <Text style={styles.capacityText}>{chalet.capacity}</Text>
          </View>

          <View style={styles.ratingRow}>
            <Text style={styles.gray}>تقييم</Text>
            <Text style={styles.gray}>{chalet.rating ?? 0}</Text>
            <Text style={styles.star}>★</Text>
          </View>
        </View>

        <Text style={styles.name} numberOfLines={2}>
          {chalet.name}
        </Text>

        <View style={styles.locationRow}>
          {discount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}> خصم %{discount}</Text>
            </View>
          ) : (
            <View />)}
          <Text style={styles.locationText}>{chalet.location}</Text>
        </View>
        <View style={styles.priceRow}><View />
          <View style={styles.priceRight}>
            <Text style={styles.gray}>/ليلة</Text>
            <Text style={styles.price}>{chalet.price} ₪</Text>
            {originalPrice && (
              <Text style={styles.oldPrice}>{originalPrice} ₪</Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
card: { backgroundColor: "#FFFFFF", borderRadius: 12, borderWidth: 1, borderColor: "#E9DDFB", marginBottom: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2, overflow: "hidden" },
imgWrapper: { borderTopLeftRadius: 12, borderTopRightRadius: 12, overflow: "hidden" },
image: { width: "100%", aspectRatio: 4 / 3, backgroundColor: "#E5E7EB" },
emptyImage: { width: "100%", aspectRatio: 4 / 3, backgroundColor: "#E5E7EB" },
heartBtn: { position: "absolute", top: 10, right: 10, width: 34, height: 34, justifyContent: "center", alignItems: "center" },
info: { paddingHorizontal: 11, paddingTop: 9, paddingBottom: 11, gap: 4 },
topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
capacityBox: { flexDirection: "row", alignItems: "center", gap: 4 },
capacityText: { fontSize: 13, color: "#6B7280" },
ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
star: { fontSize: 13, color: "#000000" },
gray: { fontSize: 12, color: "#6B7280" },
name: { fontSize: 15, fontWeight: "700", color: "#111827", textAlign: "right", lineHeight: 22 },
locationRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 2 },
locationText: { fontSize: 12, color: "#6B7280", textAlign: "right", flex: 1 },
badge: { backgroundColor: "#6A0DAD", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginRight: 6 },
badgeText: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
priceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
priceRight: { flexDirection: "row", alignItems: "baseline", gap: 4 },
oldPrice: { fontSize: 12, color: "#9CA3AF", textDecorationLine: "line-through" },
price: { fontSize: 15, fontWeight: "700", color: "#111827" },
});
export default ChaletCard;