import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Props {
  city: string;
  image: any;
  onPress: () => void;
}

export default function CityCard({ city, image, onPress }: Props) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        styles.card,
        hovered && styles.cardHovered,
        pressed && styles.cardPressed,
      ]}
    >
      <Image source={image} style={styles.image} resizeMode="cover" />

      <View style={[styles.overlay, hovered && styles.overlayHovered]}>
        <View style={styles.textBox}>
          <Text style={styles.cityName}>{city}</Text>
          <Text style={styles.subtitle}>استعرض الشاليهات المتوفرة</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 190,
    borderRadius: 26,
    overflow: "hidden",
    marginBottom: 18,
    backgroundColor: "#FFFFFF",
    position: "relative",
    shadowColor: "#17131D",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 5,
  },

  cardHovered: {
    transform: [{ scale: 1.025 }],
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 8,
  },

  cardPressed: {
    transform: [{ scale: 0.985 }],
  },

  image: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: "rgba(23,19,29,0.28)",
  },

  overlayHovered: {
    backgroundColor: "rgba(79,35,150,0.35)",
  },

  textBox: {
    alignItems: "flex-end",
  },

  cityName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "right",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "rgba(255,255,255,0.92)",
    textAlign: "right",
  },
});