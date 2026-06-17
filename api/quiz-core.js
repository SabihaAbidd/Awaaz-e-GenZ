import Groq from 'groq-sdk'
import { QUIZ_FALLBACK_QUESTIONS } from '../src/data/quizFallback.js'

const MAX_EXCLUDED_QUESTIONS = 12

const QUIZ_SYSTEM_PROMPT = `You are generating a civic education quiz for Gen Z users in Pakistan.

Return exactly 5 multiple-choice questions as valid JSON only.

Rules:
- Politically neutral.
- No party or politician support.
- Focus on civic education, rights, voting, public institutions, misinformation, and participation.
- Questions should be simple and useful.
- Each question must have 4 options.
- correctAnswer must exactly match one of the options.
- explanation should be 1-2 short sentences.
- No markdown.
- No text outside JSON.

Return this structure:
{
  "questions": [
    {
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "correctAnswer": "...",
      "explanation": "...",
      "category": "...",
      "difficulty": "easy"
    }
  ]
}`

function normalizeQuestionId(text, index) {
  const slug = String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug || `quiz-question-${index + 1}`
}

function fallbackResult(reason) {
  return {
    questions: QUIZ_FALLBACK_QUESTIONS,
    source: 'fallback',
    reason,
  }
}

function normalizeExcludedQuestions(excludeQuestions) {
  if (!Array.isArray(excludeQuestions)) return []

  return excludeQuestions
    .filter((question) => typeof question === 'string')
    .map((question) => question.trim())
    .filter(Boolean)
    .slice(0, MAX_EXCLUDED_QUESTIONS)
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

function validateQuestion(question, index) {
  if (!question || typeof question !== 'object') return null

  const questionText = typeof question.question === 'string' ? question.question.trim() : ''
  const options = Array.isArray(question.options)
    ? question.options.filter((option) => typeof option === 'string').map((option) => option.trim())
    : []
  const correctAnswer = typeof question.correctAnswer === 'string' ? question.correctAnswer.trim() : ''
  const explanation = typeof question.explanation === 'string' ? question.explanation.trim() : ''
  const category = typeof question.category === 'string' ? question.category.trim() : ''
  const difficulty = question.difficulty === 'medium' ? 'medium' : question.difficulty === 'easy' ? 'easy' : null

  if (!questionText || options.length !== 4 || !correctAnswer || !explanation || !category || !difficulty) {
    return null
  }

  if (!options.includes(correctAnswer)) {
    return null
  }

  return {
    id: normalizeQuestionId(questionText, index),
    question: questionText,
    options,
    correctAnswer,
    explanation,
    category,
    difficulty,
  }
}

function parseQuizResponse(content) {
  const jsonText = extractJsonObject(content)

  if (!jsonText) return null

  let parsed

  try {
    parsed = JSON.parse(jsonText)
  } catch {
    return null
  }

  if (!parsed || !Array.isArray(parsed.questions) || parsed.questions.length !== 5) {
    return null
  }

  const validated = parsed.questions
    .map((question, index) => validateQuestion(question, index))
    .filter(Boolean)

  if (validated.length !== 5) {
    return null
  }

  return validated
}

export async function generateQuizQuestions(excludeQuestions = []) {
  const hasGroqKey = Boolean(process.env.GROQ_API_KEY)
  const normalizedExcludedQuestions = normalizeExcludedQuestions(excludeQuestions)

  console.log('[Quiz API] Incoming quiz generation request', {
    hasGroqKey,
    excludedCount: normalizedExcludedQuestions.length,
  })

  if (!hasGroqKey) {
    console.log('[Quiz API] Using fallback questions', {
      reason: 'missing_api_key',
    })

    return fallbackResult('missing_api_key')
  }

  try {
    console.log('[Quiz API] Attempting Groq quiz generation')

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      temperature: 0.5,
      max_tokens: 900,
      messages: [
        { role: 'system', content: QUIZ_SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            'Generate 5 fresh Pakistan civic quiz questions for Gen Z users.',
            'Cover topics like voting age, fundamental rights, Constitution of Pakistan, Article 25-A, RTI, misinformation, National Assembly, Senate, local government, public services, and peaceful civic participation.',
            normalizedExcludedQuestions.length > 0
              ? `Avoid repeating, paraphrasing, or closely rewording these recent questions:\n- ${normalizedExcludedQuestions.join('\n- ')}`
              : 'Make the set varied and avoid repeating common question wording from one quiz to the next.',
          ].join('\n\n'),
        },
      ],
    })

    const content = completion.choices?.[0]?.message?.content?.trim()
    const questions = parseQuizResponse(content)

    if (!questions) {
      console.log('[Quiz API] Using fallback questions', {
        reason: 'invalid_ai_json',
      })

      return fallbackResult('invalid_ai_json')
    }

    console.log('[Quiz API] Returning AI-generated quiz', {
      source: 'ai',
      count: questions.length,
    })

    return {
      questions,
      source: 'ai',
    }
  } catch (error) {
    console.error('[Quiz API] Groq quiz generation failed:', {
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : 'UnknownError',
    })
    console.log('[Quiz API] Using fallback questions', {
      reason: 'groq_error',
    })

    return fallbackResult('groq_error')
  }
}
