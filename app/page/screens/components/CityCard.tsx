import React, { useState } from "react";
import { Image,Pressable,StyleSheet,Text,View } from "react-native";

interface Props {
  city: string;
  image: any;
  onPress: () => void;
}

export default function CityCard({ city, image, onPress }: Props) {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      <Image source={image} style={styles.image} resizeMode="cover" />
      <View style={styles.overlay}>
        <View style={styles.textBox}>
          <Text style={styles.cityName}>{city}</Text>
          <Text style={styles.subtitle}>
            استعرض الشاليهات المتوفرة
          </Text>
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
    shadowColor: "#17131D",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 5,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
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
  }
});