import React from 'react';
import {ScrollView,TouchableOpacity,Text,StyleSheet,} from 'react-native';
interface CityFilterProps {
  cities: string[];
  selectedCity: string;
  onSelectCity: (city: string) => void;
}
const CityFilter = ({ cities, selectedCity, onSelectCity }: CityFilterProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {cities.map(city => (
        <TouchableOpacity
          key={city}
          style={[
            styles.chip,
            selectedCity === city && styles.chipActive,
          ]}
          onPress={() => onSelectCity(city)}
        >
          <Text
            style={[
              styles.chipText,
              selectedCity === city && styles.chipTextActive,
            ]}
          >
            {city}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#18251D',
    backgroundColor: '#F3F0E9',
  },
  chipActive: {
    backgroundColor: '#31202A',
    borderColor: '#31202A',
  },
  chipText: {
    fontSize: 13,
    color: '#18251D',
  },
  chipTextActive: {
    color: '#F3F0E9',
    fontWeight: '600',
  },
});
export default CityFilter;