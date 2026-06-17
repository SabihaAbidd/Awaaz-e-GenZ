import { buildChatReply } from './chat-core.js'

function readMessage(body) {
  if (!body) return ''

  if (typeof body === 'string') {
    try {
      const parsed = JSON.parse(body)
      return typeof parsed?.message === 'string' ? parsed.message : ''
    } catch {
      return ''
    }
  }

  return typeof body.message === 'string' ? body.message : ''
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const message = readMessage(req.body)
  const result = await buildChatReply(message)

  console.log('[Awaaz API] Sending response to frontend', {
    source: result.source,
    reason: result.reason ?? null,
  })

  res.status(200).json(result)
}
