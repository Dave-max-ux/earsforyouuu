export type ChatMessage = { role: "user" | "ai"; text: string };

export type ChatResponse = { text: string; language?: string };

// Simple abstraction for backend integration. POSTs messages to `/api/chat`.
// The backend should return JSON: { text: string, language?: string }

export async function sendMessage(messages: ChatMessage[]): Promise<ChatResponse> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Chat API error");
  }

  const data = await res.json();
  // Validate shape minimally
  if (typeof data?.text !== "string") throw new Error("Invalid response from chat backend");
  return { text: data.text, language: data.language };
}
