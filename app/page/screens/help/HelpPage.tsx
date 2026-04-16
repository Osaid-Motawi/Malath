import { Ionicons } from "@expo/vector-icons";
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { askMalathAI } from "../../services/aiService";
import { useChalets } from "../components/ChaletContext";
import { AddChaletIcon, BookingStepsIcon, DeerIcon } from '../components/CustomIcon';

const { height } = Dimensions.get('window');

function MalathChatComponent({ onBack }: { onBack: () => void }) {
  const { chalets } = useChalets();
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!userInput.trim() || isTyping) return;
    const newMessages = [...messages, { role: "user", content: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setIsTyping(true);
    
    try {
      const response = await askMalathAI(userInput, chalets);
      setMessages([...newMessages, { role: "assistant", content: response || "" }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "حدث خطأ في الاتصال." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <View style={styles.chatHeaderWrapper}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-forward" size={26} color="#6A0DAD" />
          <Text style={styles.backText}>رجوع</Text>
        </Pressable>
      </View>

      <View style={styles.chatContainer}>
        <View style={styles.backgroundIconContainer} pointerEvents="none">
          <DeerIcon size={280} />
        </View>

        <FlatList
          data={messages}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          ListHeaderComponent={() => (
            <View style={styles.aiBubble}>
              <Text style={styles.aiText}> مرحبا ! أنا مساعد ملاذ، كيف بقدر أساعدك؟</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={item.role === "user" ? styles.userBubble : styles.aiBubble}>
              <Text style={item.role === "user" ? styles.userText : styles.aiText}>
                {item.content}
              </Text>
            </View>
          )}
          ListFooterComponent={isTyping ? <Text style={styles.typingText}>يكتب الآن...</Text> : null}
        />

        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          <View style={styles.inputArea}>
            <TextInput 
              style={styles.chatInput} 
              placeholder="اسأل عن أي شاليه.." 
              value={userInput} 
              onChangeText={setUserInput}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              blurOnSubmit={false}
            />
            <Pressable onPress={handleSend} style={styles.sendButton}>
              <Ionicons name="send" size={20} color="#FFF" />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

export default function HelpPage() {
  const [showChat, setShowChat] = useState(false);

  if (showChat) {
    return <MalathChatComponent onBack={() => setShowChat(false)} />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.assistantLabel}>غزال المساعد الذكي</Text>
      </View>

      <View style={styles.iconWrapper}>
        <Pressable 
          onPress={() => setShowChat(true)} 
          style={({ pressed }) => [
            styles.iconCircle, 
            { transform: [{ scale: pressed ? 0.96 : 1 }] }
          ]}
        >
          <DeerIcon size={120} />
          <View style={styles.chatBadge}>
            <Text style={styles.chatBadgeText}>اضغط لبدء الدردشة</Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.stepsSection}>
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <Text style={styles.stepTitle}>١/ خطوات حجز شاليه</Text>
            <View style={styles.iconContainer}>
              <BookingStepsIcon size={20} />
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.stepDescription}>
            • اختر الشاليه وتأكد من مواصفاته (المسبح، الغرف، الموقع).{"\n"}
            • اضغط "احجز الآن" بجانب السعر أسفل الصفحة.{"\n"}
            • حدد تواريخ "الدخول" و "الخروج" من التقويم.{"\n"}
            • اختر عدد الضيوف (±) وأضف ملاحظاتك الخاصة.{"\n"}
            • اضغط "متابعة لمراجعة الحجز" لتأكيد طلبك.
          </Text>
        </View>

        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <Text style={styles.stepTitle}>٢/ خطوات إضافة شاليه</Text>
            <View style={styles.iconContainer}>
              <AddChaletIcon size={22} />
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.stepDescription}>
            • من حسابك الشخصي، اختر "إضافة شاليه جديد".{"\n"}
            • قم برفع صور واضحة وكتابة وصف دقيق للمرافق.{"\n"}
            • حدد السعر والموقع الجغرافي ثم اضغط "نشر الإعلان".
          </Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { alignItems: 'center', paddingTop: 60, paddingBottom: 20 },
  headerTitleContainer: { alignItems: 'center', marginBottom: 30 },
  assistantLabel: { fontSize: 24, fontWeight: '900', color: '#6A0DAD' },
  welcomeText: { fontSize: 15, color: '#8E8E93', marginTop: 5 },
  iconWrapper: { marginBottom: 50, alignItems: 'center' },
  iconCircle: {
    width: 180, height: 180, borderRadius: 90,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#F8F4FF', borderWidth: 2, borderColor: '#E6D7FF',
    elevation: 5, shadowColor: "#6A0DAD", shadowOpacity: 0.1, shadowRadius: 10
  },
  chatBadge: {
    position: 'absolute', bottom: -15, backgroundColor: '#6A0DAD',
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25,
  },
  chatBadgeText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  stepsSection: { width: '100%', paddingHorizontal: 25 },
  stepCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#6A0DAD'
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12
  },
  stepTitle: { fontSize: 17, fontWeight: '800', color: '#1A1A1A' },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 12 },
  stepDescription: { fontSize: 14, color: '#444', textAlign: 'right', lineHeight: 22 },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0E7FF',
    justifyContent: 'center',
    alignItems: 'center'
  },

  chatHeaderWrapper: {
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingBottom: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  backButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 10
  },
  backText: { color: '#6A0DAD', fontWeight: '800', fontSize: 18 },
  chatContainer: { flex: 1 },
  backgroundIconContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
    opacity: 0.04
  },
  userBubble: {
    backgroundColor: "#6A0DAD",
    alignSelf: "flex-end",
    padding: 15,
    borderRadius: 20,
    borderBottomRightRadius: 2,
    marginBottom: 12,
    maxWidth: "80%"
  },
  aiBubble: {
    backgroundColor: "#F0F0F2",
    alignSelf: "flex-start",
    padding: 15,
    borderRadius: 20,
    borderBottomLeftRadius: 2,
    marginBottom: 12,
    maxWidth: "80%"
  },
  userText: { color: "#FFF", textAlign: "right", fontSize: 15 },
  aiText: { color: "#1C1C1E", textAlign: "right", fontSize: 15 },
  typingText: { color: '#8E8E93', textAlign: 'center', fontSize: 13, marginTop: 5 },
  inputArea: {
    flexDirection: "row-reverse",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    alignItems: "center",
    backgroundColor: '#FFF'
  },
  chatInput: {
    flex: 1,
    backgroundColor: "#F0F0F5",
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 45,
    textAlign: "right"
  },
  sendButton: {
    backgroundColor: "#6A0DAD",
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
});