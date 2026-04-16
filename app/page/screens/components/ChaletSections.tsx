import React from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import ChaletCard from './ChaletCard';

const W = Dimensions.get("window").width;

const ChaletSections = ({ title, data, onSeeAll, marginTop = 0 }: any) => (
  <View style={{ marginTop }}>

    <View style={s.header}>
      <Pressable onPress={onSeeAll}>
        <Text style={s.seeAll}>عرض الكل</Text>
      </Pressable>
      <Text style={s.title}>{title}</Text>
    </View>

    <FlatList
      horizontal
      inverted
      data={data?.slice(0, 4) ?? []}
      keyExtractor={(item, i) => item.id?.toString() ?? i.toString()}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.padding}
      renderItem={({ item }) => (
        <View style={s.card}>
          <ChaletCard chalet={item} />
        </View>
      )}
    />

  </View>
);

const s = StyleSheet.create({
  header:  { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 25, marginBottom: 15 },
  title:   { fontSize: 19, fontWeight: "800", color: "#1A1A1A" },
  seeAll:  { color: "#000000", fontSize: 14, fontWeight: "700" },
  card:    { width: W * 0.75, marginLeft: 15 },
  padding: { paddingLeft: 20 },
});

export default ChaletSections;