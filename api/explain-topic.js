import { buildTopicExplanation } from './explain-topic-core.js'

async function readRequestBody(req) {
  return new Promise((resolve) => {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk
    })

    req.on('end', () => {
      if (!body) {
        resolve({})
        return
      }

      try {
        resolve(JSON.parse(body))
      } catch {
        resolve({})
      }
    })
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const body = await readRequestBody(req)
  const topicId = typeof body?.topicId === 'string' ? body.topicId : ''
  const language = typeof body?.language === 'string' ? body.language : 'english'
  const result = await buildTopicExplanation({ topicId, language })

  console.log('[Learn API] Sending explain-topic response', {
    topicId,
    language,
    source: result.source,
    reason: result.reason ?? null,
  })

  res.status(200).json(result)
}
