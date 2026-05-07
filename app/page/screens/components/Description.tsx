import React, { useState } from 'react';
import { View, Text, TouchableOpacity,StyleSheet} from 'react-native';
type Props = {
  description?: string;
};
export default function Description({ description }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.descCard}>
      <Text style={styles.descTitle}>الوصف</Text>

      <Text style={styles.descText} numberOfLines={expanded ? undefined : 3}>
        {description}
      </Text>

      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text style={styles.readMore}>
          {expanded ? '‹ أقل' : '... المزيد ›'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  descCard: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  descTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descText: {
    fontSize: 16,
    lineHeight: 24,
  },
  readMore: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});