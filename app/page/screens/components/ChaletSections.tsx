import React from "react";
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import ChaletCard from "./ChaletCard";

const { width } = Dimensions.get("window");

export default function ChaletSections({ title, data, onSeeAll }: any) {
  return (
    <View>

      <Text style={styles.title}>
        {title}
      </Text>
      <View style={styles.container}>
        {data.slice(0, 4).map((item: any, index: number) => (
          <View key={index} style={styles.card}>
            <ChaletCard chalet={item} />
          </View>
        ))}
      </View>
      <Pressable style={styles.moreButton} onPress={onSeeAll}>
        <Text style={styles.moreText}> عرض المزيد</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({

  title: {fontSize: 24, fontWeight: "900", color: "#6A0DAD", textAlign: "right", paddingHorizontal: 20, marginBottom: 18,},
  container: {  flexDirection: "row",flexWrap: "wrap",justifyContent: "space-between",paddingHorizontal: 14, },
  card: {width: width * 0.45,  marginBottom: 18,},
  moreButton: { alignSelf: "center", backgroundColor: "#6A0DAD", paddingHorizontal: 28, paddingVertical: 12, borderRadius: 999, marginTop: 8,},
  moreText: {color: "#FFFFFF", fontSize: 14, fontWeight: "700",},

});