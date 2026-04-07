import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type StateType = 'no_city' | 'no_search' | 'error'|'loading_failed';

interface StateConfig {
  icon: string;
  title: string;
  subtitle: string;
  action: string;
}

const STATES: Record<StateType, StateConfig> = {
  no_city: {
    icon: '🏠',
    title: 'لا يوجد شاليهات',
    subtitle: 'لا توجد شاليهات متاحة في هذه المدينة حالياً',
    action: 'عرض كل المدن',
  },
  no_search: {
    icon: '🔍',
    title: 'لا توجد نتائج',
    subtitle: 'جرب كلمة بحث مختلفة أو اختر مدينة أخرى',
    action: 'مسح البحث',
  },
  error: {
    icon: '⚠️',
    title: 'حدث خطأ',
    subtitle: 'تعذر تحميل البيانات، تحقق من الاتصال',
    action: 'إعادة المحاولة',
  },
  loading_failed: {
    icon: '📡',
    title: 'لا يوجد اتصال',
    subtitle: 'تحقق من الإنترنت وحاول مجدداً',
    action: 'إعادة المحاولة',
  },
};
interface EmptyStateProps {
  type?: StateType;
  onAction?: () => void;
}
const EmptyState = ({ type = 'no_city', onAction }: EmptyStateProps) => {
  const state = STATES[type];

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{state.icon}</Text>
      <Text style={styles.title}>{state.title}</Text>
      <Text style={styles.subtitle}>{state.subtitle}</Text>
      {onAction && (
        <TouchableOpacity style={styles.btn} onPress={onAction}>
          <Text style={styles.btnText}>{state.action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
    backgroundColor: '#F3F0E9', 
  },
  icon: {
    fontSize: 52,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#18251D', 
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#18251D',
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  btn: {
    backgroundColor: '#31202A', 
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnText: {
    color: '#F3F0E9', 
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EmptyState;