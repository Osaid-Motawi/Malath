import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Chalet,
  addChalet,
  getChaletById,
  updateChalet,
} from "../app/page/services/chaletService";

type FormData = {
  name: string;
  location: string;
  price: string;
  capacity: string;
  description: string;
  bedrooms: string;
  bathrooms: string;
  discount: string;
  image: string;
  status: "available" | "booked";
  amenities: {
    Kitchen: boolean;
    Parking: boolean;
    Pool: boolean;
    WiFi: boolean;
  };
};

const DEFAULT_FORM: FormData = {
  name: "",
  location: "",
  price: "",
  capacity: "",
  description: "",
  bedrooms: "",
  bathrooms: "",
  discount: "",
  image: "",
  status: "available",
  amenities: {
    Kitchen: false,
    Parking: false,
    Pool: false,
    WiFi: false,
  },
};

const AMENITY_LABELS: Record<keyof FormData["amenities"], string> = {
  Kitchen: "مطبخ",
  Parking: "موقف سيارات",
  Pool: "مسبح",
  WiFi: "واي فاي",
};

export default function AddEditChaletScreen() {
  const { chaletId } = useLocalSearchParams<{ chaletId?: string }>();
  const isEdit = !!chaletId;

  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;

    const loadChalet = async () => {
      try {
        const chalet = await getChaletById(chaletId!);

        if (!chalet) {
          Alert.alert("خطأ", "الشاليه غير موجود");
          router.back();
          return;
        }

        fillForm(chalet);
      } catch (error) {
        console.error(error);
        Alert.alert("خطأ", "فشل تحميل بيانات الشاليه");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    loadChalet();
  }, [chaletId, isEdit]);

  function fillForm(c: Chalet) {
    setForm({
      name: c.name ?? "",
      location: c.location ?? "",
      price: String(c.price ?? ""),
      capacity: String(c.capacity ?? ""),
      description: c.description ?? "",
      bedrooms: String(c.bedrooms ?? ""),
      bathrooms: String(c.bathrooms ?? ""),
      discount: String(c.discount ?? ""),
      image: c.image ?? "",
      status: c.status ?? "available",
      amenities: {
        Kitchen: c.amenities?.Kitchen ?? false,
        Parking: c.amenities?.Parking ?? false,
        Pool: c.amenities?.Pool ?? false,
        WiFi: c.amenities?.WiFi ?? false,
      },
    });
  }

  function setField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleAmenity(key: keyof FormData["amenities"]) {
    setForm((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [key]: !prev.amenities[key],
      },
    }));
  }

  async function handleSave() {
    if (!form.name.trim() || !form.location.trim() || !form.price || !form.capacity) {
      Alert.alert("تنبيه", "يرجى تعبئة الحقول الإلزامية (الاسم، الموقع، السعر، السعة)");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        location: form.location.trim(),
        price: Number(form.price),
        capacity: Number(form.capacity),
        description: form.description.trim(),
        bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
        discount: form.discount ? Number(form.discount) : undefined,
        image: form.image.trim() || undefined,
        images: form.image.trim() ? [form.image.trim()] : [],
        status: form.status,
        amenities: form.amenities,
      };

      if (isEdit) {
        await updateChalet(chaletId!, payload);
      } else {
        await addChalet(payload);
      }

      Alert.alert("تم", isEdit ? "تم تعديل الشاليه" : "تمت إضافة الشاليه");
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert("خطأ", "فشل الحفظ، حاول مجددًا");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#517c63" style={{ marginTop: 60 }} />
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
        <SectionTitle title="المعلومات الأساسية" />

        <Field
          label="اسم الشاليه *"
          placeholder="مثال: شاليه الورود"
          value={form.name}
          onChangeText={(v) => setField("name", v)}
        />

        <Field
          label="الموقع *"
          placeholder="مثال: رام الله، بيرزيت"
          value={form.location}
          onChangeText={(v) => setField("location", v)}
        />

        <Field
          label="السعر بالليلة (₪) *"
          placeholder="500"
          value={form.price}
          onChangeText={(v) => setField("price", v)}
          keyboardType="numeric"
        />

        <Field
          label="السعة (عدد الأشخاص) *"
          placeholder="10"
          value={form.capacity}
          onChangeText={(v) => setField("capacity", v)}
          keyboardType="numeric"
        />

        <SectionTitle title="تفاصيل إضافية" />

        <Field
          label="الوصف"
          placeholder="اكتب وصفاً مختصراً للشاليه"
          value={form.description}
          onChangeText={(v) => setField("description", v)}
          multiline
        />

        <View style={styles.row}>
          <Field
            label="عدد الغرف"
            placeholder="3"
            value={form.bedrooms}
            onChangeText={(v) => setField("bedrooms", v)}
            keyboardType="numeric"
            flex
          />

          <Field
            label="عدد الحمامات"
            placeholder="2"
            value={form.bathrooms}
            onChangeText={(v) => setField("bathrooms", v)}
            keyboardType="numeric"
            flex
          />
        </View>

        <Field
          label="الخصم (%)"
          placeholder="10"
          value={form.discount}
          onChangeText={(v) => setField("discount", v)}
          keyboardType="numeric"
        />

        <Field
          label="رابط الصورة الرئيسية"
          placeholder="https://..."
          value={form.image}
          onChangeText={(v) => setField("image", v)}
        />

        <SectionTitle title="المرافق" />

        <View style={styles.amenitiesGrid}>
          {(Object.keys(form.amenities) as (keyof FormData["amenities"])[]).map((key) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.amenityChip,
                form.amenities[key] && styles.amenityChipActive,
              ]}
              onPress={() => toggleAmenity(key)}
            >
              <Text
                style={[
                  styles.amenityText,
                  form.amenities[key] && styles.amenityTextActive,
                ]}
              >
                {AMENITY_LABELS[key]}
              </Text>
              {form.amenities[key] && (
                <Ionicons name="checkmark" size={14} color="#fff" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {isEdit && (
          <>
            <SectionTitle title="حالة الشاليه" />
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
                {form.status === "booked" ? "محجوز 🔴" : "متاح 🟢"}
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

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function Field({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  multiline,
  flex,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: "default" | "numeric";
  multiline?: boolean;
  flex?: boolean;
}) {
  return (
    <View style={[styles.fieldWrapper, flex && { flex: 1 }]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType ?? "default"}
        multiline={multiline}
        textAlign="right"
      />
    </View>
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

  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  scroll: {
    padding: 16,
    paddingBottom: 40,
    gap: 10,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4F2396",
    marginTop: 10,
    marginBottom: 4,
    textAlign: "right",
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  fieldWrapper: {
    gap: 5,
  },

  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    textAlign: "right",
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
  },

  inputMultiline: {
    minHeight: 90,
    textAlignVertical: "top",
  },

  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  amenityChip: {
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

  amenityChipActive: {
    backgroundColor: "#4F2396",
    borderColor: "#4F2396",
  },

  amenityText: {
    fontSize: 13,
    color: "#374151",
  },

  amenityTextActive: {
    color: "#fff",
    fontWeight: "600",
  },

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

  statusLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },

  saveBtn: {
    backgroundColor: "#4F2396",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },

  saveBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});