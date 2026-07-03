import React, { useCallback } from 'react';
import { motion } from 'motion/react';
import '../chat/chat-ui.css';
import ChatHeader from '../components/ChatHeader';
import MessageList from '../components/MessageList';
import InputBar from '../components/InputBar';
import ChatErrorBanner from '../components/ChatErrorBanner';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { BottomNav } from '../components/BottomNav';
import { useChat } from '../chat/useChat';
import { useVoicePlaceholder } from '../chat/voice/useVoicePlaceholder';
import { useApp } from '../context/AppContext';

export function ChatScreen() {
  const { theme, t } = useApp();
  const [state, actions] = useChat();
  const voice = useVoicePlaceholder();

  const handleClear = useCallback(() => {
    if (state.messages.length === 0) return;
    if (window.confirm(t('chat_clear_confirm'))) {
      actions.clearChat();
    }
  }, [state.messages.length, actions, t]);

  const handlePromptSelect = useCallback(
    (text: string) => {
      actions.send(text);
    },
    [actions]
  );

  const isLight = theme === 'light';

  return (
    <div className="relative min-h-screen pb-24 app-bg-gradient">
      {!isLight && <AnimatedBackground />}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="ef-chat-screen"
      >
        <div className="ef-chat-card">
          <ChatHeader
            onClear={handleClear}
            hasMessages={state.messages.length > 0}
            isBusy={state.isSending || state.isStreaming}
          />

          {state.error && (
            <ChatErrorBanner
              messageKey={state.error}
              onDismiss={actions.dismissError}
            />
          )}

          <MessageList
            messages={state.messages}
            isTyping={state.isTyping}
            isStreaming={state.isStreaming}
            onPromptSelect={handlePromptSelect}
            onRegenerate={actions.regenerate}
            isBusy={state.isSending || state.isStreaming}
          />

          <InputBar
            onSend={actions.send}
            isSending={state.isSending}
            voice={{
              isVoiceEnabled: voice.isVoiceEnabled,
              isSpeakerEnabled: voice.isSpeakerEnabled,
              onToggleVoice: voice.toggleVoiceInput,
              onToggleSpeaker: voice.toggleSpeaker,
              onStartListening: voice.startListening,
              notice: voice.notice,
            }}
          />
        </div>
      </motion.div>

      <BottomNav />
    </div>
  );
}
