import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AMENITY_LABELS, CITIES, FormData } from "../constants/chaletForm";
import { useChaletForm } from "../hooks/useChaletForm";
import FormField from "./page/screens/components/FormField";

export default function AddEditChaletScreen() {
  const { chaletId } = useLocalSearchParams<{ chaletId?: string }>();

  const {
    form,
    loading,
    saving,
    isEdit,
    setField,
    toggleAmenity,
    handleSave,
  } = useChaletForm(chaletId);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#6A0DAD"
          style={{ marginTop: 60 }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {isEdit ? "تعديل الشاليه" : "إضافة شاليه"}
        </Text>

        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.section}>المعلومات الأساسية</Text>

        <FormField
          label="اسم الشاليه *"
          placeholder="مثال: شاليه الورود"
          value={form.name}
          onChangeText={(v) => setField("name", v)}
        />

        <Text style={styles.section}>المدينة *</Text>

        <View style={styles.amenities}>
          {CITIES.map((city) => (
            <TouchableOpacity
              key={city}
              style={[
                styles.chip,
                form.location === city && styles.chipActive,
              ]}
              onPress={() => setField("location", city)}
            >
              <Text
                style={[
                  styles.chipText,
                  form.location === city && styles.chipTextActive,
                ]}
              >
                {city}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FormField
          label="السعر بالليلة (₪) *"
          placeholder="500"
          value={form.price}
          onChangeText={(v) => setField("price", v)}
          keyboardType="numeric"
        />

        <FormField
          label="السعة (عدد الأشخاص) *"
          placeholder="10"
          value={form.capacity}
          onChangeText={(v) => setField("capacity", v)}
          keyboardType="numeric"
        />

        <Text style={styles.section}>تفاصيل إضافية</Text>

        <FormField
          label="الوصف"
          placeholder="اكتب وصفاً مختصراً"
          value={form.description}
          onChangeText={(v) => setField("description", v)}
          multiline
        />

        <View style={styles.row}>
          <FormField
            label="عدد الغرف"
            placeholder="3"
            value={form.bedrooms}
            onChangeText={(v) => setField("bedrooms", v)}
            keyboardType="numeric"
            flex
          />

          <FormField
            label="عدد الحمامات"
            placeholder="2"
            value={form.bathrooms}
            onChangeText={(v) => setField("bathrooms", v)}
            keyboardType="numeric"
            flex
          />
        </View>

        <FormField
          label="الخصم (%)"
          placeholder="10"
          value={form.discount}
          onChangeText={(v) => setField("discount", v)}
          keyboardType="numeric"
        />

        <FormField
          label="رابط الصورة"
          placeholder="https://..."
          value={form.image}
          onChangeText={(v) => setField("image", v)}
        />

        <Text style={styles.section}>المرافق</Text>

        <View style={styles.amenities}>
          {(Object.keys(form.amenities) as (keyof FormData["amenities"])[]).map(
            (key) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.chip,
                  form.amenities[key] && styles.chipActive,
                ]}
                onPress={() => toggleAmenity(key)}
              >
                <Text
                  style={[
                    styles.chipText,
                    form.amenities[key] && styles.chipTextActive,
                  ]}
                >
                  {AMENITY_LABELS[key]}
                </Text>

                {form.amenities[key] && (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                )}
              </TouchableOpacity>
            )
          )}
        </View>

        {isEdit && (
          <>
            <Text style={styles.section}>حالة الشاليه</Text>

            <View style={styles.statusRow}>
              <Switch
                value={form.status === "booked"}
                onValueChange={(v) =>
                  setField("status", v ? "booked" : "available")
                }
                trackColor={{
                  false: "#C4F1D0",
                  true: "#FECACA",
                }}
                thumbColor="#fff"
              />

              <Text style={styles.statusLabel}>
                {form.status === "booked" ? "محجوز" : "متاح"}
              </Text>
            </View>
          </>
        )}

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>
              {isEdit ? "حفظ التعديلات" : "إضافة الشاليه"}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F4ECFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6D7FF",
  },

  backArrow: {
    fontSize: 26,
    fontWeight: "900",
    color: "#6A0DAD",
    lineHeight: 28,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#6A0DAD",
  },

  scroll: {
    padding: 18,
    paddingBottom: 40,
    gap: 10,
  },

  section: {
    fontSize: 16,
    fontWeight: "800",
    color: "#6A0DAD",
    marginTop: 12,
    marginBottom: 6,
    textAlign: "right",
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  amenities: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1.5,
    borderColor: "#E9D5FF",
    borderRadius: 22,
    paddingHorizontal: 15,
    paddingVertical: 9,
    backgroundColor: "#FFFFFF",
  },

  chipActive: {
    backgroundColor: "#6A0DAD",
    borderColor: "#6A0DAD",
  },

  chipText: {
    fontSize: 13,
    color: "#4B5563",
    fontWeight: "600",
  },

  chipTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  statusLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
  },

  saveBtn: {
    backgroundColor: "#6A0DAD",
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },

  saveBtnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },
});