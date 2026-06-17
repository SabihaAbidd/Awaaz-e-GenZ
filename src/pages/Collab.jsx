import { useEffect, useRef, useState } from 'react'

const TABS = [
  { id: 'events', label: 'Events & Networks', sub: 'Find local rallies, student forums, and coordinate on social issues by region.' },
  { id: 'volunteer', label: 'Volunteering & Resumé', sub: 'Claim micro-volunteering tasks, earn a verified Civic Resumé badge, or certify your hours.' },
  { id: 'startup', label: 'Startup Concierge', sub: 'Interactive AI assistant to navigate business registration (SECP), FBR tax filing, and permits.' },
]

const REGIONS = ['All', 'Islamabad', 'Punjab', 'Sindh', 'KPK', 'Balochistan']

const EVENTS_DATA = [
  {
    id: 1,
    title: 'Aurat March Karachi 2026',
    region: 'Sindh',
    date: 'March 8, 2026',
    desc: 'Joint action for equal rights, gender justice, and social safety. Pre-march banner making and alignment assembly.',
    topic: 'Gender Justice',
    groupLink: 'https://chat.whatsapp.com/mock-aurat-march-khi',
  },
  {
    id: 2,
    title: 'Lahore Civic Forum meetup',
    region: 'Punjab',
    date: 'This Saturday, 4:00 PM',
    desc: 'Discussion on municipal service delivery, local body elections, and tracking garbage collection in Gulberg.',
    topic: 'Local Accountability',
    groupLink: 'https://chat.whatsapp.com/mock-lahore-civic-forum',
  },
  {
    id: 3,
    title: 'Climate Strike Islamabad',
    region: 'Islamabad',
    date: 'Next Friday, 2:00 PM',
    desc: 'March starting from Press Club to Parliament demanding action on urban heatwaves and smog reduction planning.',
    topic: 'Environment',
    groupLink: 'https://chat.whatsapp.com/mock-climate-strike-isb',
  },
  {
    id: 4,
    title: 'Beach Clean-up Drive Clifton',
    region: 'Sindh',
    date: 'Sunday morning',
    desc: 'Removing plastic waste, raising awareness, and distributing recycling bags near Clifton Beach.',
    topic: 'Environment',
    groupLink: 'https://chat.whatsapp.com/mock-beach-cleanup-khi',
  },
  {
    id: 5,
    title: 'Peshawar Youth Union Assembly',
    region: 'KPK',
    date: 'July 5, 2026',
    desc: 'Networking event for university students to discuss career development and civic leadership programs.',
    topic: 'Youth Leadership',
    groupLink: 'https://chat.whatsapp.com/mock-peshawar-youth',
  },
  {
    id: 6,
    title: 'Quetta Water Conservation Drive',
    region: 'Balochistan',
    date: 'Ongoing',
    desc: 'Awareness walks, door-to-door water-saving brochures distribution, and fixing neighborhood water pipe leaks.',
    topic: 'Civic Health',
    groupLink: 'https://chat.whatsapp.com/mock-quetta-water',
  },
]

const VOLUNTEER_TASKS = [
  {
    id: 101,
    title: 'Sort recycling in Sector F-7',
    ngo: 'Green Youth League',
    hours: 2,
    region: 'Islamabad',
    desc: 'Help sort paper, plastic, and glass waste at the weekly eco-drive center in Sector F-7.',
  },
  {
    id: 102,
    title: 'Clifton Beach cleanup coordination',
    ngo: 'Sea Watch Coalition',
    hours: 3,
    region: 'Sindh',
    desc: 'Lead a volunteer team to pick up trash bags, document waste categories, and manage logistics.',
  },
  {
    id: 103,
    title: 'Plant trees in Gulberg Park',
    ngo: 'Tree Pakistan Initiative',
    hours: 4,
    region: 'Punjab',
    desc: 'Dig soil, plant indigenous tree saplings, and mark water channels at the local municipal park.',
  },
  {
    id: 104,
    title: 'Digitize historical city records',
    ngo: 'Civic Digital Archives',
    hours: 2,
    region: 'Remote',
    desc: 'Review scanned PDF files of historical land records and digitize text descriptions online.',
  },
]

const STARTUP_PRESETS = [
  {
    q: 'How do I register an IT startup with SECP?',
    prompt: 'Show step-by-step instructions on registering a private limited IT startup company with SECP in Pakistan, including name approval, digital signature, capital requirements, and fees.',
  },
  {
    q: 'How to register a Sole Proprietorship and get NTN from FBR?',
    prompt: 'Explain how a young founder can register a sole proprietorship, get a National Tax Number (NTN) from FBR, and become an active tax filer online via Iris.',
  },
  {
    q: 'What permits do I need for a food delivery business in Lahore?',
    prompt: 'Explain the municipal approvals, Punjab Food Authority (PFA) registration, business tax registration, and Cantonment Board approvals needed to launch a cloud kitchen / food startup in Lahore.',
  },
  {
    q: 'Explain SECP Private Limited vs Sole Proprietorship',
    prompt: 'Compare SECP Private Limited registration vs FBR Sole Proprietorship in terms of cost, liability, tax benefits, and paperwork for a new tech startup in Pakistan.',
  },
]

const STARTUP_FALLBACKS = {
  'SECP': `### SECP IT Startup Registration Steps
1. **Name Reservation**: Log in to SECP e-services, apply for name availability. Cost: ~Rs. 200. Avoid generic names.
2. **Incorporation**: Submit Articles of Association (Memorandum) and Form 1, Form 21 (registered office), and Form 29 (directors).
3. **Digital Signatures**: Set up digital signatures for directors through NIFT or other SECP partners.
4. **Fees**: Standard fee for Rs. 100,000 capital is ~Rs. 1,500-2,500 online.
5. **NTN**: Once incorporated, SECP automatically shares data with FBR to generate your corporate NTN.

*Disclaimer: General guidance, verify details on secp.gov.pk.*`,

  'Sole Proprietorship': `### Sole Proprietorship & FBR Active Filer Check
1. **NTN Registration**: Log in to FBR Iris portal (iris.fbr.gov.pk) and register as a new taxpayer.
2. **Sole Proprietorship Declaration**: Add your business name and principal activity details under your personal NTN in the Iris profile.
3. **Business Address**: You must upload a utility bill (within 3 months) or rental agreement in the name of the business address.
4. **Active Filer Status**: File your first annual income tax return. You will appear on the Active Taxpayer List (ATL) on the subsequent Monday. ATL status halves withholding taxes.

*Disclaimer: General guidance, verify details on fbr.gov.pk.*`,

  'Food delivery': `### Punjab Food Authority (PFA) & Lahore Permits
1. **PFA Product License**: Register your kitchen on the PFA portal. An inspector will inspect hygiene, water testing, and kitchen setup. Fee: ~Rs. 5,000 - 15,000 depending on scale.
2. **Medical Certificates**: Every chef or handler must have a PFA medical fitness card (tests for hepatitis, typhoid, etc.).
3. **MCL Trade License**: Apply for a municipal trade license from Metropolitan Corporation Lahore.
4. **Cantonment Board**: If located in DHA or Cantonment areas, apply for the Cantonment Board commercial permit and health license directly.

*Disclaimer: General guidance, verify details on punjabfoodauthority.gov.pk.*`,

  'SECP Private Limited vs Sole': `### SECP Private Limited vs Sole Proprietorship
- **Sole Proprietorship**:
  * *Setup Cost*: Very Low (Free NTN online via FBR).
  * *Liability*: Unlimited (your personal assets are at risk if business goes under).
  * *Funding*: Hard to raise VC or equity funding.
  * *Tax*: Personal income tax brackets (up to 35%).
- **Private Limited (SECP)**:
  * *Setup Cost*: Medium (~Rs. 10,000 - 15,000 including registration and agent fee).
  * *Liability*: Limited (limited to your shares in the company).
  * *Funding*: Easy to issue shares, raise VC funding, and add co-founders.
  * *Tax*: Flat corporate tax rate (currently 29% or lower for small/special startups).`
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

export default function Collab() {
  const [activeTab, setActiveTab] = useState('events')
  const [regionFilter, setRegionFilter] = useState('All')
  const [claimedTasks, setClaimedTasks] = useState([])
  const [volunteerHours, setVolunteerHours] = useState(6) // Initial mock hours
  const [showLinkedInNotification, setShowLinkedInNotification] = useState(false)
  const [showPremiumModal, setShowPremiumModal] = useState(false)

  // Chat/Startup concierge states:
  const [messages, setMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [autoSpeak, setAutoSpeak] = useState(() => {
    return localStorage.getItem('awaaz_autospeak') !== 'false'
  })
  const [lastBotMessageId, setLastBotMessageId] = useState(null)

  useEffect(() => {
    localStorage.setItem('awaaz_autospeak', autoSpeak)
  }, [autoSpeak])

  // Filter events
  const filteredEvents = EVENTS_DATA.filter(
    (ev) => regionFilter === 'All' || ev.region.toLowerCase() === regionFilter.toLowerCase()
  )

  // Volunteer claim handler
  function handleClaimTask(task) {
    if (claimedTasks.includes(task.id)) return
    setClaimedTasks((curr) => [...curr, task.id])
    setVolunteerHours((prev) => prev + task.hours)
  }

  // LinkedIn share mock
  function handleShareLinkedIn() {
    setShowLinkedInNotification(true)
    window.setTimeout(() => setShowLinkedInNotification(false), 2500)
  }

  // Startup AI submission
  async function handleStartupQuery(queryText) {
    const cleanQuery = queryText.trim()
    if (!cleanQuery || isChatLoading) return

    const userMsg = { id: crypto.randomUUID(), role: 'user', text: cleanQuery }
    setMessages((curr) => [...curr, userMsg])
    setChatInput('')
    setIsChatLoading(true)

    try {
      const response = await fetch('/api/ask-awaaz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'startup',
          question: cleanQuery,
          history: [],
        }),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload?.error || `AI API returned ${response.status}`)
      }

      const replyMsg = { id: crypto.randomUUID(), role: 'bot', text: payload.reply.trim() }
      setMessages((curr) => [...curr, replyMsg])
      setLastBotMessageId(replyMsg.id)
    } catch {
      // Find fallback match
      let matchedText
      if (cleanQuery.toLowerCase().includes('secp') && cleanQuery.toLowerCase().includes('it')) {
        matchedText = STARTUP_FALLBACKS['SECP']
      } else if (cleanQuery.toLowerCase().includes('sole') || cleanQuery.toLowerCase().includes('proprietorship') || cleanQuery.toLowerCase().includes('ntn')) {
        matchedText = STARTUP_FALLBACKS['Sole Proprietorship']
      } else if (cleanQuery.toLowerCase().includes('food') || cleanQuery.toLowerCase().includes('delivery') || cleanQuery.toLowerCase().includes('lahore')) {
        matchedText = STARTUP_FALLBACKS['Food delivery']
      } else {
        matchedText = STARTUP_FALLBACKS['SECP Private Limited vs Sole']
      }

      const fallbackMsg = {
        id: crypto.randomUUID(),
        role: 'bot',
        text: `(Demo Mode Checklists)\n\n${matchedText}\n\n*Note: Start npm run api to connect to live AI guides.*`,
      }
      setMessages((curr) => [...curr, fallbackMsg])
      setLastBotMessageId(fallbackMsg.id)
    } finally {
      setIsChatLoading(false)
    }
  }

  const currentTab = TABS.find((t) => t.id === activeTab) || TABS[0]

  return (
    <div className="collab-page page-wrap" style={{ '--page-accent': 'var(--lavender)' }}>
      <header className="page-header">
        <p className="page-eyebrow">Connect & Engage</p>
        <h1 className="page-title">
          Collab <span className="page-title-accent">Hub</span>
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

      {/* TABS CONTENT */}

      {/* Tab 1: Events & Networks */}
      {activeTab === 'events' && (
        <section aria-labelledby="events-heading">
          {/* Region Filters */}
          <div style={{ marginBottom: '20px' }}>
            <div className="section-label">
              <span className="section-label-text mono">Filter by Region</span>
              <div className="section-label-line" />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {REGIONS.map((r) => (
                <button
                  key={r}
                  className={`filter-chip${regionFilter === r ? ' active' : ''}`}
                  type="button"
                  onClick={() => setRegionFilter(r)}
                  style={regionFilter === r ? { background: 'var(--lavender)' } : {}}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          <div className="action-tool-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {filteredEvents.length === 0 ? (
              <p style={{ gridColumn: '1/-1', textAlign: 'center', opacity: 0.6, padding: '40px 0' }}>
                No active events listed for this region. Check back soon!
              </p>
            ) : (
              filteredEvents.map((ev) => (
                <article key={ev.id} className="action-tool-card" style={{ marginTop: '0px' }}>
                  <div className="action-tool-head">
                    <span className="action-tool-index" style={{ background: 'var(--cream-dark)', color: 'var(--ink)' }}>
                      {ev.region.slice(0, 3).toUpperCase()}
                    </span>
                    <div>
                      <h2 style={{ fontSize: '1.1rem', letterSpacing: '-0.02em' }}>{ev.title}</h2>
                      <p className="action-file-note" style={{ color: 'var(--ink-muted)', marginTop: '2px', fontWeight: 600 }}>
                        {ev.date} | Region: {ev.region}
                      </p>
                    </div>
                  </div>
                  <p style={{ margin: '12px 0 16px 0', fontSize: '0.85rem', lineHeight: 1.4, color: 'var(--ink)' }}>
                    {ev.desc}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="coming-soon-chip" style={{ fontSize: '0.68rem', letterSpacing: '0.04em', background: 'rgba(0,0,0,0.05)' }}>
                      #{ev.topic}
                    </span>
                    <button
                      className="sos-copy-btn"
                      style={{ padding: '6px 12px', fontSize: '0.75rem', marginLeft: 'auto', background: 'var(--ink)', color: 'var(--cream)' }}
                      onClick={() => alert(`Connecting to ${ev.title} group chat! Copy invite link: ${ev.groupLink}`)}
                      type="button"
                    >
                      Join Discussion
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      )}

      {/* Tab 2: Volunteering & Resumé */}
      {activeTab === 'volunteer' && (
        <section aria-labelledby="volunteer-heading" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
            
            {/* Left Column: Tasks List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="section-label">
                <span className="section-label-text mono">Micro-Volunteering Tasks</span>
                <div className="section-label-line" />
              </div>

              {VOLUNTEER_TASKS.map((task) => {
                const isClaimed = claimedTasks.includes(task.id)
                return (
                  <article key={task.id} className="action-tool-card" style={{ marginTop: '0px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.01em' }}>{task.title}</h3>
                      <span className="coming-soon-chip" style={{ background: 'var(--mint)', color: 'var(--ink)', fontWeight: 700 }}>
                        +{task.hours} hrs
                      </span>
                    </div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--ink-muted)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                      NGO: {task.ngo} | {task.region}
                    </p>
                    <p style={{ fontSize: '0.8rem', lineHeight: 1.3, margin: '8px 0 12px 0' }}>
                      {task.desc}
                    </p>
                    <button
                      className="sos-copy-btn"
                      style={{
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        background: isClaimed ? 'var(--mint)' : 'var(--ink)',
                        color: isClaimed ? 'var(--ink)' : 'var(--cream)',
                        border: 'var(--border)',
                        width: '100%',
                      }}
                      onClick={() => handleClaimTask(task)}
                      disabled={isClaimed}
                      type="button"
                    >
                      {isClaimed ? '✓ Task Claimed (Hours Added)' : 'Claim Micro-Task'}
                    </button>
                  </article>
                )
              })}
            </div>

            {/* Right Column: Civic Resumé Badging */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="section-label">
                <span className="section-label-text mono">Your Verified Civic Resumé</span>
                <div className="section-label-line" />
              </div>

              <div
                className="daily-card-featured"
                style={{
                  background: 'var(--cream-dark)',
                  border: '2px solid var(--ink)',
                  boxShadow: 'var(--shadow)',
                  borderRadius: 'var(--radius)',
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="coming-soon-chip" style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
                    CIVIC BADGE
                  </span>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', opacity: 0.6 }}>
                    No. AEGZ-8829-2026
                  </span>
                </div>
                
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', margin: '4px 0' }}>
                  Pakistan Gen Z Citizen
                </h3>
                
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1 }}>{volunteerHours}</span>
                  <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', opacity: 0.7 }}>
                    Verified Service Hours
                  </span>
                </div>

                <div style={{ borderTop: '1px dashed var(--ink)', paddingTop: '12px', marginTop: '4px' }}>
                  <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
                    AREAS OF IMPACT:
                  </p>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '2px' }}>
                    Environment Protection, Community Support, Local Governance
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button
                    className="sos-copy-btn"
                    style={{ flex: 1, padding: '8px', fontSize: '0.75rem', background: 'var(--ink)', color: 'var(--cream)' }}
                    onClick={handleShareLinkedIn}
                    type="button"
                  >
                    Add to LinkedIn
                  </button>
                  <button
                    className="sos-copy-btn"
                    style={{ flex: 1, padding: '8px', fontSize: '0.75rem', background: 'var(--cream)', color: 'var(--ink)', border: 'var(--border)' }}
                    onClick={() => alert('Downloading certified Civic Resumé PDF...')}
                    type="button"
                  >
                    Download PDF
                  </button>
                </div>

                {showLinkedInNotification && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: 'var(--ink)',
                      color: 'var(--cream)',
                      padding: '12px 18px',
                      borderRadius: 'var(--radius)',
                      boxShadow: 'var(--shadow)',
                      textAlign: 'center',
                      zIndex: 10,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                    }}
                  >
                    ✓ Linked successfully! Badge added to LinkedIn Profile.
                  </div>
                )}
              </div>

              {/* Premium Verification Portal Ad */}
              <div
                style={{
                  border: '2px solid var(--ink)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--lavender)',
                  padding: '16px',
                  boxShadow: '4px 4px 0 var(--ink)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '1.1rem' }}>🎓</span>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
                    Verified Portfolio & Certification
                  </h4>
                  <span className="coming-soon-chip" style={{ background: 'var(--hot-pink)', color: 'white', marginLeft: 'auto', fontSize: '0.6rem' }}>
                    PREMIUM
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', lineHeight: 1.3 }}>
                  Officially verify your community service hours! We provide a certified portfolio link to strengthen your foreign university, scholarship, or job applications.
                </p>
                <button
                  className="sos-copy-btn"
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    background: 'var(--ink)',
                    color: 'var(--cream)',
                    marginTop: '4px',
                    alignSelf: 'flex-start',
                  }}
                  onClick={() => setShowPremiumModal(true)}
                  type="button"
                >
                  Learn More & Register →
                </button>
              </div>

            </div>
          </div>

          {/* Premium Tier Modal */}
          {showPremiumModal && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 999,
                padding: '16px',
              }}
            >
              <div
                style={{
                  background: 'var(--cream)',
                  border: '3px solid var(--ink)',
                  borderRadius: 'var(--radius)',
                  padding: '24px',
                  maxWidth: '460px',
                  width: '100%',
                  boxShadow: '8px 8px 0 var(--ink)',
                  position: 'relative',
                }}
              >
                <button
                  style={{ position: 'absolute', top: '12px', right: '16px', border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 700 }}
                  onClick={() => setShowPremiumModal(false)}
                  type="button"
                >
                  ×
                </button>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '12px' }}>
                  Verified Civic Portfolio & Resumé (Premium)
                </h3>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.4, marginBottom: '16px' }}>
                  University admissions (especially Ivy Leagues, UK, and Turkish scholarships) require verified community service. Awaaz-e-GenZ partners with registered NGOs in Pakistan to officially audit your hours.
                </p>
                <ul style={{ fontSize: '0.8rem', lineHeight: 1.4, paddingLeft: '20px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>✓ **NGO Official Verification Stamps**: Digital registry signatures.</li>
                  <li>✓ **Unique Portfolio Web Link**: Shareable directly in CommonApp/UCAS portals.</li>
                  <li>✓ **Certified PDF Printout**: Hand-signed reference letter by coordinating NGOs.</li>
                  <li>✓ **Premium AI Support**: Guidance on how to frame volunteer work in college essays.</li>
                </ul>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid var(--ink)', paddingTop: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', display: 'block', opacity: 0.6 }}>ONE-TIME VERIFICATION PORTFOLIO FEE</span>
                    <strong style={{ fontSize: '1.2rem', color: 'var(--hot-pink)' }}>Rs. 2,500</strong>
                  </div>
                  <button
                    className="sos-copy-btn"
                    style={{ padding: '8px 16px', background: 'var(--ink)', color: 'var(--cream)' }}
                    onClick={() => {
                      alert('Registering interest in premium certification! We will contact you at your account email.')
                      setShowPremiumModal(false)
                    }}
                    type="button"
                  >
                    Register Now
                  </button>
                </div>
              </div>
            </div>
          )}

        </section>
      )}

      {/* Tab 3: Startup Concierge */}
      {activeTab === 'startup' && (
        <section aria-labelledby="startup-heading">
          {/* Quick Presets */}
          <div style={{ marginBottom: '20px' }}>
            <div className="section-label">
              <span className="section-label-text mono">Common Startup Questions</span>
              <div className="section-label-line" />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {STARTUP_PRESETS.map((preset, index) => (
                <button
                  key={index}
                  className="filter-chip"
                  type="button"
                  onClick={() => handleStartupQuery(preset.prompt)}
                  disabled={isChatLoading}
                  style={{ fontSize: '0.72rem', textTransform: 'none', fontFamily: 'inherit', letterSpacing: '0' }}
                >
                  {preset.q}
                </button>
              ))}
            </div>
          </div>

          {/* AI Helper chat interface */}
          <article className="action-tool-card" style={{ marginTop: '0px' }}>
            <div className="action-tool-head" style={{ marginBottom: '16px' }}>
              <span className="action-tool-index" style={{ background: 'var(--lavender)', color: 'var(--ink)' }}>AI</span>
              <div>
                <h2>Legal & Civic Startup Concierge</h2>
                <p>Chat with Awaaz about SECP business registrations, FBR filer requirements, or local municipal permits.</p>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div
              className="chat-area"
              style={{
                background: 'var(--cream-dark)',
                border: 'var(--border)',
                borderRadius: 'var(--radius)',
                padding: '16px',
                minHeight: '260px',
                maxHeight: '400px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', margin: '40px 0', opacity: 0.6 }}>
                  <p style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em' }}>Startup Assistant Ready</p>
                  <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Click one of the presets above or ask your own question below.</p>
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    gap: '8px',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: msg.role === 'user' ? 'var(--ink)' : 'var(--lavender)',
                      color: msg.role === 'user' ? 'var(--cream)' : 'var(--ink)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      flexShrink: 0,
                    }}
                  >
                    {msg.role === 'user' ? 'You' : 'آ'}
                  </div>
                  <div
                    style={{
                      background: msg.role === 'user' ? 'var(--cream)' : 'var(--cream-light)',
                      border: 'var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '10px 14px',
                      maxWidth: '80%',
                      fontSize: '0.85rem',
                      lineHeight: 1.4,
                      boxShadow: '2px 2px 0 rgba(0,0,0,0.05)',
                      whiteSpace: 'pre-line',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '8px',
                    }}
                  >
                    <span style={{ flex: 1 }}>{msg.text}</span>
                    {msg.role === 'bot' && (
                      <SpeechButton
                        text={msg.text}
                        autoPlay={autoSpeak && msg.id === lastBotMessageId}
                      />
                    )}
                  </div>
                </div>
              ))}

              {isChatLoading && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'var(--lavender)',
                      color: 'var(--ink)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      flexShrink: 0,
                    }}
                  >
                    آ
                  </div>
                  <div className="chat-bubble bot chat-thinking" style={{ padding: '10px 14px' }}>
                    <span />
                    Concierge is preparing details...
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form
              className="chat-input-wrap chat-input-bar"
              onSubmit={(e) => {
                e.preventDefault()
                handleStartupQuery(chatInput)
              }}
              style={{ display: 'flex', gap: '8px', background: 'none', border: 'none', padding: '0', alignItems: 'center' }}
            >
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
                style={{ flex: 1, padding: '12px', border: 'var(--border)', borderRadius: 'var(--radius)', fontSize: '0.85rem', minHeight: '45px' }}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask: 'sole proprietorship setup steps' or 'SECP capitalization fees'..."
                disabled={isChatLoading}
              />
              <button
                className="chat-send-btn"
                style={{ background: 'var(--ink)', color: 'var(--cream)', width: '45px', height: '45px', borderRadius: 'var(--radius)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                type="submit"
                disabled={!chatInput.trim() || isChatLoading}
              >
                →
              </button>
            </form>
          </article>
        </section>
      )}
    </div>
  )
}
