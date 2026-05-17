import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
type StateType = 'no_city' | 'no_search' | 'error'|'loading_failed';
interface StateConfig {
  icon: string;
  title: string;
  subtitle: string;
  action: string;}
const STATES: Record<StateType, StateConfig> = {
  no_city: {
    icon: '🏠',
    title: 'لا يوجد شاليهات  ',
    subtitle:' لا توجد شاليهات مطابقة لهذا الفلتر حالياً',
    action: 'عرض كل الشاليهات',
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
    action: 'إعادة المحاولة',},};
interface EmptyStateProps {
  type?: StateType;
  onAction?: () => void;}
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
        </TouchableOpacity>)}
    </View>);};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
    backgroundColor: '#F7F7F7',
  },icon: {
    fontSize: 52,
    marginBottom: 16,
    color: '#F69D58', 
  },title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
    textAlign: 'center',
  },subtitle: {
    fontSize: 14,
    color: '#6C6C6B', 
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },btn: {backgroundColor: '#6A0DAD', 
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#6A0DAD',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },btnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',},});
export default EmptyState;