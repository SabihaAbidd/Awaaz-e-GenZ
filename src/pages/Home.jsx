import { useNavigate } from 'react-router-dom'
import { IconAsk, IconExplain, IconSOS, IconCards, IconQuiz, IconAction, IconArrow } from '../Icons.jsx'

/* ─────────────────────────────────────────
   HERO ILLUSTRATIONS (inline SVG)
───────────────────────────────────────── */
function MegaphoneIllus() {
  return (
    // Bell faces left, handle lower-right. viewBox extends left for sound-wave lines.
    <svg
      className="collage-illus collage-megaphone"
      width="148" height="96"
      viewBox="-16 0 164 96"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <pattern id="megaDots" width="3.6" height="3.6" patternUnits="userSpaceOnUse">
          <rect width="3.6" height="3.6" fill="#f5f0e8" />
          <circle cx="1" cy="1" r="0.88" fill="#0d0d0d" />
        </pattern>
      </defs>

      {/* ── Sound-wave lines (white, left of bell opening) ── */}
      <path d="M4 14 L-12 4"  stroke="white" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M0 48 L-14 48" stroke="white" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M4 82 L-12 92" stroke="white" strokeWidth="4.5" strokeLinecap="round" />

      {/* ── White sticker outline (behind everything) ── */}
      <g fill="white" stroke="white" strokeWidth="13" strokeLinejoin="round" strokeLinecap="round">
        {/* Bell cone: wide on left (x=4, y=4→y=92), narrows to neck (x=70, y=24→y=72) */}
        <path d="M4 4 L4 92 L70 72 L70 24 Z" />
        {/* Body cylinder */}
        <rect x="68" y="22" width="48" height="52" rx="6" />
        {/* Handle */}
        <path d="M90 72 L92 88 C93 94 84 95 78 91 C72 87 72 80 76 75 L84 72 Z" />
        {/* Nozzle/mouthpiece */}
        <rect x="113" y="30" width="16" height="36" rx="5" />
      </g>

      {/* ── Bell cone – dark halftone ── */}
      <path d="M4 4 L4 92 L70 72 L70 24 Z" fill="url(#megaDots)" />
      <path d="M4 4 L4 92 L70 72 L70 24 Z" fill="#0d0d0d" opacity="0.55" />
      {/* Bell highlight stripe */}
      <path d="M10 18 C8 32 8 46 10 60" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
      {/* Bell rim detail */}
      <line x1="4" y1="4"  x2="4" y2="92" stroke="#0d0d0d" strokeWidth="2.5" />

      {/* ── Body ── */}
      <rect x="68" y="22" width="46" height="52" rx="6" fill="#0d0d0d" />
      <path d="M72 28 L108 28" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M72 66 L108 66" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />

      {/* ── Handle ── */}
      <path d="M88 72 L90 88 C91 94 82 95 76 91 C70 87 70 80 74 75 L82 72 Z"
        fill="#0d0d0d" />
      <path d="M75 77 C73 83 75 89 79 92" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4" />

      {/* ── Nozzle/mouthpiece (light-coloured, like a real speaker grille) ── */}
      <rect x="113" y="32" width="14" height="32" rx="4" fill="#f5f0e8" stroke="#0d0d0d" strokeWidth="2.5" />
      {[38,44,50,56].map(y => (
        <line key={y} x1="116" y1={y} x2="124" y2={y}
          stroke="#0d0d0d" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
      ))}
    </svg>
  )
}


function ShieldIcon() {
  return (
    <svg width="28" height="33" viewBox="0 0 28 33" fill="none" aria-hidden="true">
      <path d="M14 2 L26 8.5 L26 19 Q26 29 14 32 Q2 29 2 19 L2 8.5 Z"
        fill="rgba(0,0,0,0.08)" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M8 17 L12 21 L20 13"
        stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="28" height="30" viewBox="0 0 28 30" fill="none" aria-hidden="true">
      <rect x="2" y="5" width="24" height="23" rx="3" fill="rgba(0,0,0,0.08)" stroke="var(--ink)" strokeWidth="2"/>
      <rect x="2" y="5" width="24" height="9" rx="3" fill="var(--ink)"/>
      <rect x="8" y="2" width="3" height="6" rx="1.5" fill="var(--ink)"/>
      <rect x="17" y="2" width="3" height="6" rx="1.5" fill="var(--ink)"/>
      <circle cx="8.5" cy="21" r="2" fill="var(--ink)"/>
      <circle cx="14" cy="21" r="2" fill="var(--ink)"/>
      <circle cx="19.5" cy="21" r="2" fill="var(--ink)"/>
    </svg>
  )
}

function HandIllus() {
  // Open palm rising upward — halftone editorial sticker cutout.
  const knuckleY = [42, 38, 40, 46]
  const fingers = [
    { x: 10, y: 14, w: 13, h: 46, rx: 6 }, // index
    { x: 25, y:  9, w: 14, h: 52, rx: 6 }, // middle (tallest)
    { x: 41, y: 13, w: 13, h: 48, rx: 6 }, // ring
    { x: 56, y: 22, w: 12, h: 40, rx: 6 }, // pinky
  ]
  return (
    <svg
      className="collage-illus collage-hand"
      width="82" height="90"
      viewBox="0 0 82 90"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <pattern id="handDots" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="#d8d8d8" />
          <circle cx="1.1" cy="1.1" r="1.05" fill="#0d0d0d" />
        </pattern>
      </defs>

      {/* White sticker outline — drawn first so it sits behind */}
      <g fill="white" stroke="white" strokeWidth="12" strokeLinejoin="round" strokeLinecap="round">
        {fingers.map((f, i) => <rect key={i} x={f.x} y={f.y} width={f.w} height={f.h} rx={f.rx} />)}
        <path d="M4 60 C4 50 5 39 11 33 C17 27 21 33 21 42 L21 62 Z" />
        <rect x="6" y="57" width="66" height="22" rx="5" />
        <rect x="2" y="73" width="74" height="17" rx="4" />
      </g>

      {/* Halftone fingers + palm */}
      <g fill="url(#handDots)" stroke="#0d0d0d" strokeWidth="2.5" strokeLinejoin="round">
        {fingers.map((f, i) => <rect key={i} x={f.x} y={f.y} width={f.w} height={f.h} rx={f.rx} />)}
        <path d="M4 60 C4 50 5 39 11 33 C17 27 21 33 21 42 L21 62 Z" />
        <rect x="6" y="57" width="66" height="22" rx="5" />
      </g>

      {/* Knuckle crease lines */}
      {fingers.map((f, i) => (
        <line key={i}
          x1={f.x + 1} y1={knuckleY[i]}
          x2={f.x + f.w - 1} y2={knuckleY[i]}
          stroke="#0d0d0d" strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
      ))}

      {/* Dark sleeve/cuff */}
      <rect x="2" y="73" width="74" height="17" rx="4" fill="#0d0d0d" />
      {[18, 33, 48, 62].map(x => (
        <line key={x} x1={x} y1={73} x2={x} y2={90}
          stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
      ))}
    </svg>
  )
}


/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const TICKER_ITEMS = [
  { text: 'AI for Gen Z', color: 'pink' },
  { text: 'آواز اُٹھاؤ', color: 'orange' },
  { text: 'Know Your Rights', color: 'mint' },
  { text: 'Powered by AI', color: 'pink' },
  { text: 'اردو + English', color: 'orange' },
  { text: 'Daily Civic Drops', color: 'mint' },
  { text: 'Be Heard', color: 'pink' },
  { text: 'Quiz Yourself', color: 'orange' },
]

const FEATURE_CARDS = [
  {
    id: 'ask-awaaz',
    to: '/ask',
    title: 'Ask Awaaz',
    desc: 'Ask any civic question. Get real answers — no textbook boring.',
    icon: <IconAsk />,
    colorClass: 'card--pink',
  },
  {
    id: 'explain-genz',
    to: '/learn',
    title: "Explain Like I'm GenZ",
    desc: 'Heavy topics, made actually understandable. No jargon allowed.',
    icon: <IconExplain />,
    colorClass: 'card--coral',
  },
  {
    id: 'civic-sos',
    to: '/sos',
    title: 'Civic SOS',
    desc: 'Type a real issue. Get a safe, practical civic action plan.',
    icon: <IconSOS />,
    colorClass: 'card--yellow',
  },
  {
    id: 'collab-hub',
    to: '/collab',
    title: 'Collab Hub',
    desc: 'Find regional events, earn a verified Civic Resumé, and start your startup path.',
    icon: <IconAction />,
    colorClass: 'card--lavender',
  },
  {
    id: 'daily-cards',
    to: '/cards',
    title: 'Daily Civic Cards',
    desc: 'One bite-size civic fact. Every. Single. Day.',
    icon: <IconCards />,
    colorClass: 'card--orange',
  },
  {
    id: 'civic-quiz',
    to: '/quiz',
    title: 'Take a Civic Quiz',
    desc: 'Test your knowledge. Flex your rights. Level up.',
    icon: <IconQuiz />,
    colorClass: 'card--mint',
  },
]

const HIGHLIGHTS = [
  { num: '2',  label: 'Languages',  sub: 'Urdu & English — both, not one or the other', colorClass: 'hb--pink',     bg: '#ff2d7a' },
  { num: '3',  label: 'Next steps', sub: 'A simple path instead of a wall of text',      colorClass: '',             bg: null },
  { num: '1',  label: 'Ready message', sub: 'Copy a calm complaint draft in seconds',    colorClass: 'hb--lavender', bg: '#c4a8ff' },
]

/* ─────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────── */
function Ticker() {
  const all = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div className="ticker-wrap" aria-hidden="true">
      <div className="ticker-track">
        {all.map((item, i) => (
          <span className="ticker-item" key={i}>
            <span className={`ticker-dot ${item.color}`} />
            {item.text}
          </span>
        ))}
      </div>
    </div>
  )
}

function FeatureCard({ card, index }) {
  const navigate = useNavigate()
  return (
    <article
      className={`feature-card ${card.colorClass} anim-fade-up anim-delay-${index + 2}`}
      id={`card-${card.id}`}
      tabIndex={0}
      role="button"
      aria-label={`Go to ${card.title}`}
      onClick={() => navigate(card.to, card.state ? { state: card.state } : undefined)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(card.to, card.state ? { state: card.state } : undefined)}
    >
      <div className="card-icon-wrap" aria-hidden="true">{card.icon}</div>
      <h3 className="card-title">{card.title}</h3>
      <p className="card-desc">{card.desc}</p>
      <div className="card-arrow" aria-hidden="true"><IconArrow /></div>
    </article>
  )
}

/* ─────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="page-wrap">

      {/* ══════════════════════════════════════
          HERO — Two column with right collage
          ══════════════════════════════════════ */}
      <section className="hero-v2" aria-labelledby="hero-title">

        {/* ── LEFT: Text + CTAs ── */}
        <div className="hero-left">
          <p className="hero-eyebrow-v2">Civic Platform</p>

          {/* Title block */}
          <div className="hero-title-area">
            {/* Floating doodles */}
            <span className="doodle doodle-spark-tr" aria-hidden="true">✦</span>
            <span className="doodle doodle-star-left" aria-hidden="true">*</span>
            <span className="doodle doodle-pop-left" aria-hidden="true" />
            <span className="doodle doodle-pop-right" aria-hidden="true" />
            <span className="doodle doodle-swoop" aria-hidden="true" />

            <h1 id="hero-title">
              <span className="hero-awaaz">Awaaz</span>
              <div className="hero-row2">
                <span className="hero-e-badge">-e-</span>
                <span className="hero-genz-badge">GenZ</span>
              </div>
            </h1>

            {/* Squiggly decoration below */}
            <div className="doodle-squig" aria-hidden="true">
              <svg width="58" height="18" viewBox="0 0 58 18" fill="none">
                <path
                  d="M2 9 Q10 1 18 9 Q26 17 34 9 Q42 1 50 9 Q54 13 58 9"
                  stroke="#0d0d0d"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <p className="hero-tagline-v2">
            Civic awareness for the generation<br />ready to be heard.
          </p>
          <p className="hero-desc-v2">
            Turn civic confusion into a clear next step in Urdu or English.
          </p>

          {/* CTAs */}
          <div className="hero-ctas">
            <button
              id="hero-ask-btn"
              className="btn-primary-hero"
              type="button"
              onClick={() => navigate('/sos')}
            >
              Tell Awaaz What Happened
            </button>
            <button
              id="hero-explore-btn"
              className="btn-secondary-hero"
              type="button"
              onClick={() => navigate('/learn')}
            >
              Explore Topics →
            </button>
          </div>

          {/* Social proof */}
          <div className="hero-social-proof">
            <div className="avatar-stack" aria-label="Community members">
              <div className="avatar-item" style={{ background: '#ff2d7a' }}>AK</div>
              <div className="avatar-item" style={{ background: '#ff6b47' }}>BT</div>
              <div className="avatar-item" style={{ background: '#7dbb8a' }}>NF</div>
              <div className="avatar-count" aria-label="2000 plus users">2K+</div>
            </div>
            <p className="hero-social-text">
              Young voices are turning problems into action.
            </p>
          </div>
        </div>

        {/* ── RIGHT: Card collage (desktop) ── */}
        <div className="hero-right" aria-hidden="true">
          <span className="collage-doodle collage-lines-top" />
          <span className="collage-doodle collage-lines-right" />
          <span className="collage-doodle collage-loop" />
          <span className="collage-doodle collage-spark" />

          {/* Pink — آواز card */}
          <div className="collage-card collage-pink">
            <span className="card-halftone card-halftone-pink" />
            <div className="collage-pink-inner">
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p className="collage-urdu">آواز</p>
                <span className="collage-urdu-sep" aria-hidden="true" />
                <p className="collage-sub collage-sub-light" style={{ marginTop: '8px' }}>
                  YOUR VOICE.<br />YOUR COUNTRY.
                </p>
              </div>
              <MegaphoneIllus />
            </div>
          </div>

          {/* Middle row: Orange + Mint */}
          <div className="collage-mid-row">
            <div className="collage-card collage-orange">
              <span className="card-halftone card-halftone-orange" />
              <ShieldIcon />
              <p className="collage-small-title">KNOW<br />YOUR<br />RIGHTS</p>
              <p className="collage-support">Learn the laws. Know your power.</p>
              <span className="collage-arrow">→</span>
            </div>

            <div className="collage-card collage-mint">
              <span className="card-halftone card-halftone-mint" />
              <CalendarIcon />
              <p className="collage-small-title">DAILY<br />CIVIC<br />DROPS</p>
              <p className="collage-support">Short. Simple. Super useful.</p>
              <span className="collage-arrow">→</span>
            </div>
          </div>

          {/* Lavender — Be Heard */}
          <div className="collage-card collage-lavender">
            <span className="card-halftone card-halftone-lavender" />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p className="collage-be-heard">BE HEARD</p>
              <p className="collage-sub collage-sub-dark" style={{ marginTop: '6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Share.&nbsp; Speak.&nbsp; Impact.
              </p>
              <span className="collage-arrow" style={{ marginTop: '10px' }}>→</span>
            </div>
            <HandIllus />
          </div>

        </div>
      </section>

      {/* ── TICKER ── */}
      <Ticker />

      {/* ── FEATURE CARDS ── */}
      <section className="cards-section" aria-labelledby="cards-heading">
        <div className="section-label">
          <span className="mono section-label-text" id="cards-heading">Features</span>
          <div className="section-label-line" aria-hidden="true" />
        </div>
        <div className="cards-grid" role="list">
          {FEATURE_CARDS.map((card, i) => (
            <FeatureCard key={card.id} card={card} index={i} />
          ))}
        </div>
      </section>

      {/* ── HIGHLIGHTS ── */}
      <section className="highlights" aria-label="App highlights">
        {HIGHLIGHTS.map((h, i) => (
          <div
            key={i}
            className={`highlight-block ${h.colorClass}`}
            style={h.bg ? { background: h.bg, border: '2px solid #0d0d0d' } : {}}
          >
            <div className="highlight-num">{h.num}</div>
            <div>
              <div className="highlight-text">{h.label}</div>
              <span className="highlight-sub">{h.sub}</span>
            </div>
            <div className="bg-label" aria-hidden="true">{h.num}</div>
          </div>
        ))}
      </section>

      {/* ── CTA ── */}
      <section className="cta-section" aria-labelledby="cta-heading">
        <div className="cta-inner">
          <div className="cta-inner-text">
            <p className="cta-sub">Civic SOS is ready to try</p>
            <h2 className="cta-headline" id="cta-heading">
              Your <span>problem</span> deserves a next step.
            </h2>
          </div>
          <div className="cta-inner-action">
            <div className="cta-lang-badges">
              <span className="lang-badge">اردو</span>
              <span className="lang-badge">English</span>
            </div>
            <button
              id="cta-notify-btn"
              className="cta-btn"
              type="button"
              aria-label="Try Civic SOS"
              onClick={() => navigate('/sos')}
            >
              Try Civic SOS
            </button>
          </div>
        </div>
      </section>

    </div>
  )
}
