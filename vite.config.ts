import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  assetsInclude: ['**/*.svg', '**/*.csv'],

  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (!req.url?.startsWith('/api/') && !req.url?.includes('.')) {
        req.url = '/index.html'
      }
      next()
    })
    server.middlewares.use((req, res, next) => {
      try {
        if (req.url?.startsWith('/api/chat/stream') && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => (body += chunk))
          req.on('end', () => {
            res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8')
            res.setHeader('Cache-Control', 'no-cache')
            res.writeHead(200)

            const isPidgin = /\b(abi|how far|how you dey|wey|na|e dey|no be|make we|una)\b/i.test(body)

            const reply = isPidgin
              ? "I dey hear you. Make we yarn — how you dey feel now?"
              : "I hear you. Tell me what's on your mind and I'll listen."

            const tokens = reply.split(/(\s+)/).filter(Boolean)
            let i = 0

            const iv = setInterval(() => {
              if (i < tokens.length) {
                res.write(JSON.stringify({ type: 'token', token: tokens[i] }) + '\n')
                i++
              } else {
                res.write(JSON.stringify({
                  type: 'done',
                  text: reply,
                  language: isPidgin ? 'pidgin' : 'en'
                }) + '\n')
                clearInterval(iv)
                res.end()
              }
            }, 120)
          })
          return
        }

        if (req.url?.startsWith('/api/chat') && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => (body += chunk))
          req.on('end', () => {
            const isPidgin = /\b(abi|how far|how you dey|wey|na|e dey|no be|make we|una)\b/i.test(body)

            const text = isPidgin
              ? "I hear you. Make we talk small. How you dey?"
              : "I hear you. I'm here to listen — tell me more."

            res.setHeader('Content-Type', 'application/json')
            res.writeHead(200)
            res.end(JSON.stringify({ text, language: isPidgin ? 'pidgin' : 'en' }))
          })
          return
        }
      } catch (e) {}

      next()
    })
  },
})