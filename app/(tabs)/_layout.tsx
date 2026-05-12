import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { HapticTab } from "@/components/haptic-tab";
import { useNotifications } from "../../hooks/useNotifications";

import {
  BellIcon,
  HelpIcon,
  HomeIcon,
  ListingIcon,
  MyListingIcon,
  ProfileIcon,
} from "../page/screens/components/CustomIcon";

import { initDB } from "../page/screens/Database/database";

export default function TabLayout() {
  const activeColor = "#6A0DAD";
  const inactiveColor = "#9CA3AF";

  const { unreadCount, load } = useNotifications();

  useEffect(() => {
    initDB();
    load();

    const timer = setInterval(() => {
      load();
    }, 2000);

    return () => clearInterval(timer);
  }, [load]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: inactiveColor,
          tabBarStyle: {
            height: 70,
            paddingTop: 6 ,
            paddingBottom: 12,
            backgroundColor: "#FFFFFF",
            borderTopWidth: 1,
            borderTopColor: "#F3F4F6",
          },
          tabBarLabelStyle: {
            fontSize: 8,
            fontWeight: "700",
          },
        }}
      >
        {/* 1. الرئيسية */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <HomeIcon size={24} color={focused ? activeColor : inactiveColor} />
            ),
          }}
        />

        {/* 2. الشاليهات (قائمة الكل) */}
        <Tabs.Screen
          name="listing"
          options={{
            title: "الشاليهات",
            tabBarIcon: ({ focused }) => (
              <ListingIcon size={24} color={focused ? activeColor : inactiveColor} />
            ),
          }}
        />

        {/* 3. شاليهاتي (رجعتلك ياها هون) */}
        <Tabs.Screen
          name="mylisting"
          options={{
            title: "شاليهاتي",
            tabBarIcon: ({ focused }) => (
              <MyListingIcon size={24} color={focused ? activeColor : inactiveColor} />
            ),
          }}
        />

        {/* 4. الإشعارات */}
        <Tabs.Screen
          name="not"
          options={{
            title: "الإشعارات",
            tabBarIcon: ({ focused }) => (
              <View>
                <BellIcon size={24} color={focused ? activeColor : inactiveColor} />
                {unreadCount > 0 && (
                  <View style={{
                    position: "absolute",
                    top: -5,
                    right: -8,
                    minWidth: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: "#EF4444",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                    <Text style={{ color: "#FFFFFF", fontSize: 9, fontWeight: "900" }}>
                      {unreadCount}
                    </Text>
                  </View>
                )}
              </View>
            ),
          }}
        />

        {/* 5. المساعدة */}
        <Tabs.Screen
          name="help"
          options={{
            title: "المساعدة",
            tabBarIcon: ({ focused }) => (
              <HelpIcon size={24} color={focused ? activeColor : inactiveColor} />
            ),
          }}
        />

        {/* 6. الملف الشخصي */}
        <Tabs.Screen
          name="profile"
          options={{
            title: "الملف الشخصي",
            tabBarIcon: ({ focused }) => (
              <ProfileIcon size={24} color={focused ? activeColor : inactiveColor} />
            ),
          }}
        />

        {/* الصفحات المخفية (نوصلها بالكود بس) */}
        <Tabs.Screen name="login" options={{ href: null }} />
        <Tabs.Screen name="register" options={{ href: null }} />
        <Tabs.Screen name="booking" options={{ href: null }} />
        <Tabs.Screen name="favorites" options={{ href: null }} />
        <Tabs.Screen name="modal" options={{ href: null }} />
        <Tabs.Screen name="editprofile" options={{ href: null }} />
        <Tabs.Screen name="mybooking" options={{ href: null }} />
        <Tabs.Screen name="ownerdashboard" options={{ href: null }} />
        <Tabs.Screen name="chalet-details" options={{ href: null }} />
        <Tabs.Screen name="add-edit-chalet" options={{ href: null }} />
      </Tabs>
    </GestureHandlerRootView>
  );
}