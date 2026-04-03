import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Chalet } from "../../services/chaletService";
import { useChalets } from "./ChaletContext";
import { HeartIcon, PersonIcon } from "./CustomIcon";



interface Props {
    chalet: Chalet;
    onPress?: (chalet: Chalet) => void;
    cardWidth?: number;
}

function ChaletCard({ chalet, onPress }: Props) {
    const { toggleFavorite, isFavorite } = useChalets();


    const image = chalet.image; 

    const discount = chalet.discount ?? 0;
    const originalPrice = discount > 0 ? Math.round(chalet.price / (1 - discount / 100)) : null;

    return (
        <TouchableOpacity style={styles.card} onPress={() => onPress?.(chalet)} activeOpacity={0.93}>
            <View style={styles.imgWrapper}>
                {image ? (
            <Image
                source={{ uri: chalet.image }}
                style={{ width: "100%", aspectRatio: 4/3, backgroundColor: "#e5e7eb" }}
                resizeMode="cover"
                />
                ) : (
                    <View style={{ width: "100%", aspectRatio: 4/3, backgroundColor: "#e5e7eb" }} />
                )}

                <TouchableOpacity style={styles.heartBtn} onPress={() => toggleFavorite(chalet.id)}>
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

                <Text style={styles.name} numberOfLines={2}>{chalet.name}</Text>
                <Text style={[styles.gray, { textAlign: "right" }]}>{chalet.location}</Text>

                <View style={styles.priceRow}>
                    {discount > 0 ? (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>%{discount} خصم</Text>
                        </View>
                    ) : (
                        <View />
                    )}

                    <View style={styles.priceRight}>
                        <Text style={styles.gray}>/ليلة</Text>
                        <Text style={styles.price}>{chalet.price} ₪</Text>
                        {originalPrice && (
                            <Text style={styles.oldPrice}>{originalPrice}</Text>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff", borderRadius: 12, marginBottom: 14,
        shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06, shadowRadius: 6, elevation: 2, overflow: "hidden",
    },
    imgWrapper: { borderTopLeftRadius: 12, borderTopRightRadius: 12, overflow: "hidden" },
    heartBtn: { position: "absolute", top: 10, right: 10,
        width: 34, height: 34, justifyContent: "center", alignItems: "center" },
    info: { paddingHorizontal: 11, paddingTop: 9, paddingBottom: 11, gap: 4 },
    topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    capacityBox: { flexDirection: "row", alignItems: "center", gap: 4 },
    capacityText: { fontSize: 13, color: "#6B7280" },
    ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
    star: { fontSize: 13, color: "#000000" },
    gray: { fontSize: 12, color: "#6B7280" },
    name: { fontSize: 15, fontWeight: "700", color: "#111827", textAlign: "right", lineHeight: 22 },
    priceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
    badge: { backgroundColor: "#517c63", borderRadius: 8, paddingHorizontal: 5, paddingVertical: 3 },
    badgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
    priceRight: { flexDirection: "row", alignItems: "baseline", gap: 4 },
    oldPrice: { fontSize: 12, color: "#9CA3AF", textDecorationLine: "line-through" },
    price: { fontSize: 15, fontWeight: "700", color: "#111827" },
});

export default ChaletCard;