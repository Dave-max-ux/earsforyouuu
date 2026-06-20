import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
  // Dev-only mock endpoints for chat streaming to support frontend development without backend
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      try {
        if (req.url?.startsWith('/api/chat/stream') && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => (body += chunk));
          req.on('end', () => {
            res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
            res.setHeader('Cache-Control', 'no-cache');
            res.writeHead(200);

            // simple language heuristic to return pidgin or english example
            const isPidgin = /\b(abi|how far|how you dey|wey|na|e dey|no be|make we|una)\b/i.test(body);
            const reply = isPidgin
              ? "I dey hear you. Make we yarn — how you dey feel now?"
              : "I hear you. Tell me what's on your mind and I'll listen.";

            const tokens = reply.split(/(\s+)/).filter(Boolean);
            let i = 0;

            const iv = setInterval(() => {
              if (i < tokens.length) {
                res.write(JSON.stringify({ type: 'token', token: tokens[i] }) + '\n');
                i += 1;
              } else {
                res.write(JSON.stringify({ type: 'done', text: reply, language: isPidgin ? 'pidgin' : 'en' }) + '\n');
                clearInterval(iv);
                res.end();
              }
            }, 120);
          });
          return;
        }

        if (req.url?.startsWith('/api/chat') && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => (body += chunk));
          req.on('end', () => {
            // simple fallback: echo a friendly message
            const isPidgin = /\b(abi|how far|how you dey|wey|na|e dey|no be|make we|una)\b/i.test(body);
            const text = isPidgin
              ? "I hear you. Make we talk small. How you dey?"
              : "I hear you. I'm here to listen — tell me more.";
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(200);
            res.end(JSON.stringify({ text, language: isPidgin ? 'pidgin' : 'en' }));
          });
          return;
        }
      } catch (e) {
        // fall through to next
      }
      next();
    });
  },
})
