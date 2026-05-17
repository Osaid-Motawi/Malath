// /app/page/services/aiService.ts
import { Platform } from "react-native";

const LOCAL_IP = "172.23.255.39";

export async function askMalathAI(message: string, chalets: any[]) {
  const API_URL =
    Platform.OS === "web"
      ? "http://localhost:3000/ask"
      : `http://${LOCAL_IP}:3000/ask`;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, chalets }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.details || data.error || "Server error");
    }

    return data.reply;
  } catch (error: any) {
    console.error("AI Service Error:", error);

    return "صار خطأ بالاتصال مع مساعد ملاذ. تأكدي إن السيرفر شغال والجوال والماك على نفس الواي فاي.";
  }
}