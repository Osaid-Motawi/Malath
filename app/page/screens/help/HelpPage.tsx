import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AddChaletIcon, BackIcon, BookingStepsIcon, DeerIcon } from "../components/CustomIcon";
import MalathChat from "../components/MalathChat";
export default function HelpPage() {
  const [showChat, setShowChat] = useState(false);

  if (showChat) {
    return (
      <View style={styles.chatPage}>
        <View style={styles.chatHeader}>
          <Pressable onPress={() => setShowChat(false)} style={styles.backButton}>
            <BackIcon size={24} color="#6A0DAD" />
            <Text style={styles.backText}>رجوع</Text>
          </Pressable>
        </View>

        <MalathChat />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.assistantLabel}>ملاذ المساعد الذكي</Text>
      </View>

      <View style={styles.iconWrapper}>
        <Pressable onPress={() => setShowChat(true)} style={({ pressed }) => [styles.iconCircle, { transform: [{ scale: pressed ? 0.96 : 1 }] }]}>
          <DeerIcon size={110} />

          <View style={styles.chatBadge}>
            <Text style={styles.chatBadgeText}>اضغط لبدء الدردشة</Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.stepsSection}>
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <Text style={styles.stepTitle}>١/ خطوات حجز شاليه</Text>

            <View style={styles.iconContainer}>
              <BookingStepsIcon size={20} />
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.stepDescription}>
            • اختر الشاليه وتأكد من مواصفاته.{"\n"}
            • اضغط "احجز الآن" بجانب السعر.{"\n"}
            • حدد تواريخ الدخول والخروج.{"\n"}
            • اختر عدد الضيوف وأضف ملاحظاتك.{"\n"}
            • اضغط متابعة لمراجعة الحجز.
          </Text>
        </View>

        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <Text style={styles.stepTitle}>٢/ خطوات إضافة شاليه</Text>

            <View style={styles.iconContainer}>
              <AddChaletIcon size={22} />
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.stepDescription}>
            • من حسابك الشخصي اختر إضافة شاليه جديد.{"\n"}
            • ارفع صور واضحة واكتب وصف مناسب.{"\n"}
            • حدد السعر والموقع ثم اضغط نشر الإعلان.
          </Text>
        </View>
      </View>

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { alignItems: "center", paddingTop: 50, paddingBottom: 20 },
  headerTitleContainer: { alignItems: "center", marginBottom: 25 },
  assistantLabel: { fontSize: 23, fontWeight: "900", color: "#6A0DAD" },
  iconWrapper: { marginBottom: 45, alignItems: "center" },
  iconCircle: { width: 155, height: 155, borderRadius: 80, justifyContent: "center", alignItems: "center", backgroundColor: "#F4ECFF", borderWidth: 1.5, borderColor: "#6A0DAD" },
  chatBadge: { position: "absolute", bottom: -14, backgroundColor: "#6A0DAD", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  chatBadgeText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  stepsSection: { width: "100%", paddingHorizontal: 22 },
  stepCard: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1.5, borderColor: "#E6D7FF" },
  stepHeader: { flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 10 },
  stepTitle: { fontSize: 16, fontWeight: "800", color: "#6A0DAD" },
  divider: { height: 1, backgroundColor: "#E6D7FF", marginVertical: 10 },
  stepDescription: { fontSize: 14, color: "#333333", textAlign: "right", lineHeight: 22 },
  iconContainer: { width: 34, height: 34, borderRadius: 17, backgroundColor: "#F4ECFF", justifyContent: "center", alignItems: "center" },
  bottomSpace: { height: 35 },
  chatPage: { flex: 1, backgroundColor: "#FFFFFF" },
  chatHeader: { paddingTop: Platform.OS === "ios" ? 55 : 28, paddingBottom: 12, backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#E6D7FF" },
  backButton: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 18, gap: 8 },
  backText: { color: "#6A0DAD", fontWeight: "800", fontSize: 17 },
});