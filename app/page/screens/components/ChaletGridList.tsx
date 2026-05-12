import React from "react";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import ChaletCard from "./ChaletCard";

const { width } = Dimensions.get("window");

type Props = {
  data: any[];
};

export default function ChaletGridList({ data }: Props) {
  return (
    <FlatList
      data={data}
      numColumns={2}
      keyExtractor={(item, i) => item?.id?.toString() ?? i.toString()}
      contentContainerStyle={styles.container}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <ChaletCard chalet={item} />
        </View>
      )}
      ListEmptyComponent={
        <Text style={styles.empty}>لا توجد نتائج</Text>
      }
    />
  );
}
const styles = StyleSheet.create({
  container: {paddingHorizontal: 12,paddingTop: 90,},
  row: { justifyContent: "center",},
  card: {width: width * 0.45,marginHorizontal: 5,marginBottom: 18,},
  empty: {textAlign: "center",marginTop: 100,color: "#999",},
});