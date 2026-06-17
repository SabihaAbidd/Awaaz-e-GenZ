import { generateQuizQuestions } from './quiz-core.js'

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
  const excludeQuestions = Array.isArray(body?.excludeQuestions) ? body.excludeQuestions : []
  const result = await generateQuizQuestions(excludeQuestions)

  console.log('[Quiz API] Sending response to frontend', {
    source: result.source,
    reason: result.reason ?? null,
  })

  res.status(200).json(result)
}
