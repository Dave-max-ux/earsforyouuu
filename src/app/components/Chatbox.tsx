import React, { useEffect, useRef, useState } from "react";
import { sendMessage } from "../../services/ChatService";
import "./Chatbox.css";

type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
  status?: MessageStatus;
  createdAt?: number;
  updatedAt?: number;
  language?: string;
};

export default function Chatbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isAiTyping]);

  // language detection heuristic (simple) — returns 'pidgin' when common pidgin words detected
  const detectLanguage = (text: string): string => {
    const pidginWords = /\b(abi|how far|how you dey|wey|na|e dey|no be|bicos|make we|una|omo|sharp)\b/i;
    if (pidginWords.test(text)) return "pidgin";
    return "en";
  };

  const speak = (text: string, lang?: string) => {
    if (!voiceOn) return;
    if (!("speechSynthesis" in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    if (lang === "pidgin") utter.lang = "en-US"; // fallback — browsers usually don't have pidgin codes
    if (lang === "en") utter.lang = "en-US";

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length) {
      const preferred = voices.find((v) => v.lang && (v.lang.includes("en-")));
      if (preferred) utter.voice = preferred;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  // Append a message safely
  const pushMessage = (msg: Message) => {
    setMessages((m) => [...m, { createdAt: Date.now(), updatedAt: Date.now(), ...msg }]);
  };

  // Update message in-place by id
  const updateMessage = (id: string, patch: Partial<Message>) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch, updatedAt: Date.now() } : m)));
  };

  // Streaming-capable send: tries a streaming endpoint, falls back to ChatService
  const sendToBackend = async (msgs: Message[], onToken?: (txt: string) => void) => {
    try {
      // try streaming endpoint first
      const res = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: msgs.map(({ role, text }) => ({ role, text })) }),
      });

      if (!res.ok) throw new Error("Stream not available");

      if (!res.body) throw new Error("No stream body");

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let done = false;
      while (!done) {
        const { value, done: d } = await reader.read();
        done = !!d;
        if (value) {
          const chunk = dec.decode(value, { stream: true });
          onToken && onToken(chunk);
        }
      }
      return { finished: true };
    } catch (err) {
      // fallback to existing ChatService
      const resp = await sendMessage(msgs.map(({ role, text }) => ({ role, text })));
      return { finished: true, text: resp.text, language: resp.language };
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const id = String(Date.now());
    const lang = detectLanguage(text);
    const userMsg: Message = { id, role: "user", text, status: "sending", language: lang };
    pushMessage(userMsg);
    setInput("");
    setIsSending(true);

    // immediately mark as sent (optimistic)
    setTimeout(() => updateMessage(id, { status: "sent" }), 250);

    // create AI placeholder message
    const aiId = "ai-" + Date.now();
    const aiMsg: Message = { id: aiId, role: "ai", text: "", status: "sending" };
    pushMessage(aiMsg);
    setIsAiTyping(true);

    // token handler appends tokens to ai message
    let aggregated = "";
    const onToken = (token: string) => {
      aggregated += token;
      updateMessage(aiId, { text: aggregated });
    };

    try {
      const result = await sendToBackend([...messages, userMsg], onToken);

      if (result && (result as any).text) {
        // fallback returned full text
        updateMessage(aiId, { text: (result as any).text });
        aggregated = (result as any).text;
      }

      // mark statuses
      updateMessage(aiId, { status: "sent" });
      updateMessage(id, { status: "delivered" });

      // after a short delay mark read
      setTimeout(() => {
        updateMessage(aiId, { status: "read" });
        updateMessage(id, { status: "read" });
      }, 800);

      setIsAiTyping(false);
      // speak the final aggregated response
      const detectLang = detectLanguage(aggregated || "");
      speak(aggregated, detectLang === "pidgin" ? "pidgin" : "en");
    } catch (err) {
      updateMessage(aiId, { text: "Sorry, I couldn't reach the server.", status: "failed" });
      updateMessage(id, { status: "failed" });
      setIsAiTyping(false);
    } finally {
      setIsSending(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isSending) handleSend();
  };

  return (
    <div className="efs-chatbox">
      <div className="efs-card">
        <div className="efs-header">
          <div className="title">
            <div className="brand">EF</div>
            <div>
              <div className="text-sm font-medium text-foreground">EarsForYou</div>
              <div className="subtitle">Here to listen</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={voiceOn} onChange={(e) => setVoiceOn(e.target.checked)} />
              <span className="text-xs">Voice</span>
            </label>
          </div>
        </div>

        <div ref={listRef} className="efs-list">
          {messages.map((m) => {
            const time = m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
            return (
              <div key={m.id} className={`efs-msg ${m.role === "user" ? "user" : "ai"}`}>
                <div className="avatar">{m.role === 'user' ? 'You' : 'AI'}</div>
                <div className="meta">
                  <div className="bubble">
                    {m.text || (m.role === "ai" && isAiTyping ? <span className="typing-indicator"><span/><span/><span/></span> : null)}
                  </div>
                  <div className="meta-row">
                    <div className="meta-time">{time}</div>
                    <div className="msg-status" aria-hidden>
                      {m.status === "sending" && "…"}
                      {m.status === "sent" && "✓"}
                      {m.status === "delivered" && "✓✓"}
                      {m.status === "read" && "👁"}
                      {m.status === "failed" && "⚠️"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="efs-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type your message..."
            aria-label="Message input"
          />
          <button onClick={handleSend} disabled={isSending}>{isSending ? "Sending..." : "Send"}</button>
        </div>
      </div>
    </div>
  );
}
