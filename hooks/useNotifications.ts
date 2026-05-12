import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { Notification, getMyNotifications, markAllAsRead, markAsRead } from "../app/page/services/notificationService";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMyNotifications();
      setNotifications(data);
    } catch {
      Alert.alert("خطأ", "فشل تحميل الإشعارات");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read_status: true } : n
      )
    );
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();

    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read_status: true }))
    );
  };

  const unreadCount = notifications.filter(
    (n) => n.read_status === false
  ).length;

  return {
    notifications,
    loading,
    unreadCount,
    load,
    handleMarkAsRead,
    handleMarkAllAsRead,
  };
}