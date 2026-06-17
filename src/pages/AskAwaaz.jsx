import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

const SUGGESTED = [
  'What are my fundamental rights?',
  'How does the National Assembly work?',
  'RTI request kaise file karun?',
  'What should I do about broken streetlights?',
]

function getTime() {
  return new Date().toLocaleTimeString('en-PK', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function createMessage(role, text) {
  return {
    id: crypto.randomUUID(),
    role,
    text,
    time: getTime(),
  }
}

function extractReply(payload) {
  if (payload?.reply && typeof payload.reply === 'string') {
    return payload.reply.trim()
  }

  throw new Error('AI response did not include readable text.')
}

async function requestAskAwaazReply(userQuestion, history) {
  const response = await fetch('/api/ask-awaaz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: userQuestion,
      history: history.slice(-10),
    }),
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload?.error || `AI API returned ${response.status}`)
  }

  return extractReply(payload)
}

function buildConnectionErrorReply(error) {
  const detail = (error?.message || 'Unknown API error').replace(/[.]+$/, '')

  return `I could not reach the live AI right now. Backend said: ${detail}. Please check that npm run api is still running and that your server-side API key has quota.`
}

const TABS = [
  { id: 'chat', label: 'Chat Guide', sub: 'Ask anything civic in English or Roman Urdu.' },
  { id: 'dejargon', label: 'De-Jargonizer', sub: 'Paste confusing official text or attach a screenshot reference, then get a simple explanation.' },
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

  const autoSpeak = localStorage.getItem('awaaz_autospeak') !== 'false'

  return (
    <section className="action-result" aria-live="polite">
      <p className="action-tool-kicker mono">{title}</p>
      {isLoading && <p className="action-muted">Awaaz is preparing this...</p>}
      {error && <p className="action-error">{error}</p>}
      {result && (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <pre style={{ flex: 1, margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.85rem', lineHeight: 1.4 }}>{result}</pre>
          <SpeechButton text={result} autoPlay={autoSpeak} />
        </div>
      )}
    </section>
  )
}

function DeJargonizer() {
  const [text, setText] = useState('')
  const [fileName, setFileName] = useState('')
  const [tone, setTone] = useState('Roman Urdu + English')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function handleFile(event) {
    const file = event.target.files?.[0]
    setFileName(file?.name || '')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setResult('')
    setIsLoading(true)

    try {
      const reply = await requestActionAI(
        'dejargon',
        text || 'The user uploaded a screenshot but did not paste text. Ask them to paste the visible text for accurate explanation.',
        { fileName, tone },
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
        <span className="action-tool-index">04</span>
        <div>
          <h2>The De-Jargonizer</h2>
          <p>Paste confusing official text or attach a screenshot reference, then get a simple explanation.</p>
        </div>
      </div>

      <form className="action-form" onSubmit={handleSubmit}>
        <label>
          Screenshot or document snippet
          <input type="file" accept="image/*,.txt,.pdf" onChange={handleFile} />
          {fileName && <span className="action-file-note">Attached: {fileName}</span>}
        </label>
        <label>
          Paste the visible text
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste a law, budget line, notification, or screenshot text..."
          />
        </label>
        <label>
          Explain in
          <select value={tone} onChange={(event) => setTone(event.target.value)}>
            <option>Roman Urdu + English</option>
            <option>Simple English</option>
            <option>Roman Urdu only</option>
            <option>Gen Z analogy mode</option>
          </select>
        </label>
        <button type="submit" disabled={isLoading}>Simplify this</button>
      </form>

      <ResultBox title="Plain-language explanation" result={result} error={error} isLoading={isLoading} />
    </article>
  )
}

function SpeechButton({ text, autoPlay }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const hasAutoPlayed = useRef(false)

  useEffect(() => {
    hasAutoPlayed.current = false
  }, [text])

  function handleSpeak() {
    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    
    const commonUrduWords = ['aap', 'kya', 'hai', 'aur', 'kar', 'se', 'haan', 'nahi', 'karo', 'karta', 'bohot', 'achha', 'yaar', 'likh', 'bhai', 'shuru', 'mein', 'taake', 'hisaab', 'hoga']
    const words = text.toLowerCase().split(/\W+/)
    const isRomanUrdu = words.some(w => commonUrduWords.includes(w))

    if (isRomanUrdu) {
      utterance.rate = 0.82
      utterance.pitch = 1.0
    } else {
      utterance.rate = 0.95
      utterance.pitch = 1.0
    }

    utterance.onend = () => {
      setIsPlaying(false)
    }

    utterance.onerror = () => {
      setIsPlaying(false)
    }

    window.speechSynthesis.speak(utterance)
    setIsPlaying(true)
  }

  useEffect(() => {
    if (autoPlay && !hasAutoPlayed.current) {
      hasAutoPlayed.current = true
      handleSpeak()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, text])

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
    }
  }, [])

  return (
    <button
      onClick={handleSpeak}
      className="speech-btn"
      style={{
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        fontSize: '0.9rem',
        padding: '2px',
        opacity: isPlaying ? 1 : 0.45,
        transition: 'opacity 0.2s',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '6px',
        flexShrink: 0,
      }}
      title={isPlaying ? "Stop Speaking" : "Listen to Response"}
      type="button"
    >
      {isPlaying ? '⏹️' : '🔊'}
    </button>
  )
}

export default function AskAwaaz() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'chat')
  const seededPromptRef = useRef('')
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState(location.state?.prompt || '')
  const [isLoading, setIsLoading] = useState(false)
  const [autoSpeak, setAutoSpeak] = useState(() => {
    return localStorage.getItem('awaaz_autospeak') !== 'false'
  })
  const [lastBotMessageId, setLastBotMessageId] = useState(null)

  useEffect(() => {
    localStorage.setItem('awaaz_autospeak', autoSpeak)
  }, [autoSpeak])

  useEffect(() => {
    const prompt = location.state?.prompt
    if (typeof prompt === 'string' && prompt && prompt !== seededPromptRef.current) {
      seededPromptRef.current = prompt
      setDraft(prompt)
    }
  }, [location.state])

  async function sendQuestion(question) {
    const cleanQuestion = question.trim()
    if (!cleanQuestion || isLoading) return

    const userMessage = createMessage('user', cleanQuestion)
    const nextHistory = [...messages, userMessage]

    setMessages(nextHistory)
    setDraft('')
    setIsLoading(true)

    try {
      const reply = await requestAskAwaazReply(cleanQuestion, nextHistory)
      const botMsg = createMessage('bot', reply)
      setMessages((current) => [...current, botMsg])
      setLastBotMessageId(botMsg.id)
    } catch (error) {
      console.warn('Ask Awaaz API failed:', error)
      const errMsg = createMessage('bot', buildConnectionErrorReply(error))
      setMessages((current) => [...current, errMsg])
      setLastBotMessageId(errMsg.id)
    } finally {
      setIsLoading(false)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    sendQuestion(draft)
  }

  const currentTab = TABS.find((t) => t.id === activeTab) || TABS[0]

  return (
    <div className="chat-page page-wrap" style={{ '--page-accent': 'var(--hot-pink)' }}>
      <div className="page-header">
        <p className="page-eyebrow">AI Civic Guide</p>
        <h1 className="page-title">
          Ask <span className="page-title-accent">Awaaz</span>
        </h1>
        <p className="page-sub">{currentTab.sub}</p>
        {activeTab === 'chat' && (
          <div style={{ marginTop: '10px' }}>
            <span className="coming-soon-chip">Live AI when configured</span>
          </div>
        )}
      </div>

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
      {activeTab === 'chat' && (
        <>
          <div style={{ marginBottom: '20px' }}>
            <div className="section-label">
              <span className="section-label-text mono">Try asking</span>
              <div className="section-label-line" />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {SUGGESTED.map((q) => (
                <button
                  key={q}
                  className="filter-chip"
                  type="button"
                  onClick={() => sendQuestion(q)}
                  disabled={isLoading}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="chat-area" role="log" aria-label="Conversation" aria-live="polite">
            {messages.length === 0 && (
              <section className="chat-empty-state" aria-label="Ask Awaaz intro">
                <p className="chat-empty-kicker">Fresh chat</p>
                <h2>What do you want to understand?</h2>
                <p>
                  Ask about rights, voting, RTI, public offices, or what to do when a civic issue feels confusing.
                </p>
              </section>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble-row ${msg.role}`}
              >
                <div className={`chat-avatar ${msg.role}`} aria-hidden="true">
                  {msg.role === 'bot' ? 'آ' : 'You'}
                </div>
                <div>
                  <div className={`chat-bubble ${msg.role}`} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px' }}>
                    <span style={{ flex: 1, whiteSpace: 'pre-line' }}>{msg.text}</span>
                    {msg.role === 'bot' && (
                      <SpeechButton
                        text={msg.text}
                        autoPlay={autoSpeak && msg.id === lastBotMessageId}
                      />
                    )}
                  </div>
                  <p className="chat-bubble-meta" style={{ textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chat-bubble-row bot">
                <div className="chat-avatar bot" aria-hidden="true">آ</div>
                <div className="chat-bubble bot chat-thinking">
                  <span />
                  Awaaz is thinking...
                </div>
              </div>
            )}
          </div>

          <form className="chat-input-wrap chat-input-bar" onSubmit={handleSubmit}>
            <button
              type="button"
              className={`speech-toggle-btn ${autoSpeak ? 'active' : ''}`}
              onClick={() => {
                const newValue = !autoSpeak
                setAutoSpeak(newValue)
                if (!newValue) {
                  window.speechSynthesis.cancel()
                }
              }}
              style={{
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                background: autoSpeak ? 'var(--lavender)' : 'var(--cream-dark)',
                border: 'var(--border)',
                boxShadow: 'var(--shadow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                flexShrink: 0
              }}
              title={autoSpeak ? "Disable Auto-speak (Voice is On)" : "Enable Auto-speak (Voice is Off)"}
            >
              {autoSpeak ? '🔊' : '🔇'}
            </button>
            <input
              className="chat-input"
              aria-label="Ask Awaaz a civic question"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask about rights, elections, RTI, complaints..."
              disabled={isLoading}
            />
            <button className="chat-send-btn" type="submit" aria-label="Send message" disabled={!draft.trim() || isLoading}>
              →
            </button>
          </form>

          <p className="chat-footnote mono">
            For real-life issues, use Civic SOS to create a ready-to-send action plan.
          </p>
        </>
      )}

      {activeTab === 'dejargon' && <DeJargonizer />}
    </div>
  )
}
