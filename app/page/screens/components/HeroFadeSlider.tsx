import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

type Slide = {
  id: string;
  name: string;
  location?: string;
  image?: string;
};
export default function SimpleHeroSlider({ slides }: { slides: Slide[] }) {

  const [randomSlides, setRandomSlides] = useState<Slide[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const shuffled = [...slides].sort(() => Math.random() - 0.5);
    setRandomSlides(shuffled);
  }, [slides]);

  useEffect(() => {

    if (randomSlides.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % randomSlides.length);
    }, 4000);

    return () => clearInterval(timer);

  }, [randomSlides]);

  if (randomSlides.length === 0) return null;

  const current = randomSlides[index];

  return (
    <View style={styles.container}>

      <Image
        source={{ uri: current.image }}
        style={styles.image}
      />

      <View style={styles.overlay} />

      <View style={styles.textBox}>
        <Text style={styles.smallText}>مختاراتنا المميزة</Text>

        <Text style={styles.title}>
          {current.name}
        </Text>

        <Text style={styles.location}>
          {current.location}
        </Text>
      </View>

    </View>
  );
}
const styles = StyleSheet.create({

  container: {width: width,height: 450},

  image: {width: width,height: 450,},

  overlay: { ...StyleSheet.absoluteFillObject,backgroundColor: 'rgba(0,0,0,0.25)',  },

  textBox: {position: 'absolute', bottom: 60,right: 25,alignItems: 'flex-end',},

  smallText: {color: '#C5A358',fontSize: 14,fontWeight: 'bold',},

  title: {color: '#fff',fontSize: 30,fontWeight: 'bold',},

  location: {color: '#eee',fontSize: 16,marginTop: 5,},

});