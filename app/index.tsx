import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';

const PRIMARY = "#6A0DAD";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>

        <View style={styles.logoBox}>
          <Image
            source={require('../assets/images/image.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>ملاذ</Text>

        <Text style={styles.subtitle}>MALATH</Text>
      </View>

      <ActivityIndicator
        size="large"
        color={PRIMARY}
        style={styles.loader}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoContainer: {
    alignItems: 'center',
  },

  logoBox: {
    width: 180,
    height: 180,
    backgroundColor: "#FFFFFF",
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 6,
  },

  logo: {
    width: 150,
    height: 150,
  },

  title: {
    fontSize: 46,
    fontWeight: '900',
    color: PRIMARY,
    marginTop: 14,
  },

  subtitle: {
    fontSize: 15,
    color: 'rgba(106,13,173,0.6)',
    letterSpacing: 5,
    marginTop: 2,
    fontWeight: "700",
  },

  loader: {
    position: 'absolute',
    bottom: 70,
  },
});