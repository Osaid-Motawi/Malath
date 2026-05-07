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
  const { form, loading, saving, isEdit, setField, toggleAmenity, handleSave } =
    useChaletForm(chaletId);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#517c63"
          style={{ marginTop: 60 }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEdit ? "تعديل الشاليه" : "إضافة شاليه"}
        </Text>
        <View style={{ width: 24 }} />
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
              style={[styles.chip, form.location === city && styles.chipActive]}
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
                style={[styles.chip, form.amenities[key] && styles.chipActive]}
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
            ),
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
                trackColor={{ false: "#86efac", true: "#FCA5A5" }}
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
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#111827" },
  scroll: { padding: 16, paddingBottom: 40, gap: 10 },
  section: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4F2396",
    marginTop: 10,
    marginBottom: 4,
    textAlign: "right",
  },
  row: { flexDirection: "row", gap: 10 },
  amenities: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: "#fff",
  },
  chipActive: { backgroundColor: "#4F2396", borderColor: "#4F2396" },
  chipText: { fontSize: 13, color: "#374151" },
  chipTextActive: { color: "#fff", fontWeight: "600" },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statusLabel: { fontSize: 14, fontWeight: "600", color: "#374151" },
  saveBtn: {
    backgroundColor: "#4F2396",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
