import { router, useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useNotifications } from "../../../../hooks/useNotifications";
import { Notification } from "../../services/notificationService";

import {
  CalendarIcon,
  CheckCircleIcon,
  NotificationIcon,
  TimeIcon,
  XCircleIcon,
} from "../components/CustomIcon";

const PURPLE = "#6A0DAD";

function formatDate(ts: any): string {
  if (!ts?.toDate) return "";

  const d = ts.toDate();

  return d.toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getNotificationIcon(type: string) {
  if (type === "chalet_pending") return <TimeIcon color="#F59E0B" />;
  if (type === "chalet_approved") return <CheckCircleIcon color="#16A34A" />;
  if (type === "chalet_rejected") return <XCircleIcon color="#DC2626" />;
  if (type === "booking_pending") return <TimeIcon color="#F59E0B" />;
  if (type === "booking_approved") return <CalendarIcon color="#16A34A" />;
  if (type === "booking_rejected") return <CalendarIcon color="#DC2626" />;
  return <NotificationIcon color="#6B7280" />;
}

function getNotificationBg(type: string) {
  if (type === "chalet_pending" || type === "booking_pending") return "#FEF3C7";
  if (type === "chalet_approved" || type === "booking_approved") return "#DCFCE7";
  if (type === "chalet_rejected" || type === "booking_rejected") return "#FEE2E2";
  return "#E5E7EB";
}

export default function NotificationPage() {
  const {
    notifications,
    loading,
    load,
    handleMarkAsRead,
    handleMarkAllAsRead,
  } = useNotifications();

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const renderItem = ({ item }: { item: Notification }) => {
    const unread = item.read_status !== true;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleMarkAsRead(item.id)}
        style={[styles.card, unread && styles.unreadCard]}
      >
        <View style={[styles.iconBox, { backgroundColor: getNotificationBg(item.type) }]}>
          {getNotificationIcon(item.type)}
        </View>

        <View style={styles.content}>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.date}>{formatDate(item.created_at)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/")}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>الإشعارات</Text>
      </View>

      <View style={styles.readAllContainer}>
        <TouchableOpacity style={styles.readAllButton} onPress={handleMarkAllAsRead}>
          <Text style={styles.readAllText}>قراءة الكل</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={PURPLE} style={{ marginTop: 50 }} />
      ) : notifications.length === 0 ? (
        <View style={styles.empty}>
          <NotificationIcon color="#9CA3AF" />
          <Text style={styles.emptyText}>لا توجد إشعارات</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 10, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
  backButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#F4ECFF", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#E6D7FF" },
  backArrow: { fontSize: 24, fontWeight: "900", color: PURPLE },
  headerTitle: { fontSize: 30, fontWeight: "900", color: PURPLE },
  readAllContainer: { alignItems: "center", marginTop: 18, marginBottom: 18 },
  readAllButton: { borderWidth: 2, borderColor: PURPLE, borderRadius: 14, paddingHorizontal: 18, paddingVertical: 6, backgroundColor: "#FFFFFF" },
  readAllText: { fontSize: 16, fontWeight: "900", color: PURPLE },
  list: { paddingHorizontal: 16, paddingBottom: 30 },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 24, padding: 18, marginBottom: 16 },
  unreadCard: { backgroundColor: "#F3F4F6", borderWidth: 1, borderColor: "#E9D5FF" },
  iconBox: { width: 56, height: 56, borderRadius: 18, justifyContent: "center", alignItems: "center" },
  content: { flex: 1, marginRight: 14 },
  message: { fontSize: 15, fontWeight: "800", color: "#1F2937", textAlign: "right", lineHeight: 26 },
  date: { marginTop: 8, fontSize: 13, fontWeight: "600", color: "#9CA3AF", textAlign: "right" },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { marginTop: 10, fontSize: 18, fontWeight: "700", color: "#9CA3AF" },
});