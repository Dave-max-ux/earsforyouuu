import type { SendMessagePayload, StreamMeta } from './types';

export async function sendMessage(payload: SendMessagePayload) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: (payload.history ?? [{ role: 'user' as const, content: payload.content }]).map(
        (m) => ({ role: m.role, text: m.content })
      ),
    }),
  });
  if (!res.ok) throw new Error('Chat API error');
  return res.json();
}

export async function receiveStream(
  payload: SendMessagePayload,
  onToken: (token: string) => void,
  onDone?: (meta?: StreamMeta) => void
) {
  const history = payload.history?.length
    ? payload.history.map((m) => ({ role: m.role, text: m.content }))
    : [{ role: 'user', text: payload.content }];

  const res = await fetch('/api/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: history, sessionId: payload.sessionId }),
  });

  if (!res.ok) throw new Error('Stream not available');
  if (!res.body) throw new Error('No stream body');

  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += dec.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const obj = JSON.parse(line);
        if (obj.type === 'token') onToken(obj.token);
        if (obj.type === 'done' && onDone) onDone({ text: obj.text, language: obj.language });
      } catch {
        // ignore malformed lines
      }
    }
  }
}
