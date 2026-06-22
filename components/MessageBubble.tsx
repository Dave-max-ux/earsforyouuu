import React, { useCallback } from 'react';
import { Copy, RefreshCw, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Message } from '../chat/types';
import { useApp } from '../context/AppContext';

interface Props {
  message: Message;
  onRegenerate?: (id: string) => void;
  canRegenerate?: boolean;
}

export default function MessageBubble({
  message,
  onRegenerate,
  canRegenerate = false,
}: Props) {
  const { t } = useApp();
  const [copied, setCopied] = React.useState(false);

  const isUser = message.role === 'user';
  const isAi = message.role === 'ai';
  const isFailed = message.status === 'failed';
  const isStreaming = message.isStreaming && !message.content;
  const displayContent =
    isFailed && !message.content ? t('chat_error_response') : message.content;

  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleCopy = useCallback(async () => {
    if (!displayContent) return;
    try {
      await navigator.clipboard.writeText(displayContent);
      setCopied(true);
      toast.success(t('chat_copied'));
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t('error_generic'));
    }
  }, [displayContent, t]);

  if (message.role === 'system') {
    return (
      <div className="ef-system" role="status">
        {message.content}
      </div>
    );
  }

  const rowClass = `ef-bubble-row ${isUser ? 'user' : 'ai'}`;
  const bubbleClass = [
    'ef-bubble',
    isUser ? 'user' : 'ai',
    isFailed ? 'failed' : '',
    message.isStreaming && message.content ? 'ef-bubble-streaming' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const showActions = !isUser && (message.content || isFailed);

  return (
    <div className={rowClass}>
      <div
        className={bubbleClass}
        role="article"
        aria-label={`${message.role} message`}
      >
        {isStreaming ? (
          <div className="typing-indicator" aria-label={t('chat_typing')}>
            <span /><span /><span />
          </div>
        ) : (
          <>
            <div className="ef-bubble-content">{displayContent}</div>
            <div className="ef-meta">
              <span className="meta-time">{time}</span>
              {message.language && (
                <span className="meta-lang">{message.language.toUpperCase()}</span>
              )}
              {showActions && (
                <div className="ef-bubble-actions">
                  <button
                    type="button"
                    className="ef-bubble-action"
                    onClick={handleCopy}
                    aria-label={t('chat_copy')}
                    title={t('chat_copy')}
                  >
                    {copied ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                  {isAi && canRegenerate && onRegenerate && (
                    <button
                      type="button"
                      className="ef-bubble-action"
                      onClick={() => onRegenerate(message.id)}
                      aria-label={t('chat_regenerate')}
                      title={t('chat_regenerate')}
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
