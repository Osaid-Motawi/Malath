import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Notification } from "../../services/notificationService";
import { useNotifications } from "../../../../hooks/useNotifications";

const TYPE_ICON: Record<string, { name: any; color: string }> = {
  favorite: { name: "heart",  color: "#EF4444" },
  chalet_pending: { name: "time-outline", color: "#F59E0B" },
  chalet_approved:  { name: "checkmark-circle", color: "#16A34A" },
  chalet_rejected:  { name: "close-circle", color: "#DC2626" },
  booking_pending:  { name: "time-outline", color: "#F59E0B" },
  booking_approved: { name: "calendar", color: "#16A34A" },
  booking_rejected: { name: "calendar-outline", color: "#DC2626" },
};

function formatDate(ts: any): string {
  if (!ts?.toDate) return "";
  const d = ts.toDate();
  return d.toLocaleDateString("ar-EG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function NotificationPage() {
  const { notifications, loading, unreadCount, load, handleMarkAsRead, handleMarkAllAsRead } = useNotifications();

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  function renderItem({ item }: { item: Notification }) {
    const icon = TYPE_ICON[item.type] ?? { name: "notifications-outline", color: "#6B7280" };

    return (
      <TouchableOpacity
        style={[styles.card, !item.read_status && styles.cardUnread]}
        onPress={() => handleMarkAsRead(item.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconWrap, { backgroundColor: icon.color + "18" }]}>
          <Ionicons name={icon.name} size={22} color={icon.color} />
        </View>

        <View style={styles.cardBody}>
          <Text style={[styles.message, !item.read_status && styles.messageUnread]}>
            {item.message}
          </Text>
          <Text style={styles.date}>{formatDate(item.created_at)}</Text>
        </View>

        {!item.read_status && <View style={styles.dot} />}
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={handleMarkAllAsRead}>
            <Text style={styles.markAll}>قراءة الكل</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 70 }} />
        )}

        <View style={styles.titleWrap}>
          <Text style={styles.headerTitle}>الإشعارات</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#4F2396" />
      ) : notifications.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="notifications-off-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>ما في إشعارات</Text>
          <Text style={styles.emptySubtitle}>ما وصلك أي إشعار بعد</Text>
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
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 14, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  titleWrap: { flexDirection: "row", alignItems: "center", gap: 6 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  badge: { backgroundColor: "#4F2396", borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2 },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  markAll: { fontSize: 13, color: "#4F2396", fontWeight: "600" },
  list: { padding: 16, gap: 10 },
  card: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#fff", borderRadius: 14, padding: 14, elevation: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
  cardUnread: { backgroundColor: "#F5F0FF" },
  iconWrap: { width: 44, height: 44, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  cardBody: { flex: 1, gap: 4 },
  message: { fontSize: 13, color: "#374151", textAlign: "right", lineHeight: 20 },
  messageUnread: { fontWeight: "700", color: "#111827" },
  date: { fontSize: 11, color: "#9CA3AF", textAlign: "right" },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#4F2396" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
  emptyTitle: { fontSize: 17, fontWeight: "700", color: "#374151" },
  emptySubtitle: { fontSize: 13, color: "#9CA3AF" },
});