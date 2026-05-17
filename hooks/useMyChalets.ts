import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { Chalet, deleteChalet, getMyChalets } from "../app/page/services/chaletService";

export function useMyChalets() {
  const [chalets, setChalets] = useState<Chalet[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setChalets(await getMyChalets());
    } catch {
      Alert.alert("خطأ", "فشل تحميل الشاليهات");
    } finally {
      setLoading(false);
    }
  }, []);

  function handleAdd() {
    router.push("/add-edit-chalet" as any);
  }

  function handleEdit(chalet: Chalet) {
    router.push({ pathname: "/add-edit-chalet" as any, params: { chaletId: chalet.id } });
  }

function handleDelete(chalet: Chalet) {
  if (typeof window !== "undefined" && window.confirm) {
    const confirmed = window.confirm(`هل أنت متأكد أنك تريد حذف "${chalet.name}"؟`);
    if (!confirmed) return;
    deleteChalet(chalet.id)
      .then(() => setChalets((prev) => prev.filter((c) => c.id !== chalet.id)))
      .catch((e) => Alert.alert("خطأ", e?.message || "فشل حذف الشاليه"));
    return;
  }

  Alert.alert(
    "حذف الشاليه",
    `هل أنت متأكد أنك تريد حذف "${chalet.name}"؟\nلا يمكن التراجع عن هذا الإجراء.`,
    [
      { text: "إلغاء", style: "cancel" },
      {
        text: "حذف",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteChalet(chalet.id);
            setChalets((prev) => prev.filter((c) => c.id !== chalet.id));
          } catch (e: any) {
            Alert.alert("خطأ", e?.message || "فشل حذف الشاليه");
          }
        },
      },
    ]
  );
}

  return { chalets, loading, load, handleAdd, handleEdit, handleDelete };
}