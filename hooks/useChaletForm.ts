import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import {
  addChalet,
  getChaletById,
  updateChalet,
} from "../app/page/services/chaletService";
import { DEFAULT_FORM, FormData } from "../constants/chaletForm";

export function useChaletForm(chaletId?: string) {
  const isEdit = !!chaletId;
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const chalet = await getChaletById(chaletId!);

        if (!chalet) {
          Alert.alert("خطأ", "الشاليه غير موجود");
          router.back();
          return;
        }

        setForm({
          name: chalet.name ?? "",
          location: chalet.location ?? "",
          price: String(chalet.price ?? ""),
          capacity: String(chalet.capacity ?? ""),
          description: chalet.description ?? "",
          bedrooms: String(chalet.bedrooms ?? ""),
          bathrooms: String(chalet.bathrooms ?? ""),
          discount: String(chalet.discount ?? ""),
          image: chalet.image ?? "",
          status: chalet.status ?? "available",
          amenities: {
            Kitchen: chalet.amenities?.Kitchen ?? false,
            Parking: chalet.amenities?.Parking ?? false,
            Pool: chalet.amenities?.Pool ?? false,
            WiFi: chalet.amenities?.WiFi ?? false,
          },
        });
      } catch {
        Alert.alert("خطأ", "فشل تحميل بيانات الشاليه");
        router.back();
      } finally {
        setLoading(false);
      }
    })();
  }, [chaletId, isEdit]);

  function setField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleAmenity(key: keyof FormData["amenities"]) {
    setForm((prev) => ({
      ...prev,
      amenities: { ...prev.amenities, [key]: !prev.amenities[key] },
    }));
  }

  async function handleSave() {
    if (
      !form.name.trim() ||
      !form.location.trim() ||
      !form.price ||
      !form.capacity
    ) {
      Alert.alert(
        "تنبيه",
        "يرجى تعبئة الحقول الإلزامية (الاسم، الموقع، السعر، السعة)",
      );
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
        image: form.image.trim() || "",
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
    } catch (e: any) {
      Alert.alert("خطأ", e?.message || "فشل الحفظ، حاول مجدداً");
    } finally {
      setSaving(false);
    }
  }

  return { form, loading, saving, isEdit, setField, toggleAmenity, handleSave };
}
