import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { askMalathAI } from "../../services/aiService";
import { useChalet } from "../components/ChaletContext";
import { DeerIcon } from "../components/CustomIcon";

type Message = { role: "user" | "assistant"; content: string };

export default function MalathChat() {
  const insets = useSafeAreaInsets();
  const { chalets } = useChalet();
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const chatMutation = useMutation({
    mutationFn: async (input: string) => {
      return await askMalathAI(input, chalets);
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, { role: "assistant", content: data || "" }]);
    },
    onError: () => {
      setMessages(prev => [...prev, { role: "assistant", content: "عذراً، حدث خطأ. حاول ثانية." }]);
    }
  });

  const handleSend = () => {
    if (!userInput.trim() || chatMutation.isPending) return;

    const userMsg = userInput.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setUserInput("");

    chatMutation.mutate(userMsg);
  };

  return (
    <View style={[styles.chatContainer, { paddingBottom: insets.bottom }]}>
      
      <View style={[styles.chatHeader, { paddingTop: insets.top }]}>
        <Text style={styles.chatHeaderTitle}>مساعد ملاذ الذكي</Text>
      </View>

      <View style={styles.backgroundIconContainer} pointerEvents="none">
        <View style={{ opacity: 0.05 }}>
          <DeerIcon size={250} />
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.aiBubble}>
            <Text style={styles.aiText}>مرحبا! أنا مساعد ملاذ، كيف بقدر أساعدك؟ 💜</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={item.role === "user" ? styles.userBubble : styles.aiBubble}>
            <Text style={item.role === "user" ? styles.userText : styles.aiText}>
              {item.content}
            </Text>
          </View>
        )}
        ListFooterComponent={chatMutation.isPending ? (
          <View style={styles.aiBubble}>
            <Text style={styles.aiText}>يكتب الآن...</Text>
          </View>
        ) : null}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.inputArea}>
          <TextInput 
            style={styles.chatInput} 
            placeholder="اسأل عن الشاليهات..." 
            value={userInput} 
            onChangeText={setUserInput}
            multiline
          />
          <Pressable 
            onPress={handleSend} 
            style={[styles.sendButton, chatMutation.isPending && { opacity: 0.6 }]}
            disabled={chatMutation.isPending}
          >
            <Ionicons name="send" size={20} color="#FFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  chatContainer: { flex: 1, backgroundColor: "#FFF" },
  chatHeader: { 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: "#F5F5F5", 
    alignItems: 'center' 
  },
  chatHeaderTitle: { fontSize: 16, fontWeight: "800", color: "#6A0DAD" },
  backgroundIconContainer: { 
    ...StyleSheet.absoluteFillObject, 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: -1 
  },
  listContent: { padding: 20, flexGrow: 1 },
  userBubble: { 
    backgroundColor: "#6A0DAD", 
    alignSelf: "flex-end", 
    padding: 12, 
    borderRadius: 15, 
    borderBottomRightRadius: 2, 
    marginBottom: 10, 
    maxWidth: "85%" 
  },
  aiBubble: { 
    backgroundColor: "#F2F2F7", 
    alignSelf: "flex-start", 
    padding: 12, 
    borderRadius: 15, 
    borderBottomLeftRadius: 2, 
    marginBottom: 10, 
    maxWidth: "85%" 
  },
  userText: { color: "#FFF", textAlign: "right", fontSize: 15 },
  aiText: { color: "#1C1C1E", fontSize: 15, textAlign: 'right' },
  inputArea: { 
    flexDirection: "row-reverse", 
    padding: 10, 
    borderTopWidth: 1, 
    borderTopColor: "#F0F0F0", 
    alignItems: "center" 
  },
  chatInput: { 
    flex: 1, 
    backgroundColor: "#F2F2F7", 
    borderRadius: 20, 
    paddingHorizontal: 15, 
    paddingVertical: 8,
    textAlign: "right", 
    fontSize: 15,
    maxHeight: 100
  },
  sendButton: { 
    backgroundColor: "#6A0DAD", 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 8 
  },
});