// /app/page/services/aiService.ts
import { Platform } from 'react-native';

export async function askMalathAI(message: string, chalets: any[]) {
  
  const API_URL = Platform.OS === 'web' 
    ? "http://localhost:3000/ask" 
    : "http://192.168.1.4:3000/ask"; 

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, chalets }), 
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.details || "Server error");
    }

    const data = await res.json();
    return data.reply;
  } catch (error: any) {
    console.error("AI Service Error:", error);

    return `خطأ: ${error.message}`;
  }
}