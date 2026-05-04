import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
    </View>);};
export default AccordionItem;
const styles = StyleSheet.create({
  accordionItem: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',

    // shadow iOS
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },

    // shadow Android
    elevation: 2,
    overflow: 'hidden',
  },

  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },

  accIconWrap: {
    width: 36,
    height: 36,
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  accordionTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    textAlign: 'right',
  },

  accordionArrow: {
    fontSize: 12,
    color: '#969496',
    marginLeft: 8,
  },

  accordionBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});