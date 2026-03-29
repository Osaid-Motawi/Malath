import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Chalet } from "../../services/chaletService";
import { useChalets } from "./ChaletContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 32; 

interface Props {
  chalet: Chalet;
  onPress?: (chalet: Chalet) => void;
}

const ChaletCard = ({ chalet, onPress }: Props) => {
  const { toggleFavorite, isFavorite } = useChalets();
  const favorite = isFavorite(chalet.id);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const images =
    chalet.images?.length > 0
      ? chalet.images
      : ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400"];

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
    setActiveIndex(index);
  };

  const goTo = (dir: "prev" | "next") => {
    const next =
      dir === "next"
        ? Math.min(activeIndex + 1, images.length - 1)
        : Math.max(activeIndex - 1, 0);
    scrollRef.current?.scrollTo({ x: next * CARD_WIDTH, animated: true });
    setActiveIndex(next);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(chalet)} activeOpacity={0.95}>
      {/* Carousel */}
      <View style={styles.imageContainer}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
        >
          {images.map((uri, index) => (
            <Image
              key={index}
              source={{ uri }}
              style={[styles.image, { width: CARD_WIDTH }]}
            />
          ))}
        </ScrollView>

        {/* سهم يسار */}
        {activeIndex > 0 && (
          <TouchableOpacity style={[styles.arrow, styles.arrowLeft]} onPress={() => goTo("prev")}>
            <Text style={styles.arrowText}>‹</Text>
          </TouchableOpacity>
        )}

        {/* سهم يمين */}
        {activeIndex < images.length - 1 && (
          <TouchableOpacity style={[styles.arrow, styles.arrowRight]} onPress={() => goTo("next")}>
            <Text style={styles.arrowText}>›</Text>
          </TouchableOpacity>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <View style={styles.dots}>
            {images.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === activeIndex && styles.dotActive]}
              />
            ))}
          </View>
        )}

        {/* زر القلب */}
        <TouchableOpacity
          style={styles.heartBtn}
          onPress={() => toggleFavorite(chalet.id)}
        >
          <Text style={styles.heartIcon}>{favorite ? "❤️" : "🤍"}</Text>
        </TouchableOpacity>

        {/* خصم */}
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>30% خصم</Text>
        </View>
      </View>

      {/* المعلومات */}
      <View style={styles.info}>
        <View style={styles.ratingRow}>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.ratingText}>4.5</Text>
          <Text style={styles.ratingCount}>(173) تقييم</Text>
        </View>

        <Text style={styles.name} numberOfLines={1}>
          {chalet.name}
        </Text>

        <Text style={styles.location}>📍 {chalet.location}</Text>

        <View style={styles.capacityRow}>
          <Text style={styles.capacityText}>👥 {chalet.capacity}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.price}>{chalet.price} ₪</Text>
          <Text style={styles.perNight}> / ليلة</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    height: 200,
    backgroundColor: "#e0e0e0",
  },
  arrow: {
    position: "absolute",
    top: "50%",
    marginTop: -20,
    backgroundColor: "#ffffffcc",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowLeft: {
    left: 10,
  },
  arrowRight: {
    right: 10,
  },
  arrowText: {
    fontSize: 24,
    color: "#1a1a1a",
    lineHeight: 28,
  },
  dots: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    flexDirection: "row",
    gap: 5,
    left: 0,
    right: 0,
    justifyContent: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ffffff88",
  },
  dotActive: {
    backgroundColor: "#fff",
    width: 18,
  },
  heartBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#ffffffcc",
    borderRadius: 20,
    padding: 6,
  },
  heartIcon: {
    fontSize: 20,
  },
  discountBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  discountText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  info: {
    padding: 12,
    gap: 5,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  star: { fontSize: 13 },
  ratingText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  ratingCount: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  name: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  location: {
    fontSize: 13,
    color: "#6B7280",
  },
  capacityRow: {
    flexDirection: "row",
    gap: 10,
  },
  capacityText: {
    fontSize: 13,
    color: "#6B7280",
  },
  footer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563EB",
  },
  perNight: {
    fontSize: 13,
    color: "#9CA3AF",
  },
});

export default ChaletCard;
