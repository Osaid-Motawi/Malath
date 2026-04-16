import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Keyboard,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ChaletCard from "../components/ChaletCard";
import { useChalet } from "../components/ChaletContext";
import ChaletSections from "../components/ChaletSections";
import HeroFadeSlider from "../components/HeroFadeSlider";

const { width } = Dimensions.get("window");

//  FullView Component 
function FullView({ title, data, onBack }: any) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: "#FFF", zIndex: 2000 }]}>
      <View style={[styles.fullViewHeader, { paddingTop: insets.top + 10 }]}>
        <Pressable onPress={onBack}><Ionicons name="arrow-forward" size={26} color="#000" /></Pressable>
        <Text style={styles.fullViewTitle}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>
      <FlatList
        data={data}
        numColumns={2}
        keyExtractor={(item, i) => item?.id?.toString() ?? i.toString()}
        renderItem={({ item }) => <View style={styles.gridCard}><ChaletCard chalet={item} /></View>}
        contentContainerStyle={styles.gridPadding}
      />
    </View>
  );
}

//  HomePage Component
export default function HomePage() {
  const insets = useSafeAreaInsets();
  const { chalets, loading } = useChalet();
  const scrollY = useRef(new Animated.Value(0)).current;

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [activeFullView, setActiveFullView] = useState<"top" | "popular" | null>(null);

  const topRated = useMemo(() => chalets.filter((c: any) => (c?.rating ?? 0) >= 7), [chalets]);
  const popular = useMemo(() => chalets.filter((c: any) => (c?.rating ?? 0) >= 8), [chalets]);
  
  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return chalets.filter((c: any) => 
      c?.name?.toLowerCase().includes(q) || c?.location?.toLowerCase().includes(q)
    );
  }, [searchQuery, chalets]);

  const showSearch = isSearchActive && searchQuery.trim().length > 0;

  if (loading) return <View style={styles.center}><Text style={styles.loadingText}>MALATH</Text></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <Animated.View style={[styles.header, {
        paddingTop: insets.top + 10,
        backgroundColor: showSearch ? "#FFF" : scrollY.interpolate({ 
          inputRange: [0, 100], 
          outputRange: ["transparent", "#FFF"], 
          extrapolate: "clamp" 
        }),
        borderBottomWidth: showSearch ? 0.5 : 0,
        borderBottomColor: "#EEE",
      }]}>
        <View style={styles.headerContent}>
          <View style={styles.searchArea}>
            <Pressable onPress={() => setIsSearchActive(true)} style={styles.iconCircle}>
              <Ionicons name="search" size={18} color="#000" />
            </Pressable>
            
            {isSearchActive && (
              <View style={styles.inputWrapper}>
                <TextInput
                  autoFocus
                  placeholder="ابحث"
                  placeholderTextColor="#AAA"
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  textAlign="right"
                  selectionColor="#C5A358"
                  underlineColorAndroid="transparent"
                  cursorColor="#C5A358"
                />
                <Pressable onPress={() => { setIsSearchActive(false); setSearchQuery(""); Keyboard.dismiss(); }}>
                  <Ionicons name="close-circle" size={16} color="#AAA" />
                </Pressable>
              </View>
            )}
          </View>
          <Text style={styles.logoText}>MALATH</Text>
        </View>
      </Animated.View>

      <View style={{ flex: 1 }}>
        {showSearch ? (
          <View style={[styles.searchPage, { paddingTop: insets.top + 70 }]}>
            <FlatList
              data={searchResults}
              numColumns={2}
              keyExtractor={(item, i) => item?.id?.toString() ?? i.toString()}
              contentContainerStyle={styles.gridPadding}
              renderItem={({ item }) => <View style={styles.gridCard}><ChaletCard chalet={item} /></View>}
              ListEmptyComponent={<Text style={styles.emptyText}>لا توجد نتائج..</Text>}
            />
          </View>
        ) : (
          <Animated.ScrollView
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
          >
            <HeroFadeSlider slides={chalets} />
            <View style={styles.contentBody}>
              <ChaletSections title="الأعلى تقييماً" data={topRated} onSeeAll={() => setActiveFullView("top")} />
              <View style={{ height: 25 }} />
              <ChaletSections title="الأكثر شهرة" data={popular} onSeeAll={() => setActiveFullView("popular")} />
            </View>
            <View style={{ height: 100 }} />
          </Animated.ScrollView>
        )}
      </View>

      {activeFullView && (
        <FullView
          title={activeFullView === "top" ? "الأعلى تقييماً" : "الأكثر شهرة"}
          data={activeFullView === "top" ? topRated : popular}
          onBack={() => setActiveFullView(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 22, fontWeight: "900", color: "#000", letterSpacing: 4 },
  
  header: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 100, paddingBottom: 10 },
  headerContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20 },
  
  searchArea: { flexDirection: "row", alignItems: "center", gap: 6 },
  inputWrapper: { 
    flexDirection: "row",
    backgroundColor: "rgba(242,242,247,0.9)", 
    borderRadius: 12, 
    paddingHorizontal: 8, 
    height: 32, 
    width: width * 0.45 
  },
  searchInput: { 
    flex: 1, 
    height: 32, 
    fontSize: 13, 
    color: "#000", 
    textAlign: "right",
    paddingRight: 5,
    ...Platform.select({ 
      web: { 
        outlineStyle: "none",
        boxShadow: "none"     
      } as any 
    }) 
  },
  
  logoText: { fontSize: 20, fontWeight: "900", color: "#000", letterSpacing: 3 },
  iconCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(255,255,255,0.8)", justifyContent: "center", alignItems: "center" },
  
  searchPage: { ...StyleSheet.absoluteFillObject, backgroundColor: "#FFF", zIndex: 50 },
  contentBody: { marginTop: -30, backgroundColor: "#FFF", borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingTop: 20 },
  gridPadding: { paddingHorizontal: 10, paddingBottom: 50 },
  gridCard: { width: "50%", padding: 5 },
  emptyText: { textAlign: "center", marginTop: 100, color: "#999", fontSize: 15 },
  
  fullViewHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 0.5, borderBottomColor: "#EEE" },
  fullViewTitle: { fontSize: 18, fontWeight: "800" },
});