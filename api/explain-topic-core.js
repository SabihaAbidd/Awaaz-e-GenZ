import Groq from 'groq-sdk'
import { getLearnTopicById } from '../src/data/learnTopics.js'

const SYSTEM_PROMPT = `You are Awaaz, a neutral civic education assistant for Gen Z users in Pakistan.

Explain the selected civic topic in simple, relatable language.
Stay politically neutral at all times.
Do not recommend, support, or attack any political party, politician, or ideology.
Keep the answer concise, useful, and easy to understand.
If the requested language is English, answer in clear English only.
If the requested language is Pakistani Roman Urdu, answer in Pakistani Roman Urdu only.
For Roman Urdu:
- Avoid Hindi or Sanskritized wording.
- Prefer Pakistani wording like haqooq, qanoon, hukumat, intikhabat, awaam, idaray.
- Do not use words like pramukh, rajneeti, or awkward Hindi-style phrasing.

Return valid JSON only with this exact structure:
{
  "simpleExplanation": "string",
  "whyItMatters": "string",
  "realLifeExample": "string",
  "oneSmallAction": "string"
}

Do not return markdown.
Do not return text outside JSON.`

function getFallbackExplanation(topic, language) {
  if (!topic) return null

  const key = language === 'roman-urdu' ? 'romanUrdu' : 'english'
  return topic.fallback?.[key] ?? topic.fallback?.english ?? null
}

function extractJsonObject(text) {
  const trimmed = String(text || '').trim()
  if (!trimmed) return null

  const firstBrace = trimmed.indexOf('{')
  const lastBrace = trimmed.lastIndexOf('}')

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return null
  }

  return trimmed.slice(firstBrace, lastBrace + 1)
}

function validateExplanation(payload) {
  if (!payload || typeof payload !== 'object') return null

  const simpleExplanation =
    typeof payload.simpleExplanation === 'string' ? payload.simpleExplanation.trim() : ''
  const whyItMatters = typeof payload.whyItMatters === 'string' ? payload.whyItMatters.trim() : ''
  const realLifeExample =
    typeof payload.realLifeExample === 'string' ? payload.realLifeExample.trim() : ''
  const oneSmallAction =
    typeof payload.oneSmallAction === 'string' ? payload.oneSmallAction.trim() : ''

  if (!simpleExplanation || !whyItMatters || !realLifeExample || !oneSmallAction) {
    return null
  }

  return {
    simpleExplanation,
    whyItMatters,
    realLifeExample,
    oneSmallAction,
  }
}

function parseExplanation(content) {
  const jsonText = extractJsonObject(content)
  if (!jsonText) return null

  try {
    return validateExplanation(JSON.parse(jsonText))
  } catch {
    return null
  }
}

function buildFallbackResult(topic, language, reason) {
  return {
    explanation: getFallbackExplanation(topic, language),
    source: 'fallback',
    reason,
  }
}

export async function buildTopicExplanation({ topicId, language }) {
  const topic = getLearnTopicById(topicId)
  const normalizedLanguage = language === 'roman-urdu' ? 'roman-urdu' : 'english'
  const hasGroqKey = Boolean(process.env.GROQ_API_KEY)

  console.log('[Learn API] Incoming explain-topic request', {
    topicId,
    hasTopic: Boolean(topic),
    language: normalizedLanguage,
    hasGroqKey,
  })

  if (!topic) {
    return {
      explanation: null,
      source: 'fallback',
      reason: 'invalid_topic',
    }
  }

  if (!hasGroqKey) {
    console.log('[Learn API] Using fallback explanation', {
      reason: 'missing_api_key',
      topicId,
    })
    return buildFallbackResult(topic, normalizedLanguage, 'missing_api_key')
  }

  try {
    console.log('[Learn API] Attempting Groq topic explanation', {
      topicId,
      language: normalizedLanguage,
    })

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      temperature: 0.4,
      max_tokens: 350,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            `Topic: ${topic.title}`,
            `Category: ${topic.category}`,
            `Static summary: ${topic.summary}`,
            `Requested language: ${normalizedLanguage === 'roman-urdu' ? 'Pakistani Roman Urdu' : 'English'}`,
            'Explain this for a Gen Z user in Pakistan. Keep it clear, simple, and practical.',
          ].join('\n'),
        },
      ],
    })

    const content = completion.choices?.[0]?.message?.content?.trim()
    const explanation = parseExplanation(content)

    if (!explanation) {
      console.log('[Learn API] Using fallback explanation', {
        reason: 'invalid_ai_json',
        topicId,
      })
      return buildFallbackResult(topic, normalizedLanguage, 'invalid_ai_json')
    }

    console.log('[Learn API] Returning AI explanation', {
      source: 'ai',
      topicId,
      language: normalizedLanguage,
    })

    return {
      explanation,
      source: 'ai',
    }
  } catch (error) {
    console.error('[Learn API] Groq explanation failed:', {
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : 'UnknownError',
      topicId,
    })

    console.log('[Learn API] Using fallback explanation', {
      reason: 'groq_error',
      topicId,
    })

    return buildFallbackResult(topic, normalizedLanguage, 'groq_error')
  }
}
