import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
const FeatureItem = ({ icon, label, value }: any) => {
  return (
    <View style={styles.featureItem}>
      <View style={styles.iconWrap}>{icon}</View>
      {value !== undefined && (
        <Text style={styles.value}>{value}</Text>
      )}
      <Text style={styles.label}>{label}</Text>
    </View>);};
export default FeatureItem;
 const styles = StyleSheet.create({
  featureItem: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginHorizontal: 8,
   
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    minWidth: 80,
  },
  iconWrap: {
    width: 36,
    height: 36,
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    color: '#969496',
    textAlign: 'center',
  },});
