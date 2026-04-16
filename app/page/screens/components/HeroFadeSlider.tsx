import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');
const WHITE_IMAGE = "https://ui-avatars.com/api/?background=ffffff&color=ffffff&size=512";

interface Slide { 
  id: string; 
  image?: string;
  photo?: { photoA?: string };
  name: string; 
  location?: string;
}

export default function HeroFadeSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const randomizedSlides = useMemo(() => {
    if (!slides?.length) return [];
    return [...slides]
      .sort(() => Math.random() - 0.5)
      .map(item => ({ ...item, displayImage: item.image || item.photo?.photoA || WHITE_IMAGE }));
  }, [slides]);

  useEffect(() => { setIndex(0); }, [randomizedSlides]);

  useEffect(() => {
    if (randomizedSlides.length <= 1) return;

    const fade = (toValue: number, cb?: () => void) =>
      Animated.timing(fadeAnim, { toValue, duration: 800, useNativeDriver: true }).start(cb);

    const timer = setInterval(() => {
      fade(0.4, () => {
        setIndex(prev => (prev + 1) % randomizedSlides.length);
        fade(1);
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [randomizedSlides.length]);

  if (!randomizedSlides.length) return null;

  const current = randomizedSlides[index];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.slide, { opacity: fadeAnim }]}>

        <Image source={{ uri: current.displayImage }} style={styles.image} resizeMode="cover" />
        <View style={styles.overlay} />

        <View style={styles.textContainer}>
          <Text style={styles.subtitle}>مختاراتنا المميزة</Text>
          <Text style={styles.title}>{current.name}</Text>
          {current.location && <Text style={styles.location}>{current.location}</Text>}
        </View>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:     { width, height: 450, backgroundColor: '#FFF' },
  slide:         { width, height: 450 },
  image:         { width, height: 450, backgroundColor: '#FFF' },
  overlay:       { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)' },
  textContainer: { position: 'absolute', bottom: 60, right: 25, alignItems: 'flex-end' },
  subtitle:      { color: '#C5A358', fontSize: 13, fontWeight: '700', marginBottom: 6 },
  title:         { color: '#FFF', fontSize: 30, fontWeight: '900', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 10 },
  location:      { color: '#E0E0E0', fontSize: 15, marginTop: 4, fontWeight: '500' },
});