import { createServer } from 'node:http'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { Buffer } from 'node:buffer'
import process from 'node:process'

const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses'
const XAI_RESPONSES_URL = 'https://api.x.ai/v1/responses'
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'
const DEFAULT_OPENAI_MODEL = 'gpt-4.1'
const DEFAULT_XAI_MODEL = 'grok-4.3'
const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash'
const MAX_TOKENS = 1000
const AWAAZ_SYSTEM_PROMPT =
  "You are Awaaz, a bilingual (English / Roman Urdu) civic guide for young Pakistanis. Explain rights, elections, RTI, and how local/federal government works in simple, friendly language with no jargon. Mirror the user's language: if they write in Roman Urdu, reply in Roman Urdu; if English, reply in English. Never recommend a specific political party or candidate — instead explain how to evaluate candidates based on issues, track record, and credibility. For real-life civic problems (broken streetlights, garbage, water, harassment, etc.), tell the user to use Civic SOS in this app to get a ready-to-send action plan, rather than trying to solve it fully in chat. Never invent phone numbers, laws, or facts you're not sure of — say you're not certain instead. This is general civic information, not legal advice."

const MODE_PROMPTS = {
  accountability:
    "You are Awaaz's accountability lookup assistant for Pakistan. The user will provide a neighborhood/city and issue. Explain which elected/administrative offices are usually responsible, such as UC/local government, town/municipal authority, MPA, MNA, cantonment board, WASA, solid waste board, police, or development authority. If you know exact current names, office numbers, or public social handles with confidence, include them and label them as needs verification. If you are not sure, do not invent names, phone numbers, handles, or URLs. Instead give official places to verify them and a short checklist for finding the exact representative. Return concise sections: Likely responsible offices, What to verify, Contact script, Next step.",
  complaint:
    "You are Awaaz's civic complaint drafting assistant. Convert the user's everyday issue into a formal, ready-to-submit complaint for municipal/PMDU-style portals. Return both English and Urdu/Roman Urdu versions. Include subject, location placeholder if missing, issue summary, impact on citizens, requested action, evidence checklist, and a polite closing. Do not invent complaint numbers, phone numbers, laws, portal links, or exact departments if uncertain. If the responsible department is uncertain, say likely department and ask user to verify.",
  toolkit:
    "You are Awaaz's urgent local issue toolkit assistant. Make a practical step-by-step action toolkit for Pakistan civic problems like broken pipes, trash piles, unsafe streetlights, harassment, road damage, or sewage. Include immediate safety steps, evidence to collect, likely department type, escalation path, WhatsApp-ready message, and what not to do. Do not invent official contacts. If exact contacts are not known, tell the user how to find the correct verified number.",
  dejargon:
    "You are Awaaz's de-jargonizer. Your job is to take complex legal text, laws, notifications, or budget snippets in Pakistan and output a clear, friendly breakdown strictly in Pakistani Roman Urdu. You MUST explain the meaning using a cricket analogy (e.g., comparing the government/departments to players, captain, or umpires, and the rules to matches, pitches, or boundaries). Keep it fun, simple, and highly relatable for young Pakistanis. Do not use expensive lawyer jargon. Clarify that this is general information, not legal advice.",
  startup:
    "You are Awaaz's Legal & Civic Startup Concierge for Pakistan's young entrepreneurs. Explain business registration (SECP registration, sole proprietorship, partnership), FBR tax filing (active filer status, NTN registration), and local municipal permits (food safety, Cantonment Board approvals) in simple, step-by-step language. Mirror the user's language (English or Roman Urdu). Avoid expensive lawyer jargon. Always clarify that this is general guidance, not formal legal or financial advice, and provide precise checklists, requirements, and typical timelines for Pakistan.",
}

loadEnvFile('.env')
loadEnvFile('.env.local')

const PORT = Number(process.env.AI_SERVER_PORT || 8787)

function loadEnvFile(fileName) {
  const filePath = resolve(process.cwd(), fileName)
  if (!existsSync(filePath)) return

  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex === -1) continue

    const key = trimmed.slice(0, separatorIndex).trim()
    const rawValue = trimmed.slice(separatorIndex + 1).trim()
    const value = rawValue.replace(/^['"]|['"]$/g, '')

    if (key && process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  })
  response.end(JSON.stringify(payload))
}

async function readJsonBody(request) {
  const chunks = []
  for await (const chunk of request) {
    chunks.push(chunk)
  }

  if (!chunks.length) return {}

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw new Error('Request body must be valid JSON.')
  }
}

function configuredValue(name) {
  const value = process.env[name]?.trim()

  if (!value || value.startsWith('replace_with_')) {
    return ''
  }

  return value
}

function getSystemPrompt(mode) {
  return MODE_PROMPTS[mode] || AWAAZ_SYSTEM_PROMPT
}

function normalizeHistoryMessage(message) {
  if (!message || typeof message.text !== 'string') return null

  const content = message.text.trim()
  if (!content) return null

  return {
    role: message.role === 'bot' || message.role === 'assistant' ? 'assistant' : 'user',
    content,
  }
}

function buildChatMessages(body) {
  const history = Array.isArray(body.history)
    ? body.history.map(normalizeHistoryMessage).filter(Boolean)
    : []
  const question = buildUserContent(body)

  if (!question) {
    throw new Error('Question is required.')
  }

  const lastMessage = history[history.length - 1]
  if (!lastMessage || lastMessage.role !== 'user' || lastMessage.content !== question) {
    history.push({
      role: 'user',
      content: question,
    })
  }

  return history.slice(-10)
}

function buildUserContent(body) {
  const question = typeof body.question === 'string' ? body.question.trim() : ''
  const context = body.context && typeof body.context === 'object'
    ? `\n\nContext:\n${JSON.stringify(body.context, null, 2)}`
    : ''

  return `${question}${context}`.trim()
}

function extractOpenAIText(payload) {
  if (typeof payload.output_text === 'string' && payload.output_text.trim()) {
    return payload.output_text.trim()
  }

  const parts = []
  for (const output of payload.output || []) {
    for (const content of output.content || []) {
      if (content.type === 'output_text' && content.text) {
        parts.push(content.text)
      }
    }
  }

  return parts.join('\n').trim()
}

function extractGeminiText(payload) {
  return (payload.candidates || [])
    .flatMap((candidate) => candidate?.content?.parts || [])
    .filter((part) => typeof part?.text === 'string')
    .map((part) => part.text)
    .join('\n')
    .trim()
}

async function callOpenAI(body) {
  const apiKey = configuredValue('OPENAI_API_KEY')
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured.')
  }

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL,
      instructions: getSystemPrompt(body.mode),
      input: buildChatMessages(body),
      max_output_tokens: MAX_TOKENS,
    }),
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = payload?.error?.message || `OpenAI API returned ${response.status}`
    throw new Error(message)
  }

  const text = extractOpenAIText(payload)
  if (!text) {
    throw new Error('OpenAI response did not include readable text.')
  }

  return text
}

async function callGrok(body) {
  const apiKey = configuredValue('XAI_API_KEY')
  if (!apiKey) {
    throw new Error('XAI_API_KEY is not configured.')
  }

  const response = await fetch(XAI_RESPONSES_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.XAI_MODEL || DEFAULT_XAI_MODEL,
      input: [
        {
          role: 'system',
          content: getSystemPrompt(body.mode),
        },
        ...buildChatMessages(body),
      ],
      max_output_tokens: MAX_TOKENS,
    }),
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    const apiError = payload?.error || payload
    const message = typeof apiError?.message === 'string'
      ? apiError.message
      : JSON.stringify(apiError)
    throw new Error(message)
  }

  const text = extractOpenAIText(payload)
  if (!text) {
    throw new Error('Grok response did not include readable text.')
  }

  return text
}

async function callGroq(body) {
  const apiKey = configuredValue('GROQ_API_KEY') || configuredValue('XAI_API_KEY')
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured.')
  }

  const model = process.env.XAI_MODEL && process.env.XAI_MODEL.startsWith('llama')
    ? process.env.XAI_MODEL
    : 'llama-3.3-70b-versatile'

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: getSystemPrompt(body.mode),
        },
        ...buildChatMessages(body),
      ],
      max_tokens: MAX_TOKENS,
    }),
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    const apiError = payload?.error || payload
    const message = typeof apiError?.message === 'string'
      ? apiError.message
      : JSON.stringify(apiError)
    throw new Error(message)
  }

  const text = payload.choices?.[0]?.message?.content
  if (!text) {
    throw new Error('Groq response did not include readable text.')
  }

  return text.trim()
}

async function callGemini(body) {
  const apiKey = configuredValue('GEMINI_API_KEY')
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured.')
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL
  const url = `${GEMINI_API_BASE}/${encodeURIComponent(model)}:generateContent`
  const messages = buildChatMessages(body).map((message) => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: message.content }],
  }))

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'x-goog-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: getSystemPrompt(body.mode) }],
      },
      contents: messages,
      generationConfig: {
        maxOutputTokens: MAX_TOKENS,
      },
    }),
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = payload?.error?.message || `Gemini API returned ${response.status}`
    throw new Error(message)
  }

  const text = extractGeminiText(payload)
  if (!text) {
    throw new Error('Gemini response did not include readable text.')
  }

  return text
}

function getConfiguredProviders() {
  const configuredProviders = process.env.AI_PROVIDER_ORDER || process.env.AI_PROVIDER

  if (configuredProviders) {
    return configuredProviders
      .split(',')
      .map((provider) => provider.trim().toLowerCase())
      .filter(Boolean)
  }

  if (configuredValue('GROQ_API_KEY')) {
    return ['grok']
  }

  if (configuredValue('XAI_API_KEY')) {
    return ['grok']
  }

  if (configuredValue('GEMINI_API_KEY')) {
    return ['gemini']
  }

  return ['openai']
}

async function callConfiguredProvider(body) {
  const providers = getConfiguredProviders()
  const errors = []

  for (const provider of providers) {
    try {
      if (provider === 'gemini') {
        return await callGemini(body)
      }

      if (provider === 'grok' || provider === 'xai') {
        const apiKey = configuredValue('GROQ_API_KEY') || configuredValue('XAI_API_KEY')
        if (apiKey && apiKey.startsWith('gsk_')) {
          return await callGroq(body)
        }
        return await callGrok(body)
      }

      if (provider === 'openai') {
        return await callOpenAI(body)
      }

      throw new Error('unknown provider')
    } catch (error) {
      errors.push(`${provider}: ${error.message || 'failed'}`)
    }
  }

  throw new Error(`All AI providers failed. ${errors.join(' | ')}`)
}

async function handleAskAwaazRequest(request, response) {
  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {})
    return
  }

  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'Method not allowed.' })
    return
  }

  try {
    const body = await readJsonBody(request)
    const reply = await callConfiguredProvider(body)
    sendJson(response, 200, { reply })
  } catch (error) {
    sendJson(response, 500, {
      error: error.message || 'AI request failed.',
    })
  }
}

const server = createServer((request, response) => {
  if (request.url?.startsWith('/api/ask-awaaz')) {
    handleAskAwaazRequest(request, response)
    return
  }

  sendJson(response, 404, { error: 'Not found.' })
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Awaaz AI server listening on http://127.0.0.1:${PORT}`)
})
