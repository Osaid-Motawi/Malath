import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from 'react';
import {
    Pressable, ScrollView, StyleSheet, Text, View
} from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StorageService from "../../services/StorageService";

export default function ProfilePage() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // تحديث الحالة عند فتح الصفحة
  useFocusEffect(
    useCallback(() => {
      const loadUserData = async () => {
        const userData = await StorageService.getUser();
        setUser(userData);
        setLoading(false);
      };
      loadUserData();
    }, [])
  );

  const performLogout = async () => {
    await StorageService.removeUser();
    await StorageService.removeToken();
    setUser(null);
    router.replace("/login" as any);
  };

  // دالة ذكية للانتقال تتأكد من المسار (تعديل بسيط ليناسب بنية التابات)
  const navigateTo = (path: string) => {
    try {
      // نستخدم navigate لأنها أفضل في التنقل بين التابات
      router.navigate(path as any);
    } catch (error) {
      console.error("Navigation Error:", error);
    }
  };

  if (loading) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الملف الشخصي</Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {!user ? (
          /* واجهة الضيف */
          <View style={styles.guestWrapper}>
            <View style={styles.guestIconCircle}>
              <Ionicons name="person-outline" size={60} color="#6A5ACD" />
            </View>
            <Text style={styles.guestTitle}>مرحباً بك في ملاذ</Text>
            <View style={styles.guestButtonGroup}>
              <Pressable style={styles.primaryBtn} onPress={() => navigateTo("/login")}>
                <Text style={styles.primaryBtnText}>تسجيل الدخول</Text>
              </Pressable>
              <Pressable style={styles.secondaryBtn} onPress={() => navigateTo("/register")}>
                <Text style={styles.secondaryBtnText}>إنشاء حساب جديد</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          /* واجهة المستخدم المسجل */
          <View style={{ padding: 20 }}>
            <View style={styles.userMainCard}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={45} color="#FFF" />
              </View>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>

            <View style={styles.optionsWrapper}>
              {/* خيار الحجوزات - تأكدي من الاسم في مجلد app */}
              <Pressable style={styles.menuItem} onPress={() => navigateTo("/mybooking")}>
                <Ionicons name="chevron-back" size={18} color="#CCC" />
                <View style={styles.menuTextRight}>
                  <Text style={styles.menuTitle}>حجوزاتي</Text>
                  <View style={[styles.iconBox, { backgroundColor: '#F0EEFF' }]}>
                    <Ionicons name="calendar-outline" size={22} color="#6A5ACD" />
                  </View>
                </View>
              </Pressable>

              <View style={styles.divider} />

              {/* خيار المفضلة - تأكدي من الاسم في مجلد app */}
              <Pressable style={styles.menuItem} onPress={() => navigateTo("/favorites")}>
                <Ionicons name="chevron-back" size={18} color="#CCC" />
                <View style={styles.menuTextRight}>
                  <Text style={styles.menuTitle}>المفضلة</Text>
                  <View style={[styles.iconBox, { backgroundColor: '#FFF0F5' }]}>
                    <Ionicons name="heart-outline" size={22} color="#FF69B4" />
                  </View>
                </View>
              </Pressable>

              <View style={styles.divider} />

              {/* تسجيل الخروج */}
              <Pressable style={styles.menuItem} onPress={performLogout}>
                <Ionicons name="chevron-back" size={18} color="#CCC" />
                <View style={styles.menuTextRight}>
                  <Text style={[styles.menuTitle, { color: '#FF3B30' }]}>تسجيل الخروج</Text>
                  <View style={[styles.iconBox, { backgroundColor: '#FFF0F0' }]}>
                    <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
                  </View>
                </View>
              </Pressable>
            </View>
          </View>
        )}
        <Text style={styles.brandText}>MALATH LUXURY CHALETS</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FE" },
  header: { height: 60, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  guestWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 80, paddingHorizontal: 30 },
  guestIconCircle: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#F0EEFF', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  guestTitle: { fontSize: 22, fontWeight: '800', marginBottom: 30 },
  guestButtonGroup: { width: '100%', gap: 15 },
  primaryBtn: { backgroundColor: '#6A5ACD', padding: 16, borderRadius: 15, alignItems: 'center' },
  primaryBtnText: { color: '#FFF', fontWeight: 'bold' },
  secondaryBtn: { borderWidth: 2, borderColor: '#6A5ACD', padding: 16, borderRadius: 15, alignItems: 'center' },
  secondaryBtnText: { color: '#6A5ACD', fontWeight: 'bold' },
  userMainCard: { alignItems: 'center', marginBottom: 30 },
  avatarCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#6A5ACD', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  userName: { fontSize: 24, fontWeight: '800', color: '#333' },
  userEmail: { fontSize: 14, color: '#888' },
  optionsWrapper: { backgroundColor: '#FFF', borderRadius: 20, padding: 10, elevation: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, paddingHorizontal: 10 },
  menuTextRight: { flexDirection: 'row', alignItems: 'center' },
  menuTitle: { fontSize: 16, fontWeight: '600', color: '#444', marginRight: 15 },
  iconBox: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  divider: { height: 1, backgroundColor: '#F5F5F5', marginHorizontal: 10 },
  brandText: { textAlign: 'center', color: '#DDD', fontSize: 10, fontWeight: '900', marginTop: 40, marginBottom: 20, letterSpacing: 2 }
});