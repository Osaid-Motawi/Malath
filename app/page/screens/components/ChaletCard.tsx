import React, { useRef, useState } from "react";
import {Dimensions, Image,NativeScrollEvent,NativeSyntheticEvent,ScrollView,StyleSheet,Text,TouchableOpacity,View,} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { Chalet } from "../../services/chaletService";
import { useChalets } from "./ChaletContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 32;

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24">
    <Path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill={filled ? "#e11d48" : "none"}
      stroke={filled ? "#e11d48" : "#fff"}
      strokeWidth="1.8"
    />
  </Svg>
);

const PersonIcon = () => (
  <Svg width="15" height="15" viewBox="0 0 24 24">
    <Circle cx="12" cy="7" r="4" fill="#000000" />
    <Path d="M4 21v-1a8 8 0 0116 0v1" fill="#000000" />
  </Svg>
);

interface Props {
  chalet: Chalet;
  onPress?: (chalet: Chalet) => void;
}

 function ChaletCard({ chalet, onPress }: Props) {
  const { toggleFavorite, isFavorite } = useChalets();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const images = chalet.image ? [chalet.image] : chalet.images?.length ? chalet.images : [];
  const discount = 5;
  const originalPrice = Math.round(chalet.price / (1 - discount / 100));

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH));
  }

  return (
    <TouchableOpacity style={s.card} onPress={() => onPress?.(chalet)} activeOpacity={0.93}>
      <View style={s.imgWrapper}>
        {images.length > 0 ? (
          <ScrollView ref={scrollRef} horizontal pagingEnabled showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll} scrollEventThrottle={16}>
            {images.map((uri, i) => (
              <Image key={i} source={{ uri }} style={[s.img, { width: CARD_WIDTH }]} resizeMode="cover" />
            ))}
          </ScrollView>
        ) : (
          <View style={s.img} />
        )}

        <TouchableOpacity style={s.heartBtn} onPress={() => toggleFavorite(chalet.id)}>
          <HeartIcon filled={isFavorite(chalet.id)} />
        </TouchableOpacity>

        {images.length > 1 && (
          <View style={s.dots}>
            {images.map((_, i) => (
              <View key={i} style={[s.dot, i === activeIndex && s.dotActive]} />
            ))}
          </View>
        )}
      </View>

      <View style={s.info}>
        <View style={s.topRow}>
          <View style={s.capacityBox}>
            <PersonIcon />
            <Text style={s.capacityText}>{chalet.capacity}</Text>
          </View>
          <View style={s.ratingRow}>
            <Text style={s.gray}>تقييم</Text>
            <Text style={s.gray}>{chalet.rating ?? 0}</Text>
            <Text style={s.star}>★</Text>
          </View>
        </View>
        <Text style={s.name} numberOfLines={2}>{chalet.name}</Text>
        <Text style={[s.gray, { textAlign: "right" }]}>{chalet.location}</Text>
        <View style={s.priceRow}>
          <View style={s.badge}>
            <Text style={s.badgeText}>%{discount} خصم</Text>
          </View>
          <View style={s.priceRight}>
            <Text style={s.gray}>/ليلة</Text>
            <Text style={s.price}>{chalet.price} ₪</Text>
            <Text style={s.oldPrice}>{originalPrice}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "#fff", borderRadius: 12, marginBottom: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2, overflow: "hidden",
  },
  imgWrapper: { borderTopLeftRadius: 12, borderTopRightRadius: 12, overflow: "hidden" },
  img: { height: 205, backgroundColor: "#e5e7eb" },
  heartBtn: {
    position: "absolute", top: 10, right: 10,
     width: 34, height: 34,
    justifyContent: "center", alignItems: "center",
  },
  dots: { position: "absolute", bottom: 9, left: 0, right: 0, flexDirection: "row", justifyContent: "center", gap: 4 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: "#ffffff55" },
  dotActive: { backgroundColor: "#fff", width: 16 },
  info: { paddingHorizontal: 11, paddingTop: 9, paddingBottom: 11, gap: 4 },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  capacityBox: { flexDirection: "row", alignItems: "center", gap: 4 },
  capacityText: { fontSize: 13, color: "#6B7280" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  star: { fontSize: 13, color: "#000000" },
  gray: { fontSize: 12, color: "#6B7280" },
  name: { fontSize: 15, fontWeight: "700", color: "#111827", textAlign: "right", lineHeight: 22 },
  priceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
  badge: { backgroundColor: "#517c63", borderRadius: 5, paddingHorizontal: 7, paddingVertical: 3 },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  priceRight: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  oldPrice: { fontSize: 12, color: "#9CA3AF", textDecorationLine: "line-through" },
  price: { fontSize: 15, fontWeight: "700", color: "#111827" },
});
export default ChaletCard;