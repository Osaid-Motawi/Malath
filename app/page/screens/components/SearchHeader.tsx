import React from "react";
import { Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import { CloseIcon, SearchIcon } from "../components/CustomIcon";

export default function SearchHeader({
  isSearchActive,
  setIsSearchActive,
  searchQuery,
  setSearchQuery,
}: any) {
  return (
    <View style={styles.searchArea}>
      
      <Pressable
        onPress={() => setIsSearchActive(true)}
        style={styles.iconCircle}
      >
        <SearchIcon size={18} color="#4F2396" />
      </Pressable>

      {isSearchActive && (
        <View style={styles.inputWrapper}>
          
          <TextInput
            autoFocus
            placeholder="ابحث عن شاليه..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            textAlign="right"
            selectionColor="#6A0DAD"
            cursorColor="#6A0DAD"
          />

          <Pressable
            onPress={() => {
              setIsSearchActive(false);
              setSearchQuery("");
            }}
            style={styles.closeBtn}
          >
            <CloseIcon size={16} color="#6A0DAD" />
          </Pressable>

        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  searchArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F3EEFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6DAFF",
  },

inputWrapper: {
  flexDirection: "row",
  alignItems: "center",

  backgroundColor: "#FFFFFF",
  borderRadius: 14,

  paddingHorizontal: 10,
  height: 35,          
  width: 150,          

  borderWidth: 1,
  borderColor: "#E6DAFF",

  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowRadius: 6,
  elevation: 2,
},

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    textAlign: "right",
    paddingRight: 6,

    ...Platform.select({
      web: {
        outlineStyle: "none",
      } as any,
    }),
  },

  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F3EEFF",
    justifyContent: "center",
    alignItems: "center",
  },
});