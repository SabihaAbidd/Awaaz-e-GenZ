import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

const LANGUAGES = ['English', 'Pakistani Roman Urdu']

const SECTION_TITLES = [
  'Issue Summary',
  'Who Is Responsible',
  'What You Can Do',
  'Ready-to-Send Message',
  'Safety Note',
  'Confidence Level',
]

const DEFAULT_PLAN = {
  issueSummary: '',
  whoIsResponsible: '',
  whatYouCanDo: [],
  readyMessage: '',
  safetyNote: '',
  confidenceLevel: 'Medium',
}

function buildCivicSOSPrompt(userIssue, language) {
  return `You are Awaaz, a neutral civic education assistant for Pakistan's Gen Z. Your job is to turn a user's civic problem into a safe, simple action plan. Do not support or oppose any political party, politician, candidate, or ideology. Do not invent official phone numbers, emails, laws, or links. Give general civic guidance only.

User issue:
${userIssue}

Preferred language:
${language}

Return the answer in this exact structure:

1. Issue Summary
2. Who Is Responsible
3. What You Can Do
4. Ready-to-Send Message
5. Safety Note
6. Confidence Level

Make the answer simple, practical, locally relevant to Pakistan, and safe. If the user writes in Roman Urdu, use natural Pakistani Roman Urdu. If the issue involves danger, harassment, violence, threats, or abuse, include a stronger safety note and encourage contacting trusted people and appropriate authorities.`
}

function splitSteps(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map((step) => String(step).trim())
  }

  return String(value || '')
    .split(/\n+/)
    .map((line) => line.replace(/^\s*(?:[-*]|\d+[.)])\s*/, '').trim())
    .filter(Boolean)
}

function extractSection(text, title, nextTitle) {
  const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const escapedNext = nextTitle?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = escapedNext
    ? new RegExp(`${escapedTitle}\\s*:?\\s*([\\s\\S]*?)(?=\\n\\s*(?:\\d+\\.\\s*)?${escapedNext}\\s*:?)`, 'i')
    : new RegExp(`${escapedTitle}\\s*:?\\s*([\\s\\S]*)`, 'i')
  const match = text.match(pattern)

  return match?.[1]
    ?.replace(/^\s*(?:[-*]|\d+[.)])\s*/, '')
    .trim() || ''
}

function normalizeConfidence(value) {
  const confidence = String(value || '').toLowerCase()

  if (confidence.includes('high')) return 'High'
  if (confidence.includes('low')) return 'Low'
  return 'Medium'
}

function parseActionPlan(payload) {
  const structured = payload?.actionPlan || payload?.plan || payload?.sections

  if (structured && typeof structured === 'object') {
    return {
      issueSummary: structured.issueSummary || structured['Issue Summary'] || DEFAULT_PLAN.issueSummary,
      whoIsResponsible: structured.whoIsResponsible || structured['Who Is Responsible'] || DEFAULT_PLAN.whoIsResponsible,
      whatYouCanDo: splitSteps(structured.whatYouCanDo || structured['What You Can Do']),
      readyMessage: structured.readyMessage || structured['Ready-to-Send Message'] || DEFAULT_PLAN.readyMessage,
      safetyNote: structured.safetyNote || structured['Safety Note'] || DEFAULT_PLAN.safetyNote,
      confidenceLevel: normalizeConfidence(structured.confidenceLevel || structured['Confidence Level']),
    }
  }

  const text =
    payload?.reply ||
    payload?.response ||
    payload?.text ||
    payload?.message ||
    payload?.content ||
    payload?.choices?.[0]?.message?.content ||
    ''

  if (!text) {
    throw new Error('AI response did not include readable text.')
  }

  return {
    issueSummary: extractSection(text, SECTION_TITLES[0], SECTION_TITLES[1]),
    whoIsResponsible: extractSection(text, SECTION_TITLES[1], SECTION_TITLES[2]),
    whatYouCanDo: splitSteps(extractSection(text, SECTION_TITLES[2], SECTION_TITLES[3])),
    readyMessage: extractSection(text, SECTION_TITLES[3], SECTION_TITLES[4]),
    safetyNote: extractSection(text, SECTION_TITLES[4], SECTION_TITLES[5]),
    confidenceLevel: normalizeConfidence(extractSection(text, SECTION_TITLES[5])),
  }
}

async function requestCivicSOSPlan(userIssue, language) {
  const prompt = buildCivicSOSPrompt(userIssue, language)
  const endpoints = [
    import.meta.env.VITE_CIVIC_SOS_API_URL,
    import.meta.env.VITE_AWAAZ_API_URL,
    import.meta.env.VITE_AI_API_URL,
    '/api/ask-awaaz',
    '/api/civic-sos',
    '/api/awaaz',
  ].filter(Boolean)

  let lastError

  for (const endpoint of endpoints) {
    try {
      // AI request: this is where Civic SOS sends the user's issue to the app's configured AI API.
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'civic-sos',
          question: prompt,
          prompt,
          userIssue,
          language,
        }),
      })

      if (!response.ok) {
        throw new Error(`AI API returned ${response.status}`)
      }

      const payload = await response.json()
      return parseActionPlan(payload)
    } catch (error) {
      lastError = error
    }
  }

  throw lastError || new Error('No AI API endpoint is configured.')
}

function createFallbackPlan(userIssue, language) {
  const isRomanUrdu = language === 'Pakistani Roman Urdu'
  const cleanIssue = userIssue.trim()

  // Fallback response: used when the AI API is unavailable so the demo still produces a useful action plan.
  if (isRomanUrdu) {
    return {
      issueSummary: `Aap ka issue yeh lag raha hai: "${cleanIssue}". Isay calm aur official tareeqay se report karna behtar hoga taa-ke record bhi banay aur follow-up bhi possible ho.`,
      whoIsResponsible: 'Issue ke type ke hisaab se local government, municipal authority, university administration, election office, cybercrime reporting channel, police/help center, ya relevant public office responsible ho sakta hai.',
      whatYouCanDo: [
        'Issue ki clear details likhein: area, date, time, photos/screenshots, aur kis tarah log affect ho rahe hain.',
        'Apne ilaqay, university, ya relevant office ke official complaint channel par polite complaint submit karein.',
        'Complaint ka reference number, screenshot, ya received copy save kar lein.',
        'Agar jawab na aaye, 3 se 5 working days ke baad respectful follow-up bhejein.',
        'Sensitive ya dangerous matter ho to trusted person ko inform karein aur appropriate authorities se help lein.',
      ],
      readyMessage: `Subject: Complaint Regarding Civic Issue in [Your Area]

Respected Sir/Madam,

I am writing to report an issue in [Your Area] on [Date]. The issue is: [Issue Details].

This problem is affecting residents/students/community members and needs attention from the relevant authority. Kindly look into the matter and guide us about the next steps.

Regards,
[Your Name]
[Your Contact, optional]`,
      safetyNote: 'Official aur legal channels use karein. Agar issue harassment, threat, violence, ya abuse se related hai, akelay handle na karein; trusted logon aur appropriate authorities se help lein.',
      confidenceLevel: 'Medium',
    }
  }

  return {
    issueSummary: `Your issue seems to be: "${cleanIssue}". A calm, documented complaint through the right official channel is the safest next step.`,
    whoIsResponsible: 'Depending on the issue, the responsible category may be local government, a municipal authority, university administration, an election office, a cybercrime reporting channel, police/help center, or another relevant public office.',
    whatYouCanDo: [
      'Write down clear details: area, date, time, photos/screenshots, and how people are affected.',
      'Submit a polite complaint through the relevant official channel for your area, institution, or department.',
      'Save proof of submission, such as a reference number, screenshot, or received copy.',
      'Follow up respectfully after 3 to 5 working days if you do not receive a response.',
      'For sensitive or dangerous issues, involve trusted people and appropriate authorities instead of handling it alone.',
    ],
    readyMessage: `Subject: Complaint Regarding Civic Issue in [Your Area]

Respected Sir/Madam,

I am writing to report an issue in [Your Area] on [Date]. The issue is: [Issue Details].

This problem is affecting residents/students/community members and needs attention from the relevant authority. Kindly look into the matter and guide us about the next steps.

Regards,
[Your Name]
[Your Contact, optional]`,
    safetyNote: 'Use official and legal channels. If the issue involves harassment, threats, violence, or abuse, do not handle it alone; seek help from trusted people and appropriate authorities.',
    confidenceLevel: 'Medium',
  }
}

function ConfidenceBadge({ level }) {
  return (
    <span className={`sos-confidence-badge ${level.toLowerCase()}`}>
      {level}
    </span>
  )
}

function ResultCard({ title, accent, children }) {
  return (
    <article className="sos-result-card" style={{ '--sos-card-accent': accent }}>
      <h2>{title}</h2>
      {children}
    </article>
  )
}

const TABS = [
  { id: 'sos', label: 'SOS Planner', sub: 'Turn your real-life civic issue into a safe action plan.' },
  { id: 'complaint', label: 'Complaint Generator', sub: 'Write normally. Get a formal bilingual complaint ready for a portal, email, or WhatsApp.' },
  { id: 'map', label: 'Who is Responsible', sub: 'Type a neighborhood and issue. Awaaz maps likely responsibility.' },
  { id: 'toolkit', label: 'Citizen Toolkit', sub: 'Get immediate steps, evidence checklist, escalation path, and a WhatsApp-ready message.' },
]

const ISSUE_TYPES = [
  'Garbage / sanitation',
  'Water / sewage',
  'Broken road',
  'Streetlight',
  'Harassment / safety',
  'School / clinic',
]

const TOOLKIT_PRESETS = [
  'Broken water pipe flooding the street',
  'Garbage pile not collected for days',
  'Streetlight not working near my house',
  'Sewage smell in drinking water',
]

async function requestActionAI(mode, question, context = {}) {
  const contextText = Object.entries(context)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')
  const fullQuestion = contextText ? `${question}\n\n${contextText}` : question

  const response = await fetch('/api/ask-awaaz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode,
      question: fullQuestion,
      history: [],
    }),
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload?.error || `AI API returned ${response.status}`)
  }

  if (!payload?.reply) {
    throw new Error('AI response did not include readable text.')
  }

  return payload.reply.trim()
}

function ResultBox({ title, result, error, isLoading }) {
  if (!result && !error && !isLoading) return null

  return (
    <section className="action-result" aria-live="polite">
      <p className="action-tool-kicker mono">{title}</p>
      {isLoading && <p className="action-muted">Awaaz is preparing this...</p>}
      {error && <p className="action-error">{error}</p>}
      {result && <pre>{result}</pre>}
    </section>
  )
}

function AccountabilityLookup() {
  const [neighborhood, setNeighborhood] = useState('')
  const [issueType, setIssueType] = useState(ISSUE_TYPES[0])
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setResult('')
    setIsLoading(true)

    try {
      const reply = await requestActionAI(
        'accountability',
        `Neighborhood: ${neighborhood}. Issue: ${issueType}. Show whom to contact or blame responsibly.`,
        { neighborhood, issueType },
      )
      setResult(reply)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <article className="action-tool-card" style={{ marginTop: '0px' }}>
      <div className="action-tool-head">
        <span className="action-tool-index">01</span>
        <div>
          <h2>Whom to Blame Map</h2>
          <p>Type a neighborhood and issue. Awaaz maps likely responsibility and tells you what to verify.</p>
        </div>
      </div>

      <form className="action-form" onSubmit={handleSubmit}>
        <label>
          Neighborhood / city
          <input
            value={neighborhood}
            onChange={(event) => setNeighborhood(event.target.value)}
            placeholder="Gulshan-e-Iqbal, Karachi"
            required
          />
        </label>
        <label>
          Issue type
          <select value={issueType} onChange={(event) => setIssueType(event.target.value)}>
            {ISSUE_TYPES.map((issue) => (
              <option key={issue}>{issue}</option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={isLoading}>Find responsible offices</button>
      </form>

      <ResultBox title="Accountability result" result={result} error={error} isLoading={isLoading} />
    </article>
  )
}

function ComplaintGenerator() {
  const [issue, setIssue] = useState('')
  const [location, setLocation] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setResult('')
    setIsLoading(true)

    try {
      const reply = await requestActionAI(
        'complaint',
        issue,
        { location, requestedOutput: 'English and Urdu/Roman Urdu formal complaint, PMDU/municipal style' },
      )
      setResult(reply)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <article className="action-tool-card action-tool-featured" style={{ marginTop: '0px' }}>
      <div className="action-tool-head">
        <span className="action-tool-index">02</span>
        <div>
          <h2>1-Click Complaint Generator</h2>
          <p>Write normally. Get a formal bilingual complaint ready for a portal, email, or WhatsApp follow-up.</p>
        </div>
      </div>

      <form className="action-form" onSubmit={handleSubmit}>
        <label>
          What's broken in your neighborhood today?
          <textarea
            value={issue}
            onChange={(event) => setIssue(event.target.value)}
            placeholder="Our area water has smelled like sewage for 3 days..."
            required
          />
        </label>
        <label>
          Location
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Street, block, area, city"
          />
        </label>
        <button type="submit" disabled={isLoading}>Generate complaint</button>
      </form>

      <ResultBox title="Ready complaint" result={result} error={error} isLoading={isLoading} />
    </article>
  )
}

function CitizenToolkit() {
  const [issue, setIssue] = useState(TOOLKIT_PRESETS[0])
  const [urgency, setUrgency] = useState('Today')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setResult('')
    setIsLoading(true)

    try {
      const reply = await requestActionAI(
        'toolkit',
        issue,
        { urgency, output: 'step-by-step toolkit plus WhatsApp-ready message' },
      )
      setResult(reply)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <article className="action-tool-card" style={{ marginTop: '0px' }}>
      <div className="action-tool-head">
        <span className="action-tool-index">03</span>
        <div>
          <h2>Automated Citizen Action Toolkit</h2>
          <p>Get immediate steps, evidence checklist, escalation path, and a WhatsApp-ready message.</p>
        </div>
      </div>

      <form className="action-form" onSubmit={handleSubmit}>
        <label>
          Urgent issue
          <select value={issue} onChange={(event) => setIssue(event.target.value)}>
            {TOOLKIT_PRESETS.map((preset) => (
              <option key={preset}>{preset}</option>
            ))}
          </select>
        </label>
        <label>
          Timeline
          <select value={urgency} onChange={(event) => setUrgency(event.target.value)}>
            <option>Today</option>
            <option>This week</option>
            <option>Ongoing for weeks</option>
            <option>Safety risk right now</option>
          </select>
        </label>
        <button type="submit" disabled={isLoading}>Create action toolkit</button>
      </form>

      <ResultBox title="Citizen toolkit" result={result} error={error} isLoading={isLoading} />
    </article>
  )
}

export default function CivicSOS() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'sos')
  const [issue, setIssue] = useState('')
  const [language, setLanguage] = useState(LANGUAGES[0])
  const [plan, setPlan] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copyStatus, setCopyStatus] = useState('')

  const canGenerate = issue.trim().length >= 8 && !isLoading
  const sampleIssue = useMemo(() => (
    language === 'Pakistani Roman Urdu'
      ? 'Mere area mein streetlights kharab hain...'
      : 'Example: There are broken streetlights in my street...'
  ), [language])

  async function handleSubmit(event) {
    event.preventDefault()

    if (!canGenerate) return

    setIsLoading(true)
    setError('')
    setCopyStatus('')

    try {
      const actionPlan = await requestCivicSOSPlan(issue, language)
      setPlan(actionPlan)
    } catch {
      setError('AI API se response nahi aa saka, so Awaaz used a safe demo action plan.')
      setPlan(createFallbackPlan(issue, language))
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCopyMessage() {
    if (!plan?.readyMessage) return

    try {
      // Copy button logic: copies the ready-to-send civic message for WhatsApp, email, or an application.
      await navigator.clipboard.writeText(plan.readyMessage)
      setCopyStatus('Copied')
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = plan.readyMessage
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopyStatus('Copied')
    }

    window.setTimeout(() => setCopyStatus(''), 1800)
  }

  const currentTab = TABS.find((t) => t.id === activeTab) || TABS[0]

  return (
    <div className="civic-sos-page page-wrap" style={{ '--page-accent': 'var(--yellow)' }}>
      <header className="page-header sos-header">
        <p className="page-eyebrow">Action Mode</p>
        <h1 className="page-title">
          Civic <span className="page-title-accent">SOS</span>
        </h1>
        <p className="page-sub">{currentTab.sub}</p>
      </header>

      {/* Tabs list */}
      <div className="filter-chips" style={{ marginBottom: '24px' }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`filter-chip${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Content */}
      {activeTab === 'sos' && (
        <>
          <section className="sos-intro-card" aria-label="Civic SOS intro">
            <div>
              <p className="sos-tagline">From confusion to action — safely and simply.</p>
              <p className="sos-intro-text">
                Tell Awaaz what civic issue you are facing, and we'll turn it into a simple action plan.
              </p>
            </div>
            <span className="sos-stamp" aria-hidden="true">SOS</span>
          </section>

          <form className="sos-form" onSubmit={handleSubmit}>
            <label className="sos-field-label" htmlFor="civic-issue">
              Your civic issue
            </label>
            <textarea
              id="civic-issue"
              className="sos-textarea"
              value={issue}
              onChange={(event) => setIssue(event.target.value)}
              placeholder={sampleIssue}
              rows={6}
            />

            <div className="sos-controls">
              <fieldset className="sos-language-group">
                <legend>Language</legend>
                <div className="sos-language-options">
                  {LANGUAGES.map((item) => (
                    <label key={item} className={`sos-radio-card${language === item ? ' active' : ''}`}>
                      <input
                        type="radio"
                        name="civic-sos-language"
                        value={item}
                        checked={language === item}
                        onChange={(event) => setLanguage(event.target.value)}
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <button className="sos-generate-btn" type="submit" disabled={!canGenerate}>
                {isLoading ? 'Creating Plan...' : 'Create Action Plan'}
              </button>
            </div>
          </form>

          {error && (
            <div className="sos-error" role="status">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="sos-loading" role="status" aria-live="polite">
              <span />
              Awaaz is making this practical...
            </div>
          )}

          {plan && !isLoading && (
            <section className="sos-results" aria-label="Civic SOS action plan">
              <ResultCard title="Issue Summary" accent="var(--hot-pink)">
                <p>{plan.issueSummary}</p>
              </ResultCard>

              <ResultCard title="Who Is Responsible" accent="var(--orange)">
                <p>{plan.whoIsResponsible}</p>
              </ResultCard>

              <ResultCard title="What You Can Do" accent="var(--mint)">
                <ol className="sos-steps">
                  {plan.whatYouCanDo.map((step, index) => (
                    <li key={`${step}-${index}`}>{step}</li>
                  ))}
                </ol>
              </ResultCard>

              <ResultCard title="Ready-to-Send Message" accent="var(--lavender)">
                <pre className="sos-message">{plan.readyMessage}</pre>
                <button className="sos-copy-btn" type="button" onClick={handleCopyMessage}>
                  {copyStatus || 'Copy Message'}
                </button>
              </ResultCard>

              <ResultCard title="Safety Note" accent="var(--coral)">
                <p>{plan.safetyNote}</p>
              </ResultCard>

              <ResultCard title="Confidence Level" accent="var(--yellow)">
                <ConfidenceBadge level={plan.confidenceLevel} />
              </ResultCard>
            </section>
          )}
        </>
      )}

      {activeTab === 'complaint' && <ComplaintGenerator />}
      {activeTab === 'map' && <AccountabilityLookup />}
      {activeTab === 'toolkit' && <CitizenToolkit />}
    </div>
  )
}
