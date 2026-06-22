import { useCallback, useReducer, useRef } from 'react';
import type { ChatActions, ChatState, ConversationSession, Message } from './types';
import * as api from './chatApi';

type Action =
  | { type: 'append'; message: Message }
  | { type: 'update'; id: string; patch: Partial<Message> }
  | { type: 'remove'; id: string }
  | { type: 'remove_after'; id: string }
  | { type: 'set_sending'; value: boolean }
  | { type: 'set_streaming'; value: boolean }
  | { type: 'set_error'; error: string | null }
  | { type: 'reset' };

const initialState: ChatState = {
  messages: [],
  isTyping: false,
  isStreaming: false,
  isSending: false,
  sessionId: 'local-session',
  error: null,
};

function reducer(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case 'append':
      return { ...state, messages: [...state.messages, action.message] };
    case 'update':
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.id ? { ...m, ...action.patch } : m
        ),
      };
    case 'remove':
      return { ...state, messages: state.messages.filter((m) => m.id !== action.id) };
    case 'remove_after': {
      const idx = state.messages.findIndex((m) => m.id === action.id);
      if (idx === -1) return state;
      return { ...state, messages: state.messages.slice(0, idx + 1) };
    }
    case 'set_sending':
      return { ...state, isSending: action.value };
    case 'set_streaming':
      return { ...state, isStreaming: action.value, isTyping: action.value };
    case 'set_error':
      return { ...state, error: action.error };
    case 'reset':
      return { ...initialState, sessionId: state.sessionId };
    default:
      return state;
  }
}

function buildSession(state: ChatState): ConversationSession {
  const now = new Date().toISOString();
  return {
    id: state.sessionId,
    messages: state.messages,
    createdAt: state.messages[0]?.timestamp ?? now,
    updatedAt: now,
    language: state.messages.find((m) => m.language)?.language,
  };
}

export function useChat(initialSessionId = 'local-session') {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    sessionId: initialSessionId,
  });
  const stateRef = useRef(state);
  stateRef.current = state;

  const streamResponse = useCallback(
    async (content: string, aiId: string, userId: string) => {
      dispatch({ type: 'set_streaming', value: true });
      let aggregated = '';

      try {
        await api.receiveStream(
          {
            content,
            sessionId: stateRef.current.sessionId,
            history: stateRef.current.messages.filter((m) => m.id !== aiId),
          },
          (token) => {
            aggregated += token;
            dispatch({ type: 'update', id: aiId, patch: { content: aggregated } });
          },
          (meta) => {
            dispatch({
              type: 'update',
              id: aiId,
              patch: {
                content: meta?.text || aggregated,
                isStreaming: false,
                status: 'sent',
                language: meta?.language,
              },
            });
            dispatch({ type: 'update', id: userId, patch: { status: 'delivered' } });
          }
        );
      } catch {
        dispatch({
          type: 'update',
          id: aiId,
          patch: {
            content: '',
            isStreaming: false,
            status: 'failed',
          },
        });
        dispatch({ type: 'update', id: userId, patch: { status: 'failed' } });
        dispatch({ type: 'set_error', error: 'chat_error_response' });
        throw new Error('Stream failed');
      } finally {
        dispatch({ type: 'set_streaming', value: false });
      }
    },
    []
  );

  const send = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || stateRef.current.isSending) return;

      dispatch({ type: 'set_error', error: null });
      dispatch({ type: 'set_sending', value: true });

      const userId = `u-${Date.now()}`;
      const userMsg: Message = {
        id: userId,
        role: 'user',
        content: trimmed,
        timestamp: new Date().toISOString(),
        status: 'sending',
      };
      dispatch({ type: 'append', message: userMsg });
      dispatch({ type: 'update', id: userId, patch: { status: 'sent' } });

      const aiId = `a-${Date.now()}`;
      const aiMsg: Message = {
        id: aiId,
        role: 'ai',
        content: '',
        timestamp: new Date().toISOString(),
        isStreaming: true,
        status: 'sending',
      };
      dispatch({ type: 'append', message: aiMsg });

      try {
        await streamResponse(trimmed, aiId, userId);
      } catch {
        // error already handled in streamResponse
      } finally {
        dispatch({ type: 'set_sending', value: false });
      }
    },
    [streamResponse]
  );

  const regenerate = useCallback(
    async (messageId: string) => {
      const current = stateRef.current;
      const aiIndex = current.messages.findIndex((m) => m.id === messageId);
      if (aiIndex === -1) return;

      const aiMessage = current.messages[aiIndex];
      if (aiMessage.role !== 'ai') return;

      let userMessage: Message | undefined;
      for (let i = aiIndex - 1; i >= 0; i--) {
        if (current.messages[i].role === 'user') {
          userMessage = current.messages[i];
          break;
        }
      }
      if (!userMessage) return;

      dispatch({ type: 'set_error', error: null });
      dispatch({ type: 'set_sending', value: true });
      dispatch({ type: 'remove', id: messageId });

      const aiId = `a-${Date.now()}`;
      const aiMsg: Message = {
        id: aiId,
        role: 'ai',
        content: '',
        timestamp: new Date().toISOString(),
        isStreaming: true,
        status: 'sending',
      };
      dispatch({ type: 'append', message: aiMsg });

      try {
        await streamResponse(userMessage.content, aiId, userMessage.id);
      } catch {
        // error handled in streamResponse
      } finally {
        dispatch({ type: 'set_sending', value: false });
      }
    },
    [streamResponse]
  );

  const clearChat = useCallback(() => {
    dispatch({ type: 'reset' });
  }, []);

  const dismissError = useCallback(() => {
    dispatch({ type: 'set_error', error: null });
  }, []);

  const actions: ChatActions = { send, regenerate, clearChat, dismissError };
  const conversation: ConversationSession = buildSession(state);

  return [state, actions, conversation] as const;
}
