import Groq from 'groq-sdk'

const PREDEFINED_QA = [
  {
    question: 'What are my fundamental rights?',
    answer:
      'Your fundamental rights are the basic protections the Constitution gives you, like equality, freedom of expression, religion, education, and fair treatment under law. Why it matters: these rights protect your dignity and voice. Roman Urdu: bunyadi huqooq aap ko azaadi, izzat aur insaaf ka bunyadi tahaffuz dete hain. One small action: learn one right that affects your daily life, like education or freedom of expression, and read about it from an official source.',
  },
  {
    question: 'How does the National Assembly work?',
    answer:
      'The National Assembly is where elected representatives debate national issues, make laws, approve budgets, and question the government. Why it matters: it affects policies around education, jobs, transport, and public services. Roman Urdu: National Assembly mein awami numayanday qanoon sazi aur hukoomat se sawal karte hain. One small action: follow one Assembly discussion from a reliable news outlet or official parliamentary source so the process feels more real and less distant.',
  },
  {
    question: 'What is RTI law?',
    answer:
      'RTI means Right to Information. It allows citizens to request certain information from public bodies so government work can be more transparent. Why it matters: transparency helps people ask better questions and demand better services. Roman Urdu: RTI law aap ko maloomat maangne ka haq deta hai taake idaray jawabdeh rahen. One small action: look up whether your province has an RTI law and what kind of information can be requested from official departments.',
  },
  {
    question: 'Why should young people care about voting?',
    answer:
      'Voting matters because public decisions affect your education, jobs, internet freedom, safety, transport, and future opportunities. If young people stay disconnected, others make choices that still shape their lives. Roman Urdu: vote dena sirf siyasat nahin, apne mustaqbil par asar dalna hai. One small action: learn how voter registration works before election season so you are ready in time. Official election details should always be verified through the Election Commission or other official sources.',
  },
  {
    question: 'How can girls participate in civic life safely?',
    answer:
      'Girls can take part in civic life through school groups, community projects, awareness campaigns, volunteering, and verified online spaces while protecting privacy and setting boundaries. Why it matters: civic life is stronger when more voices are included. Roman Urdu: larkiyan bhi mehfooz tareeqay se apni awaaz civic life mein shamil kar sakti hain. One small action: join one trusted school, campus, or community activity and keep a support network of friends, family, or mentors around you.',
  },
  {
    question: 'What is misinformation?',
    answer:
      'Misinformation is false or misleading information shared as if it were true. It can spread through posts, clips, captions, or screenshots. Why it matters: bad information can shape opinions, fear, and voting choices unfairly. Roman Urdu: har viral cheez sach nahin hoti, is liye verify karna zaroori hai. One small action: before forwarding anything political or emotional, check the source, date, and whether a trusted outlet or official body confirms it.',
  },
]

const GENERIC_RESPONSE =
  'That is an important civic question. Simple explanation: civic awareness means understanding how rights, public institutions, and information affect daily life. Why it matters: informed citizens can ask better questions and participate more confidently. Roman Urdu: civic cheezon ko samajhna aap ko apni awaaz behtar tareeqay se istemal karne mein madad deta hai. One small action: ask your question again with a little more detail, like whether you mean voting, rights, misinformation, or government process. Official election or legal details should be verified through official sources.'

const SYSTEM_PROMPT = `You are Awaaz, a neutral civic awareness assistant for Gen Z users in Pakistan.

Explain civic concepts, rights, voting, public issues, misinformation, and democratic participation in simple language.
Stay politically neutral at all times.
Do not support or attack any political party, politician, or ideology.
Do not tell users who to vote for.
Keep answers concise, youth-friendly, and around 100 to 160 words.
Match the user's language naturally:
- If the user writes in English, reply in English.
- If the user writes in Roman Urdu, reply in Pakistani Roman Urdu.
- If the user writes in Urdu script, reply in Urdu script or Roman Urdu depending on the user's style.
- Do not mix Roman Urdu into English answers unless the user asks for it.
- Do not switch languages without a reason.
- Do not add translations in brackets unless the user asks for translation.
- Do not answer English greetings with Hindi, Urdu, or Roman Urdu wording.
For Roman Urdu, use Pakistani wording, not Hindi or Sanskritized wording.
Avoid words like:
- pramukh
- rajneeti
- chunav when election or intikhabat fits better
- use hukumat where natural instead of overly Indian phrasing
Prefer Pakistani Roman Urdu words like:
- siyasat / siyasi
- siyasatdan
- jamaat / party
- hukumat
- intikhabat
- qaumi assembly
- soobai assembly
- wazir-e-ala
- awaam
- haqooq
- qanoon
- idaray
For casual greetings or small talk like "hi", "hello", or "how are you", reply briefly, naturally, and warmly in the user's language.
For civic questions, use this structure when it fits:
1. Simple explanation
2. Why it matters
3. One small action
If the user's question is unclear, ask one short clarifying question instead of guessing.
Focus especially on young people, girls, first-time voters, and users who feel disconnected from politics.
When relevant, add a short note that official election or legal details should be verified through official sources.
If the user asks "X kon hai?" about a public figure, give a short neutral public-profile answer covering:
1. who they are
2. party or public role if known
3. current or notable position
Avoid opinionated claims.
If the question is about current politicians or elections, add: "Official/current details should be verified from reliable sources."
Keep the tone helpful, calm, and confident. Avoid cringe, slogans, or over-stylized wording.

Examples:
User: "how are you"
Answer: "I'm good — ready to help you understand civic topics in a simple way. Ask me about rights, voting, misinformation, or government."

User: "hi"
Answer: "Hi — what civic topic would you like help with?"

User: "aap kaisay ho"
Answer: "Main theek hoon. Aap kis civic topic par baat karna chahte hain?"

User: "بنیادی حقوق کیا ہیں"
Answer: "بنیادی حقوق woh bunyadi azadiyan aur tahaffuz hain jo qanoon aap ko deta hai..."

User: "maryam nawaz kon hai"
Answer: "Maryam Nawaz Pakistan ki siyasatdan hain. Woh Pakistan Muslim League-Nawaz (PML-N) se taluq rakhti hain aur Nawaz Sharif ki beti hain. Woh Punjab ki wazir-e-ala bhi hain. Official/current details should be verified from reliable sources."

Bad pattern to avoid:
User: "how are you"
Bad answer: "Main theek hoon" or mixed-language bracket translations.`

function normalizeQuestion(text) {
  return text.toLowerCase().replace(/[?.,!]/g, '').replace(/\s+/g, ' ').trim()
}

function detectInputStyle(text) {
  if (/[؀-ۿ]/.test(text)) {
    return 'urdu'
  }

  const normalized = text.toLowerCase()
  const romanUrduSignals = [
    ' kya ',
    ' ka ',
    ' ki ',
    ' ke ',
    ' hai',
    ' hain',
    ' ho ',
    ' kon ',
    ' kaisay ',
    ' kyun ',
    ' aap ',
    ' mera ',
    ' meri ',
    ' hum ',
    ' siyasat',
    ' haqooq',
    ' qanoon',
    ' hukumat',
    ' intikhabat',
  ]

  if (romanUrduSignals.some((signal) => ` ${normalized} `.includes(signal))) {
    return 'roman-urdu'
  }

  return 'english'
}

function preserveCase(original, replacement) {
  if (original.toUpperCase() === original) {
    return replacement.toUpperCase()
  }

  if (original[0] && original[0] === original[0].toUpperCase()) {
    return replacement[0].toUpperCase() + replacement.slice(1)
  }

  return replacement
}

function replaceWithCase(text, pattern, replacement) {
  return text.replace(pattern, (match) => preserveCase(match, replacement))
}

function sanitizePakistaniRomanUrdu(text) {
  let sanitized = text

  const replacements = [
    [/\bdesh\b/gi, 'mulk'],
    [/\bpramukh\b/gi, 'aham'],
    [/\brajneeti\b/gi, 'siyasat'],
    [/\brajnitik\b/gi, 'siyasi'],
    [/\bneta\b/gi, 'siyasatdan'],
    [/\bchunav\b/gi, 'intikhabat'],
    [/\bsarkar\b/gi, 'hukumat'],
    [/\bjanata\b/gi, 'awaam'],
    [/\bkanun\b/gi, 'qanoon'],
    [/\badhikar\b/gi, 'haqooq'],
    [/\bpratinidhi\b/gi, 'numayanday'],
    [/\bmukhya mantri\b/gi, 'wazir-e-ala'],
    [/\bvidhan sabha\b/gi, 'soobai assembly'],
    [/\bloksabha\b/gi, 'qaumi assembly'],
    [/\blok sabha\b/gi, 'qaumi assembly'],
  ]

  for (const [pattern, replacement] of replacements) {
    sanitized = replaceWithCase(sanitized, pattern, replacement)
  }

  sanitized = sanitized
    .replace(/\bqaumi assembly ke representatives\b/gi, 'qaumi assembly ke numayanday')
    .replace(/\bsoobai assembly ke representatives\b/gi, 'soobai assembly ke numayanday')
    .replace(/\brepresentatives\b/gi, 'numayanday')

  return sanitized
}

const QA_LOOKUP = new Map(
  PREDEFINED_QA.map((item) => [normalizeQuestion(item.question), item.answer]),
)

export function findMockReply(message) {
  const normalized = normalizeQuestion(message || '')

  if (!normalized) {
    return 'Salam! Ask me about rights, voting, laws, public institutions, girls in civic life, or misinformation. Roman Urdu bhi theek hai.'
  }

  return QA_LOOKUP.get(normalized) || GENERIC_RESPONSE
}

export async function buildChatReply(message) {
  const trimmed = typeof message === 'string' ? message.trim() : ''
  const hasGroqKey = Boolean(process.env.GROQ_API_KEY)
  const inputStyle = detectInputStyle(trimmed)

  console.log('[Awaaz API] Incoming chat request', {
    hasMessage: Boolean(trimmed),
    hasGroqKey,
    inputStyle,
  })

  if (!trimmed) {
    console.log('[Awaaz API] Using fallback response', {
      source: 'mock',
      reason: 'empty_message',
    })

    return {
      reply: findMockReply(''),
      source: 'mock',
      reason: 'empty_message',
    }
  }

  if (!hasGroqKey) {
    console.log('[Awaaz API] Using fallback response', {
      source: 'mock',
      reason: 'missing_api_key',
    })

    return {
      reply: findMockReply(trimmed),
      source: 'mock',
      reason: 'missing_api_key',
    }
  }

  try {
    console.log('[Awaaz API] Attempting Groq API request')

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      temperature: 0.4,
      max_tokens: 240,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: trimmed },
      ],
    })

    const rawReply = completion.choices?.[0]?.message?.content?.trim()
    const reply =
      inputStyle === 'roman-urdu' && rawReply
        ? sanitizePakistaniRomanUrdu(rawReply)
        : rawReply

    if (!reply) {
      console.log('[Awaaz API] Using fallback response', {
        source: 'mock',
        reason: 'empty_model_response',
      })

      return {
        reply: findMockReply(trimmed),
        source: 'mock',
        reason: 'empty_model_response',
      }
    }

    console.log('[Awaaz API] Returning Groq response', {
      source: 'groq',
      hasReply: true,
      inputStyle,
    })

    return {
      reply,
      source: 'groq',
    }
  } catch (error) {
    console.error('[Awaaz API] Groq chat request failed:', {
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : 'UnknownError',
    })
    console.log('[Awaaz API] Using fallback response', {
      source: 'mock',
      reason: 'groq_error',
    })

    return {
      reply: findMockReply(trimmed),
      source: 'mock',
      reason: 'groq_error',
    }
  }
}
