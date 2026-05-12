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
<FlatList
  data={data.slice(0, 4)}
  numColumns={2}
  keyExtractor={(item, index) => index.toString()}
  contentContainerStyle={styles.container}
  columnWrapperStyle={styles.row}
  renderItem={({ item }) => (
    <View style={styles.card}>
      <ChaletCard chalet={item} />
    </View>
  )}
/>
      <Pressable style={styles.moreButton} onPress={onSeeAll}>
        <Text style={styles.moreText}> عرض المزيد</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({

  title: {fontSize: 24, fontWeight: "900", color: "#6A0DAD", textAlign: "right", paddingHorizontal: 20, marginBottom: 18,},
  container: { paddingHorizontal: 12, },
  row: { justifyContent: "center", },
  card: {width: width * 0.45, marginHorizontal: 5, marginBottom: 18,},
  moreButton: { alignSelf: "center", backgroundColor: "#6A0DAD", paddingHorizontal: 28, paddingVertical: 12, borderRadius: 999, marginTop: 8,},
  moreText: {color: "#FFFFFF", fontSize: 14, fontWeight: "700",},

});