import Groq from 'groq-sdk'

// ─── System Prompts ──────────────────────────────────────────────────────────

const AWAAZ_SYSTEM_PROMPT =
  "You are Awaaz, a bilingual (English / Roman Urdu) civic guide for young Pakistanis. Explain rights, elections, RTI, and how local/federal government works in simple, friendly language with no jargon. Mirror the user's language: if they write in Roman Urdu, reply in Roman Urdu; if English, reply in English. Never recommend a specific political party or candidate — instead explain how to evaluate candidates based on issues, track record, and credibility. For real-life civic problems (broken streetlights, garbage, water, harassment, etc.), tell the user to use Civic SOS in this app to get a ready-to-send action plan, rather than trying to solve it fully in chat. Never invent phone numbers, laws, or facts you're not sure of — say you're not certain instead. This is general civic information, not legal advice."

const MODE_PROMPTS = {
  accountability:
    "You are Awaaz's accountability lookup assistant for Pakistan. The user will provide a neighborhood/city and issue. Explain which elected/administrative offices are usually responsible, such as UC/local government, town/municipal authority, MPA, MNA, cantonment board, WASA, solid waste board, police, or development authority. If you know exact current names, office numbers, or public social handles with confidence, include them and label them as 'needs verification'. If you are not sure, do not invent names, phone numbers, handles, or URLs. Instead give official places to verify them and a short checklist for finding the exact representative. Return concise sections: Likely responsible offices, What to verify, Contact script, Next step.",
  complaint:
    "You are Awaaz's civic complaint drafting assistant. Convert the user's everyday issue into a formal, ready-to-submit complaint for municipal/PMDU-style portals. Return both English and Urdu/Roman Urdu versions. Include subject, location placeholder if missing, issue summary, impact on citizens, requested action, evidence checklist, and a polite closing. Do not invent complaint numbers, phone numbers, laws, portal links, or exact departments if uncertain. If the responsible department is uncertain, say 'likely department' and ask user to verify.",
  toolkit:
    "You are Awaaz's urgent local issue toolkit assistant. Make a practical step-by-step action toolkit for Pakistan civic problems like broken pipes, trash piles, unsafe streetlights, harassment, road damage, or sewage. Include immediate safety steps, evidence to collect, likely department type, escalation path, WhatsApp-ready message, and what not to do. Do not invent official contacts. If exact contacts are not known, tell the user how to find the correct verified number.",
  dejargon:
    "You are Awaaz's de-jargonizer. Your job is to take complex legal text, laws, notifications, or budget snippets in Pakistan and output a clear, friendly breakdown strictly in Pakistani Roman Urdu. You MUST explain the meaning using a cricket analogy (e.g., comparing the government/departments to players, captain, or umpires, and the rules to matches, pitches, or boundaries). Keep it fun, simple, and highly relatable for young Pakistanis. Do not use expensive lawyer jargon. Clarify that this is general information, not legal advice.",
  startup:
    "You are Awaaz's Legal & Civic Startup Concierge for Pakistan's young entrepreneurs. Explain business registration (SECP registration, sole proprietorship, partnership), FBR tax filing (active filer status, NTN registration), and local municipal permits (food safety, Cantonment Board approvals) in simple, step-by-step language. Mirror the user's language (English or Roman Urdu). Avoid expensive lawyer jargon. Always clarify that this is general guidance, not formal legal or financial advice, and provide precise checklists, requirements, and typical timelines for Pakistan.",
}

// ─── Fallback replies (no API key needed) ────────────────────────────────────

const FALLBACKS = {
  accountability:
    "Likely responsible offices for most civic issues:\n• Local Government / Union Council (UC)\n• District Municipal Corporation (DMC)\n• Tehsil Municipal Administration (TMA)\n• Relevant MPA / MNA\n\nNext step: Search '[your city] municipal complaint portal' or visit City Hall.",
  complaint:
    "COMPLAINT DRAFT (English):\nSubject: Civic Issue Report — [Your Area]\n\nRespected Sir/Madam,\nI wish to report [describe issue] at [location]. This affects daily life because [impact]. Kindly arrange for immediate action.\n\nYours sincerely,\n[Your Name]\n\n---\nشکایت (Roman Urdu):\nMohtaram, main [masla] report karna chahta/chahti hoon jo [jagah] par hai. Please action lijiey.",
  toolkit:
    "Quick Action Toolkit:\n1. Document the issue — take photos/video with date & location\n2. Note GPS coordinates or landmark address\n3. File a complaint on your city's app (e.g., Lahore: 1139, Karachi: 1339, Islamabad: 1334)\n4. Share on social media tagging @YourCityGovt\n5. Follow up after 48–72 hours if no response",
  dejargon:
    "Yeh jo aap ne paste kiya hai, isko ek cricket match ki tarah samjhain:\n• Hukumat = Team Captain\n• Qanoon = Match ke rules\n• Shehri = Crowd jo score rakh raha hai\n\nIssi tarah yeh notice keh raha hai ke game ke rules thore change ho gaye hain — matlab aap ke rights ya zimmedarian thori badal sakti hain. Yeh sirf general maloomat hai, legal advice nahin.",
  startup:
    "SECP Private Limited Company Steps (Pakistan):\n1. Check name availability on SECP eServices portal\n2. Apply for name reservation (Rs. 200 fee)\n3. Get Digital Signature Certificate (DSC)\n4. Register company online via SECP eServices\n5. Minimum paid-up capital: Rs. 100,000\n6. Total approx cost: Rs. 10,000–15,000\n7. After SECP: Register with FBR for NTN (free)\n\n*This is general guidance, not legal advice.*",
  default:
    "Awaaz AI — Demo Mode:\n\nMain abhi live AI se connect nahin ho pa raha. Lekin yeh yaad rakhein:\n• Apne rights janein — Constitution of Pakistan, Part II\n• Vote register karein — ECP website par\n• Civic issue? Civic SOS tab use karein!\n\nFor live answers, please ensure the API server is running.",
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSystemPrompt(mode) {
  return MODE_PROMPTS[mode] || AWAAZ_SYSTEM_PROMPT
}

function getFallback(mode) {
  return FALLBACKS[mode] || FALLBACKS.default
}

function buildMessages(mode, question, history) {
  const systemPrompt = getSystemPrompt(mode)
  const messages = [{ role: 'system', content: systemPrompt }]

  if (Array.isArray(history)) {
    for (const msg of history.slice(-6)) {
      if (msg?.role === 'user' && msg?.text) {
        messages.push({ role: 'user', content: msg.text })
      } else if (msg?.role === 'bot' && msg?.text) {
        messages.push({ role: 'assistant', content: msg.text })
      }
    }
  }

  messages.push({ role: 'user', content: question })
  return messages
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const body = req.body || {}
  const { mode, question, text, tone, history } = body

  // Support both "question" (chat/startup) and "text" (dejargon/sos tools)
  const userInput = (question || text || '').trim()

  if (!userInput) {
    res.status(400).json({ error: 'No question or text provided.' })
    return
  }

  // Try Groq first, fall back gracefully
  const groqKey = process.env.GROQ_API_KEY || process.env.XAI_API_KEY || ''
  const isGroqKey = groqKey.startsWith('gsk_')

  if (!groqKey || !isGroqKey) {
    console.warn('[ask-awaaz] No valid Groq API key found — using fallback.')
    res.status(200).json({ reply: getFallback(mode), source: 'fallback' })
    return
  }

  try {
    const groq = new Groq({ apiKey: groqKey })

    // Build messages — for dejargon/sos tools include tone context
    let messages
    if (mode === 'dejargon') {
      messages = [
        { role: 'system', content: getSystemPrompt('dejargon') },
        {
          role: 'user',
          content: `Tone/style requested: ${tone || 'Roman Urdu + English'}\n\nText to explain:\n${userInput}`,
        },
      ]
    } else {
      messages = buildMessages(mode, userInput, history)
    }

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 1200,
      messages,
    })

    const reply = completion.choices?.[0]?.message?.content?.trim()

    if (!reply) {
      res.status(200).json({ reply: getFallback(mode), source: 'fallback' })
      return
    }

    res.status(200).json({ reply, source: 'groq' })
  } catch (error) {
    console.error('[ask-awaaz] Groq error:', error?.message || error)
    res.status(200).json({ reply: getFallback(mode), source: 'fallback', error: error?.message })
  }
}
