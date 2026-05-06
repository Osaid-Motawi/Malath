import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../../FirebaseConfig';
import { router } from 'expo-router';
import { BedIcon, BathIcon, WifiIcon, KitchenIcon, ChairIcon, PersonIcon, PoolIcon, ParkingIcon, FacilitiesIcon, StarIcon, LocationIcon, HeartIcon } from '../components/CustomIcon';
import { Chalet } from '../../services/chaletService';

const SpecItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) => (
  <View style={styles.specItem}>
    <View style={styles.specIconWrap}>{icon}</View>
    <Text style={styles.specValue}>{value}</Text>
    <Text style={styles.specLabel}>{label}</Text>
  </View>
);

const AmenityItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <View style={styles.amenityChip}>
    {icon}
    <Text style={styles.amenityLabel}>{label}</Text>
  </View>
);

const AccordionItem = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity style={styles.accordionHeader} onPress={() => setOpen(!open)}>
        <View style={styles.accIconWrap}>{icon}</View>
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
  const [expanded, setExpanded] = useState(false);
  const [favorited, setFavorited] = useState(false);

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

  const photos = [
    chalet.photo?.photoA,
    chalet.photo?.photoB,
    chalet.photo?.photoC,
    chalet.photo?.photoD,
    chalet.photo?.photoE,
    chalet.photo?.photoF,
    chalet.photo?.photoG,
    chalet.photo?.photoH,
  ].filter((p): p is string => !!p && p.trim() !== '');

  const renderPhotoGrid = () => {
    // دايماً 8 خانات، الفاضية رمادية
    const slots = Array.from({ length: 8 }, (_, i) => photos[i] ?? null);

    const renderSlot = (index: number) => (
      slots[index] ? (
        <Image key={index} source={{ uri: slots[index]! }} style={styles.gridSmall} resizeMode="cover" />
      ) : (
        <View key={index} style={[styles.gridSmall, { backgroundColor: '#D9D9D9' }]} />
      )
    );

    return (
      <View style={styles.photoWrapper}>
        <View style={styles.gridContainer}>
          <View style={styles.gridCol}>{renderSlot(0)}{renderSlot(1)}</View>
          <View style={styles.gridCol}>{renderSlot(2)}{renderSlot(3)}</View>
          <View style={styles.gridCol}>{renderSlot(4)}{renderSlot(5)}</View>
          <View style={styles.gridCol}>{renderSlot(6)}{renderSlot(7)}</View>
        </View>

        {/* Back Button فوق الصور */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Photo Grid + Back Button */}
      {renderPhotoGrid()}

      <View style={styles.infoContainer}>

        {/* Name & Heart & Discount */}
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
            )}
          </View>
        </View>

        {/* Rating & Location */}
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

        {/* Description */}
        <View style={styles.descCard}>
          <Text style={styles.descTitle}>الوصف</Text>
          <Text style={styles.descText} numberOfLines={expanded ? undefined : 3}>
            {chalet.description}
          </Text>
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <Text style={styles.readMore}>{expanded ? '‹ أقل' : '... المزيد ›'}</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {['المواصفات', 'المرافق', 'الشروط'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Specs */}
        {activeTab === 'المواصفات' && (
          <View style={styles.specsContainer}>
            <SpecItem icon={<BedIcon />} label="غرف" value={chalet.bedrooms ?? 0} />
            <SpecItem icon={<BathIcon />} label="حمامات" value={chalet.bathrooms ?? 0} />
            <SpecItem icon={<PersonIcon />} label="أشخاص" value={chalet.capacity} />
          </View>
        )}

        {/* Amenities */}
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

        {/* Conditions */}
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
          </View>
        )}

      </View>

      {/* Booking Bar */}
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

  photoWrapper: { position: 'relative' },

  backBtn: {
    position: 'absolute', top: 16, right: 16, zIndex: 10,
    backgroundColor: '#ffffffcc', borderRadius: 20,
    width: 36, height: 36, justifyContent: 'center', alignItems: 'center',
  },
  backIcon: { fontSize: 20, color: '#18251D' },

  gridContainer: { flexDirection: 'row', height: 260, gap: 3, overflow: 'hidden' },
  gridCol: { flex: 1, gap: 3, height: 260 },
  gridSmall: { flex: 1, width: '100%' },
  gridFull: { width: '100%', height: 260 },

  infoContainer: { padding: 16, paddingBottom: 110 },

  nameRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 },
  name: { fontSize: 20, fontWeight: '700', color: '#18251D', flex: 1, lineHeight: 26 },
  nameActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  discountBadge: { backgroundColor: '#31202A', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  discountText: { color: '#F3F0E9', fontSize: 12, fontWeight: '600' },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  ratingPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 0.5, borderColor: 'rgba(24,37,29,0.1)',
  },
  ratingNum: { fontSize: 13, fontWeight: '700', color: '#18251D' },
  locationPill: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  locationText: { fontSize: 12, color: 'rgba(24,37,29,0.55)' },

  descCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginBottom: 16, borderWidth: 0.5, borderColor: 'rgba(24,37,29,0.07)',
  },
  descTitle: { fontSize: 15, fontWeight: '700', color: '#18251D', marginBottom: 8 },
  descText: { fontSize: 13, color: 'rgba(24,37,29,0.65)', lineHeight: 22, textAlign: 'right' },
  readMore: { fontSize: 12, color: '#31202A', fontWeight: '700', marginTop: 6 },

  tabsRow: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14,
    padding: 4, marginBottom: 16,
    borderWidth: 0.5, borderColor: 'rgba(24,37,29,0.07)',
  },
  tab: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: '#31202A' },
  tabText: { fontSize: 13, color: 'rgba(24,37,29,0.4)' },
  tabTextActive: { color: '#F3F0E9', fontWeight: '600' },

  specsContainer: { flexDirection: 'row', justifyContent: 'space-around', gap: 8 },
  specItem: {
    alignItems: 'center', backgroundColor: '#fff', borderRadius: 14,
    padding: 16, flex: 1, borderWidth: 0.5, borderColor: 'rgba(24,37,29,0.07)',
  },
  specIconWrap: {
    width: 36, height: 36, backgroundColor: '#F3F0E9',
    borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 6,
  },
  specValue: { fontSize: 18, fontWeight: '700', color: '#18251D', marginTop: 2 },
  specLabel: { fontSize: 11, color: 'rgba(24,37,29,0.45)', marginTop: 2 },

  amenitiesContainer: { gap: 0 },
  accordionItem: { borderBottomWidth: 0.5, borderBottomColor: 'rgba(24,37,29,0.1)' },
  accordionHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 10 },
  accIconWrap: {
    width: 34, height: 34, backgroundColor: '#F3F0E9',
    borderRadius: 10, justifyContent: 'center', alignItems: 'center',
  },
  accordionTitle: { flex: 1, fontSize: 14, fontWeight: '600', color: '#18251D', textAlign: 'right' },
  accordionArrow: { fontSize: 12, color: 'rgba(24,37,29,0.3)' },
  accordionBody: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingBottom: 14 },
  amenityChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#F3F0E9', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  amenityLabel: { fontSize: 12, color: '#18251D' },

  conditionsContainer: { gap: 10 },
  conditionCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    borderWidth: 0.5, borderColor: 'rgba(24,37,29,0.07)',
  },
  conditionText: { fontSize: 13, color: '#18251D', lineHeight: 22 },

  bookingBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', padding: 16, paddingBottom: 32,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: 0.5, borderTopColor: 'rgba(24,37,29,0.1)',
  },
  bookingPrice: { fontSize: 20, fontWeight: '800', color: '#18251D' },
  bookingNight: { fontSize: 11, color: 'rgba(24,37,29,0.45)', marginTop: 2 },
  bookBtn: { backgroundColor: '#31202A', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 14 },
  bookBtnText: { color: '#F3F0E9', fontSize: 15, fontWeight: '700' },
});