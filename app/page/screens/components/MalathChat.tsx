import { Ionicons } from "@expo/vector-icons";
import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { askMalathAI } from "../../services/aiService";
import { useChalet } from "../components/ChaletContext";
import { DeerIcon } from "../components/CustomIcon";

type Message = { role: string; content: string };

export default function MalathChat() {
  const { chalets } = useChalet();
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
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
      setMessages([...newMessages, { role: "assistant", content: "حدث خطأ في الاتصال، حاول لاحقاً." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const isUser = (role: string) => role === "user";

  return (
    <View style={styles.chatContainer}>

      <View style={styles.chatHeader}>
        <Text style={styles.chatHeaderTitle}>مساعد ملاذ الذكي</Text>
      </View>

      <View style={styles.backgroundIconContainer} pointerEvents="none">
        <View style={{ opacity: 0.06 }}>
          <DeerIcon size={250} />
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={{ padding: 20, flexGrow: 1 }}
        ListHeaderComponent={
          <View style={styles.aiBubble}>
            <Text style={styles.aiText}>مرحبا! أنا مساعد ملاذ، كيف أساعدك في اختيار شاليهك اليوم؟ 🪶💜</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={isUser(item.role) ? styles.userBubble : styles.aiBubble}>
            <Text style={isUser(item.role) ? styles.userText : styles.aiText}>{item.content}</Text>
          </View>
        )}
        ListFooterComponent={isTyping ? (
          <View style={styles.aiBubble}>
            <Text style={styles.aiText}>يكتب الآن...</Text>
          </View>
        ) : null}
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}>
        <View style={styles.inputArea}>
          <TextInput style={styles.chatInput} placeholder="اسأل عن أي شاليه.." value={userInput} onChangeText={setUserInput} />
          <Pressable onPress={handleSend} style={styles.sendButton}>
            <Ionicons name="send" size={20} color="#FFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>

    </View>
  );
}

const styles = StyleSheet.create({
  chatContainer:           { flex: 1, backgroundColor: "#FFF" },
  chatHeader:              { padding: 20, borderBottomWidth: 1, borderBottomColor: "#F0F0F0", alignItems: 'center', backgroundColor: '#FFF' },
  chatHeaderTitle:         { fontSize: 17, fontWeight: "800", color: "#6A0DAD", letterSpacing: 0.5 },
  backgroundIconContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', zIndex: -1 },
  userBubble:              { backgroundColor: "#6A0DAD", alignSelf: "flex-end", padding: 14, borderRadius: 18, borderBottomRightRadius: 2, marginBottom: 12, maxWidth: "85%", elevation: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1 },
  aiBubble:                { backgroundColor: "#F2F2F7", alignSelf: "flex-start", padding: 14, borderRadius: 18, borderBottomLeftRadius: 2, marginBottom: 12, maxWidth: "85%" },
  userText:                { color: "#FFF", textAlign: "right", fontSize: 15, lineHeight: 20 },
  aiText:                  { color: "#1C1C1E", fontSize: 15, lineHeight: 20, textAlign: 'right' },
  inputArea:               { flexDirection: "row-reverse", padding: 15, borderTopWidth: 1, borderTopColor: "#F0F0F0", alignItems: "center", backgroundColor: '#FFF', paddingBottom: Platform.OS === 'ios' ? 30 : 15 },
  chatInput:               { flex: 1, backgroundColor: "#F2F2F7", borderRadius: 25, paddingHorizontal: 20, height: 45, textAlign: "right", fontSize: 15 },
  sendButton:              { backgroundColor: "#6A0DAD", width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
});