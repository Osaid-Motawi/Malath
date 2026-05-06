import NetInfo from '@react-native-community/netinfo';
import { router } from 'expo-router';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../../../FirebaseConfig';
import { Chalet } from '../../services/chaletService';
import AccordionItem from '../components/AccordionItem';
import { BathIcon, BedIcon, ChairIcon, FacilitiesIcon, HeartIcon, KitchenIcon, LocationIcon, ParkingIcon, PersonIcon, PoolIcon, StarIcon, WifiIcon } from '../components/CustomIcon';
import Description from '../components/Description';
import FeatureItem from '../components/FeatureItem';
import { datab } from '../Database/database';
interface Props {chaletId: string;}
export default function ChaletDetailsPage({ chaletId }: Props) {
  const [chalet, setChalet] = useState<Chalet | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('المواصفات');
  const [expanded, setExpanded] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const loadFromSQLite = async () => {const result = await datab.getAllAsync(
    'SELECT * FROM chalets WHERE id = ?',
    [chaletId]
  );
  if (result.length > 0) {
    setChalet(result[0] as Chalet);
  }
  setLoading(false);};
 useEffect(() => {
  const ref = doc(db, 'chalets', chaletId);

  const unsubscribe = onSnapshot(ref, async (snap) => {
    if (snap.exists()) {
      const data = { id: snap.id, ...snap.data() } as Chalet;

      setChalet(data);

      await datab.runAsync(
        `INSERT OR REPLACE INTO chalets 
         (id, name, location, price, description)
         VALUES (?, ?, ?, ?, ?)`,
        [ data.id,data.name || '',data.location || '',data.price || 0,data.description ?? ''] );}
    setLoading(false);});
  NetInfo.fetch().then(state => {
    if (!state.isConnected) {
      loadFromSQLite();}});
  return () => unsubscribe();
}, [chaletId]);
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#31202A" />
      </View>);}
  if (!chalet) {
    return (
      <View style={styles.loadingContainer}>
        <Text>الشاليه غير موجود</Text>
      </View>
    );}
 const photos = Array.from({ length: 8 }, (_, i) => {
  const key = `photo${String.fromCharCode(65 + i)}`; 
  return chalet.photo?.[key as keyof typeof chalet.photo];
}).filter((p): p is string => !!p && p.trim() !== '');
  const renderPhotoGrid = () => {
    const slots = Array.from({ length: 8 }, (_, i) => photos[i] ?? null);

    const renderSlot = (index: number) => (
      slots[index] ? (
        <Image key={index} source={{ uri: slots[index]! }} style={styles.gridSmall} resizeMode="cover" />) : (
        <View key={index} style={[styles.gridSmall, { backgroundColor: '#D9D9D9' }]} />));
    return (
      <View style={styles.photoWrapper}>
        <View style={styles.gridContainer}>
          <View style={styles.gridCol}>{renderSlot(0)}{renderSlot(1)}</View>
          <View style={styles.gridCol}>{renderSlot(2)}{renderSlot(3)}</View>
          <View style={styles.gridCol}>{renderSlot(4)}{renderSlot(5)}</View>
          <View style={styles.gridCol}>{renderSlot(6)}{renderSlot(7)}</View>
        </View>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>);};
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderPhotoGrid()}
      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{chalet.name}</Text>
          <View style={styles.nameActions}>
            <TouchableOpacity onPress={() => setFavorited(!favorited)}>
              <HeartIcon filled={favorited} />
            </TouchableOpacity>
            {(chalet.discount ?? 0) > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>خصم {chalet.discount}%</Text>
              </View>
            )}</View></View>
        <View style={styles.metaRow}>
          <View style={styles.ratingPill}>
            <StarIcon />
            <Text style={styles.ratingNum}>{chalet.rating ?? 0}</Text>
          </View>
          <View style={styles.locationPill}>
            <LocationIcon />
            <Text style={styles.locationText}>{chalet.location}</Text>
          </View>
        </View>
        <Description description={chalet.description} />
        <View style={styles.tabsRow}>
          {['المواصفات', 'المرافق', 'الشروط'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>))}
        </View>
        {activeTab === 'المواصفات' && (
          <View style={styles.specsContainer}>
            <FeatureItem icon={<BedIcon />} label="غرف" value={chalet.bedrooms} />
            <FeatureItem icon={<BathIcon />} label="حمامات" value={chalet.bathrooms} />
            <FeatureItem icon={<PersonIcon />} label="أشخاص" value={chalet.capacity} />
          </View>)}
        {activeTab === 'المرافق' && (
          <View style={styles.amenitiesContainer}>
            <AccordionItem title="الجلسات" icon={<ChairIcon />}>
            <FeatureItem icon={<WifiIcon />} label="WiFi" />
            <FeatureItem icon={<PoolIcon />} label="مسبح" />
            <FeatureItem icon={<ParkingIcon />} label="موقف سيارات" />
            </AccordionItem>

            <AccordionItem title="المرافق" icon={<FacilitiesIcon />}>
              {chalet.amenities?.WiFi && <FeatureItem icon={<WifiIcon />} label="WiFi" />}
              {chalet.amenities?.Pool && <FeatureItem icon={<PoolIcon />} label="مسبح" />}
              {chalet.amenities?.Parking && <FeatureItem icon={<ParkingIcon />} label="موقف سيارات" />}
            </AccordionItem>
            <AccordionItem title="المطبخ" icon={<KitchenIcon />}>
              {chalet.amenities?.Kitchen && <FeatureItem icon={<KitchenIcon />} label="مطبخ كامل" />}
            </AccordionItem>
          </View>)}
        {activeTab === 'الشروط' && (
          <View style={styles.conditionsContainer}>
            <View style={styles.conditionCard}>
              <Text style={styles.conditionText}>🚭 لا يسمح بالتدخين</Text>
            </View>
            <View style={styles.conditionCard}>
              <Text style={styles.conditionText}>🐾 لا يسمح بالحيوانات الأليفة</Text>
            </View>
            <View style={styles.conditionCard}>
              <Text style={styles.conditionText}>💳 الدفع مسبقاً</Text>
            </View>
          </View>)}
      </View>
      <View style={styles.bookingBar}>
        <View>
          <Text style={styles.bookingPrice}>₪{chalet.price}</Text>
          <Text style={styles.bookingNight}>لليلة الواحدة</Text>
        </View>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => router.push({
            pathname: '/booking',
            params: {
              chaletId: chalet.id,
              chaletName: chalet.name,
              chaletImage: chalet.image ?? '',
              chaletPrice: chalet.price,
              capacity: chalet.capacity,
            },})}>
          <Text style={styles.bookBtnText}>احجز الآن</Text>
        </TouchableOpacity>
        </View></ScrollView>);}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F7' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F7F7' },
  photoWrapper: { position: 'relative' },
  backBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: '#ffffffcc',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },backIcon: { fontSize: 20, color: '#1A1A2E' },
  gridContainer: { flexDirection: 'row', height: 260, gap: 3, overflow: 'hidden' },
  gridCol: { flex: 1, gap: 3, height: 260 },
  gridSmall: { flex: 1, width: '100%' },
  infoContainer: { padding: 16, paddingBottom: 110 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    flex: 1,
    lineHeight: 26,
  },nameActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  discountBadge: {
    backgroundColor: '#F69D58',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },ratingNum: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A2E',
  },locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },locationText: {
    fontSize: 12,
    color: '#6C6C6B',
  },tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },tab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 10,
  },tabActive: {
    backgroundColor: '#4F2396',
  },tabText: {
    fontSize: 13,
    color: '#969496',
  },tabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },specsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },specIconWrap: {
    width: 36,
    height: 36,
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },amenitiesContainer: { gap: 0 },
  conditionsContainer: { gap: 10 },
  conditionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },conditionText: {
    fontSize: 13,
    color: '#1A1A2E',
    lineHeight: 22,
  },bookingBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    paddingBottom: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },bookingPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A2E',
  },bookingNight: {
    fontSize: 11,
    color: '#6C6C6B',
    marginTop: 2,
  },bookBtn: {
    backgroundColor: '#4F2396',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 14,
  },bookBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',},});