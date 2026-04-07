import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../../FirebaseConfig';
import { router } from 'expo-router';
import {
  BedIcon, BathIcon, WifiIcon, KitchenIcon, ChairIcon, PersonIcon,PoolIcon, ParkingIcon,FacilitiesIcon,StarIcon,LocationIcon,
} from '../components/CustomIcon';
import { Chalet } from '../../services/chaletService';

const SpecItem = ({ icon, label, value }: {
  icon: React.ReactNode; label: string; value: number;
}) => (
  <View style={styles.specItem}>
    {icon}
    <Text style={styles.specValue}>{value}</Text>
    <Text style={styles.specLabel}>{label}</Text>
  </View>
);

const AmenityItem = ({ icon, label }: {
  icon: React.ReactNode; label: string;
}) => (
  <View style={styles.amenityItem}>
    {icon}
    <Text style={styles.amenityLabel}>{label}</Text>
  </View>
);

const AccordionItem = ({ title, icon, children }: {
  title: string; icon: React.ReactNode; children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity style={styles.accordionHeader} onPress={() => setOpen(!open)}>
        {icon}
        <Text style={styles.accordionTitle}>{title}</Text>
        <Text style={styles.accordionArrow}>{open ? '∧' : '∨'}</Text>
      </TouchableOpacity>
      {open && <View style={styles.accordionBody}>{children}</View>}
    </View>
  );
};

interface Props {
  chaletId: string;
}

export default function ChaletDetailsPage({ chaletId }: Props) {
  const [chalet, setChalet] = useState<Chalet | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('المواصفات');

  useEffect(() => {
    const ref = doc(db, 'chalets', chaletId);
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setChalet({ id: snap.id, ...snap.data() } as Chalet);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [chaletId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#31202A" />
      </View>
    );
  }

  if (!chalet) {
    return (
      <View style={styles.loadingContainer}>
        <Text>الشاليه غير موجود</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* زر الرجوع */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      {/* الصورة الرئيسية */}
      <Image
        source={{ uri: chalet.image }}
        style={styles.heroImage}
        resizeMode="cover"
      />

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{chalet.name}</Text>

        <View style={styles.ratingRow}>
          <Text style={styles.rating}>{<StarIcon />} {chalet.rating ?? 0}</Text>
          {(chalet.discount ?? 0) > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>خصم {chalet.discount}%</Text>
            </View>
          )}
        </View>

        <Text style={styles.location}>{<LocationIcon />} {chalet.location}</Text>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {['المواصفات', 'المرافق', 'الشروط'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* المواصفات */}
        {activeTab === 'المواصفات' && (
          <View style={styles.specsContainer}>
            <SpecItem icon={<BedIcon />} label="غرف" value={chalet.bedrooms ?? 0} />
            <SpecItem icon={<BathIcon />} label="حمامات" value={chalet.bathrooms ?? 0} />
            <SpecItem icon={<PersonIcon />} label="أشخاص" value={chalet.capacity} />
          </View>
        )}

        {/* المرافق */}
        {activeTab === 'المرافق' && (
          <View style={styles.amenitiesContainer}>
            <AccordionItem title="الجلسات" icon={<ChairIcon />}>
              <AmenityItem icon={<ChairIcon />} label="صالة جلوس مجهزة" />
            </AccordionItem>
            <AccordionItem title="المرافق" icon={<FacilitiesIcon />}>
              {chalet.amenities?.WiFi && <AmenityItem icon={<WifiIcon />} label="WiFi" />}
              {chalet.amenities?.Pool && <AmenityItem icon={<PoolIcon />} label="مسبح" />}
              {chalet.amenities?.Parking && <AmenityItem icon={<ParkingIcon />} label="موقف سيارات" />}
            </AccordionItem>
            <AccordionItem title="المطبخ" icon={<KitchenIcon />}>
              {chalet.amenities?.Kitchen && <AmenityItem icon={<KitchenIcon />} label="مطبخ كامل" />}
            </AccordionItem>
          </View>
        )}

        {/* الشروط */}
        {activeTab === 'الشروط' && (
          <View style={styles.conditionsContainer}>
            <Text style={styles.conditionText}>• لا يسمح بالتدخين</Text>
            <Text style={styles.conditionText}>• لا يسمح بالحيوانات الأليفة</Text>
            <Text style={styles.conditionText}>• الدفع مسبقاً</Text>
          </View>
        )}
      </View>

      {/* شريط الحجز */}
      <View style={styles.bookingBar}>
        <View>
          <Text style={styles.bookingPrice}>₪{chalet.price}</Text>
          <Text style={styles.bookingNight}>لليلة الواحدة</Text>
        </View>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => router.push({
            pathname: '/Bookingpage',
            params: {
              chaletId: chalet.id,
              chaletName: chalet.name,
              chaletImage: chalet.image ?? '',
              chaletPrice: chalet.price,
              capacity: chalet.capacity,
            },
          })}
        >
          <Text style={styles.bookBtnText}>احجز الآن</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F0E9' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F0E9' },
  backBtn: { position: 'absolute', top: 50, left: 16, zIndex: 10,
    backgroundColor: '#ffffffcc', borderRadius: 20, width: 36, height: 36,
    justifyContent: 'center', alignItems: 'center' },
  backIcon: { fontSize: 20, color: '#18251D' },
  heroImage: { width: '100%', height: 280 },
  infoContainer: { padding: 16, paddingBottom: 100 },
  name: { fontSize: 20, fontWeight: '700', color: '#18251D', marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  rating: { fontSize: 14, color: '#18251D' },
  discountBadge: { backgroundColor: '#31202A', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  discountText: { color: '#F3F0E9', fontSize: 12, fontWeight: '600' },
  location: { fontSize: 14, color: '#18251D', opacity: 0.6, marginBottom: 20 },
  tabsRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#18251D', marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#31202A' },
  tabText: { fontSize: 14, color: '#18251D', opacity: 0.5 },
  tabTextActive: { color: '#31202A', fontWeight: '600', opacity: 1 },
  specsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  specItem: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 16, flex: 1, marginHorizontal: 4 },
  specValue: { fontSize: 18, fontWeight: '700', color: '#18251D', marginTop: 6 },
  specLabel: { fontSize: 12, color: '#18251D', opacity: 0.5 },
  amenitiesContainer: { gap: 0 },
  amenityItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  amenityLabel: { fontSize: 13, color: '#18251D' },
  accordionItem: { borderBottomWidth: 0.5, borderBottomColor: 'rgba(24,37,29,0.15)' },
  accordionHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 10 },
  accordionTitle: { flex: 1, fontSize: 14, fontWeight: '600', color: '#18251D', textAlign: 'right' },
  accordionArrow: { fontSize: 12, color: 'rgba(24,37,29,0.4)' },
  accordionBody: { paddingBottom: 12, paddingRight: 8 },
  conditionsContainer: { gap: 10 },
  conditionText: { fontSize: 14, color: '#18251D', lineHeight: 24 },
  bookingBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff',
    padding: 16, paddingBottom: 28, flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', borderTopWidth: 0.5, borderTopColor: '#18251D' },
  bookingPrice: { fontSize: 18, fontWeight: '700', color: '#18251D' },
  bookingNight: { fontSize: 12, color: '#18251D', opacity: 0.5 },
  bookBtn: { backgroundColor: '#31202A', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  bookBtnText: { color: '#F3F0E9', fontSize: 15, fontWeight: '600' },
});