import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import ChatWelcome from './ChatWelcome';
import TypingIndicator from './TypingIndicator';
import { Message } from '../chat/types';

interface Props {
  messages: Message[];
  isTyping?: boolean;
  isStreaming?: boolean;
  onPromptSelect?: (text: string) => void;
  onRegenerate?: (id: string) => void;
  isBusy?: boolean;
}

export default function MessageList({
  messages,
  isTyping,
  isStreaming,
  onPromptSelect,
  onRegenerate,
  isBusy = false,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isStreaming]);

  const isEmpty = messages.length === 0;
  const lastAiMessage = [...messages].reverse().find((m) => m.role === 'ai');

  return (
    <div className="ef-message-list" ref={ref} role="log" aria-live="polite">
      {isEmpty && onPromptSelect ? (
        <ChatWelcome onPromptSelect={onPromptSelect} />
      ) : (
        messages.map((m) => (
          <div role="listitem" key={m.id}>
            <MessageBubble
              message={m}
              onRegenerate={onRegenerate}
              canRegenerate={
                !isBusy && m.id === lastAiMessage?.id && !m.isStreaming
              }
            />
          </div>
        ))
      )}
      {isTyping && !isStreaming && (
        <div className="ef-typing-wrapper">
          <TypingIndicator />
        </div>
      )}
      <div ref={bottomRef} aria-hidden />
    </div>
  );
}
