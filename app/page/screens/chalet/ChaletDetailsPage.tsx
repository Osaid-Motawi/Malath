import NetInfo from "@react-native-community/netinfo";
import { router } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { db } from "../../../../FirebaseConfig";

import { Chalet } from "../../services/chaletService";

import {
  BathIcon,
  BedIcon,
  HeartIcon,
  KitchenIcon,
  LocationIcon,
  ParkingIcon,
  PoolIcon,
  StarIcon,
  WifiIcon,
} from "../components/CustomIcon";

import Description from "../components/Description";
import FeatureItem from "../components/FeatureItem";

import { datab } from "../Database/database";

interface Props {
  chaletId: string;
}

export default function ChaletDetailsPage({
  chaletId,
}: Props) {

  const [chalet, setChalet] =
    useState<Chalet | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [activeTab, setActiveTab] =
    useState("المواصفات");

  const [favorited, setFavorited] =
    useState(false);

  const [selectedImage, setSelectedImage] =
    useState<string | null>(null);

  const [viewerVisible, setViewerVisible] =
    useState(false);

  const [currentImageIndex, setCurrentImageIndex] =
    useState(0);

  const loadFromSQLite = async () => {

    const result =
      await datab.getAllAsync(
        "SELECT * FROM chalets WHERE id = ?",
        [chaletId]
      );

    if (result.length > 0) {
      setChalet(result[0] as Chalet);
    }

    setLoading(false);
  };

  useEffect(() => {

    const ref = doc(db, "chalets", chaletId);

    const unsubscribe = onSnapshot(
      ref,
      async (snap) => {

        if (snap.exists()) {

          const data = {
            id: snap.id,
            ...snap.data(),
          } as Chalet;

          setChalet(data);

          await datab.runAsync(
            `INSERT OR REPLACE INTO chalets
            (id, name, location, price, description)
            VALUES (?, ?, ?, ?, ?)`,
            [
              data.id,
              data.name || "",
              data.location || "",
              data.price || 0,
              data.description ?? "",
            ]
          );
        }

        setLoading(false);
      }
    );

    NetInfo.fetch().then((state) => {

      if (!state.isConnected) {
        loadFromSQLite();
      }

    });

    return () => unsubscribe();

  }, [chaletId]);

  if (loading) {

    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#6A0DAD"
        />
      </View>
    );
  }

  if (!chalet) {

    return (
      <View style={styles.loadingContainer}>
        <Text>
          الشاليه غير موجود
        </Text>
      </View>
    );
  }

  const photos = Array.from(
    { length: 8 },
    (_, i) => {

      const key =
        `photo${String.fromCharCode(65 + i)}`;

      return chalet.photo?.[
        key as keyof typeof chalet.photo
      ];
    }
  ).filter(
    (p): p is string =>
      !!p && p.trim() !== ""
  );

  const openImage = (index: number) => {

    setCurrentImageIndex(index);

    setSelectedImage(photos[index]);

    setViewerVisible(true);
  };

  const goNextImage = () => {

    if (
      currentImageIndex <
      photos.length - 1
    ) {

      const nextIndex =
        currentImageIndex + 1;

      setCurrentImageIndex(nextIndex);

      setSelectedImage(
        photos[nextIndex]
      );
    }
  };

  const goPreviousImage = () => {

    if (currentImageIndex > 0) {

      const previousIndex =
        currentImageIndex - 1;

      setCurrentImageIndex(
        previousIndex
      );

      setSelectedImage(
        photos[previousIndex]
      );
    }
  };

  const renderPhotoGrid = () => {

    const slots = Array.from(
      { length: 8 },
      (_, i) => photos[i] ?? null
    );

    const renderSlot = (
      index: number
    ) =>
      slots[index] ? (
        <TouchableOpacity
          key={index}
          activeOpacity={0.9}
          style={styles.gridTouch}
          onPress={() =>
            openImage(index)
          }
        >
          <Image
            source={{
              uri: slots[index]!,
            }}
            style={styles.gridSmall}
            resizeMode="cover"
          />
        </TouchableOpacity>
      ) : (
        <View
          key={index}
          style={[
            styles.gridSmall,
            {
              backgroundColor:
                "#D9D9D9",
            },
          ]}
        />
      );

    return (
      <View style={styles.photoWrapper}>
        <View style={styles.gridContainer}>
          <View style={styles.gridCol}>
            {renderSlot(0)}
            {renderSlot(1)}
          </View>

          <View style={styles.gridCol}>
            {renderSlot(2)}
            {renderSlot(3)}
          </View>

          <View style={styles.gridCol}>
            {renderSlot(4)}
            {renderSlot(5)}
          </View>

          <View style={styles.gridCol}>
            {renderSlot(6)}
            {renderSlot(7)}
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <View style={styles.header}>

        <TouchableOpacity
          style={styles.headerBack}
          onPress={() => router.back()}
        >
          <Text style={styles.headerBackArrow}>
            ←
          </Text>
        </TouchableOpacity>

      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 95,
        }}
      >

        {renderPhotoGrid()}

        <View style={styles.infoContainer}>

          <View style={styles.nameRow}>

            <Text style={styles.name}>
              {chalet.name}
            </Text>

            <View style={styles.nameActions}>

              <TouchableOpacity
                onPress={() =>
                  setFavorited(!favorited)
                }
              >
                <HeartIcon
                  filled={favorited}
                />
              </TouchableOpacity>

              {(chalet.discount ?? 0) > 0 && (
                <View
                  style={styles.discountBadge}
                >
                  <Text
                    style={styles.discountText}
                  >
                    خصم {chalet.discount}%
                  </Text>
                </View>
              )}

            </View>

          </View>

          <View style={styles.metaRow}>

            <View style={styles.ratingPill}>
              <StarIcon />

              <Text style={styles.ratingNum}>
                {chalet.rating ?? 0}
              </Text>
            </View>

            <View style={styles.locationPill}>
              <LocationIcon />

              <Text style={styles.locationText}>
                {chalet.location}
              </Text>
            </View>

          </View>

          <Description
            description={chalet.description}
          />

          <View style={styles.tabsRow}>

            {[
              "المواصفات",
              "المرافق",
              "الشروط",
            ].map((tab) => (

              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  activeTab === tab &&
                    styles.tabActive,
                ]}
                onPress={() =>
                  setActiveTab(tab)
                }
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab &&
                      styles.tabTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>

            ))}

          </View>

          {activeTab === "المواصفات" && (

            <View style={styles.specsContainer}>

              <FeatureItem
                icon={<BedIcon />}
                label="غرف"
                value={chalet.bedrooms}
              />

              <FeatureItem
                icon={<BathIcon />}
                label="حمامات"
                value={chalet.bathrooms}
              />

            </View>

          )}

          {activeTab === "المرافق" && (

            <View
              style={styles.amenitiesContainer}
            >

              {chalet.amenities?.Kitchen && (
                <FeatureItem
                  icon={<KitchenIcon />}
                  label="مطبخ"
                />
              )}

              {chalet.amenities?.Pool && (
                <FeatureItem
                  icon={<PoolIcon />}
                  label="مسبح"
                />
              )}

              {chalet.amenities?.WiFi && (
                <FeatureItem
                  icon={<WifiIcon />}
                  label="إنترنت"
                />
              )}

              {chalet.amenities?.Parking && (
                <FeatureItem
                  icon={<ParkingIcon />}
                  label="كراج"
                />
              )}

            </View>

          )}

          {activeTab === "الشروط" && (

            <View
              style={styles.conditionsContainer}
            >

              <View
                style={styles.conditionCard}
              >
                <Text
                  style={styles.conditionText}
                >
                  يرجى العلم بأنه يوجد
                  تأمين بقيمة 100₪ يتم
                  دفعه عند الوصول،
                  ويُسترجع عند المغادرة
                  بعد التأكد من سلامة
                  الممتلكات والالتزام
                  بوقت الخروج المحدد،
                  بالإضافة إلى الالتزام
                  بأي شروط أخرى يحددها
                  صاحب الشاليه.
                </Text>
              </View>

              <View
                style={styles.conditionCard}
              >
                <Text
                  style={styles.conditionText}
                >
                  • عدم إتلاف الممتلكات
                </Text>
              </View>

              <View
                style={styles.conditionCard}
              >
                <Text
                  style={styles.conditionText}
                >
                  • الخروج في الوقت المحدد
                </Text>
              </View>

              <View
                style={styles.conditionCard}
              >
                <Text
                  style={styles.conditionText}
                >
                  تسعدنا زيارتك،
                  والمكان مكانك بأي وقت 💜
                </Text>
              </View>

            </View>

          )}

        </View>

        <View style={styles.bookingBar}>

          <View>

            <Text style={styles.bookingPrice}>
              ₪{chalet.price}
            </Text>

            <Text style={styles.bookingNight}>
              لليلة الواحدة
            </Text>

          </View>

          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() =>
              router.push({
                pathname: "/booking",
                params: {
                  chaletId: chalet.id,
                  chaletName: chalet.name,
                  chaletImage:
                    chalet.image ?? "",
                  chaletPrice:
                    chalet.price,
                  capacity:
                    chalet.capacity,
                },
              })
            }
          >
            <Text style={styles.bookBtnText}>
              احجز الآن
            </Text>
          </TouchableOpacity>

        </View>

      </ScrollView>

      <Modal
        visible={viewerVisible}
        transparent
        animationType="fade"
      >

        <View style={styles.viewerContainer}>

          <TouchableOpacity
            style={styles.closeViewer}
            onPress={() =>
              setViewerVisible(false)
            }
          >
            <Text
              style={styles.closeViewerText}
            >
              ✕
            </Text>
          </TouchableOpacity>

          {selectedImage && (

            <Image
              source={{
                uri: selectedImage,
              }}
              style={styles.viewerImage}
              resizeMode="contain"
            />

          )}

          <View
            style={styles.viewerBottomControls}
          >

            <TouchableOpacity
              style={styles.viewerArrowButton}
              onPress={goPreviousImage}
            >
              <Text
                style={styles.viewerArrowText}
              >
                ←
              </Text>
            </TouchableOpacity>

            <Text style={styles.imageCounter}>
              {currentImageIndex + 1} /
              {photos.length}
            </Text>

            <TouchableOpacity
              style={styles.viewerArrowButton}
              onPress={goNextImage}
            >
              <Text
                style={styles.viewerArrowText}
              >
                →
              </Text>
            </TouchableOpacity>

          </View>

        </View>

      </Modal>
    </>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
  },

  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    height: 95,
    backgroundColor: "#FFFFFF",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingHorizontal: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  headerBack: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F4ECFF",
    justifyContent: "center",
    alignItems: "center",
  },

  headerBackArrow: {
    fontSize: 26,
    color: "#6A0DAD",
    fontWeight: "900",
  },

  photoWrapper: {
    position: "relative",
  },

  gridContainer: {
    flexDirection: "row",
    height: 260,
    gap: 3,
    overflow: "hidden",
  },

  gridCol: {
    flex: 1,
    gap: 3,
    height: 260,
  },

  gridTouch: {
    flex: 1,
  },

  gridSmall: {
    flex: 1,
    width: "100%",
  },

  infoContainer: {
    padding: 16,
    paddingBottom: 110,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A2E",
    flex: 1,
    lineHeight: 26,
  },

  nameActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  discountBadge: {
    backgroundColor: "#6A0DAD",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },

  discountText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },

  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  ratingNum: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A2E",
  },

  locationPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  locationText: {
    fontSize: 12,
    color: "#6C6C6B",
  },

  tabsRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  tab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    borderRadius: 10,
  },

  tabActive: {
    backgroundColor: "#6A0DAD",
  },

  tabText: {
    fontSize: 13,
    color: "#969496",
  },

  tabTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  specsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 8,
  },

  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },

  conditionsContainer: {
    gap: 10,
  },

  conditionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  conditionText: {
    fontSize: 14,
    color: "#1A1A2E",
    lineHeight: 24,
    textAlign: "right",
    fontWeight: "600",
  },

  bookingBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    padding: 16,
    paddingBottom: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },

  bookingPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1A1A2E",
  },

  bookingNight: {
    fontSize: 11,
    color: "#6C6C6B",
    marginTop: 2,
  },

  bookBtn: {
    backgroundColor: "#6A0DAD",
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 14,
  },

  bookBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  viewerContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },

  viewerImage: {
    width: "100%",
    height: "78%",
  },

  closeViewer: {
    position: "absolute",
    top: 60,
    left: 25,
    zIndex: 10,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  closeViewerText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },

  viewerBottomControls: {
    position: "absolute",
    bottom: 45,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
  },

  viewerArrowButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F4ECFF",
    justifyContent: "center",
    alignItems: "center",
  },

  viewerArrowText: {
    fontSize: 26,
    color: "#6A0DAD",
    fontWeight: "900",
  },

  imageCounter: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

});