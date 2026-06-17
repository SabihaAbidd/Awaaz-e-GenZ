/* ─────────────────────────────────────────────────────────────
   ImpactSection.jsx
   "Why Awaaz-e-GenZ Matters" — hackathon impact showcase.
   No backend / no fake numbers. Pure design + copy.
───────────────────────────────────────────────────────────── */

const IMPACT_CARDS = [
  {
    id:    'civic-confidence',
    color: 'var(--hot-pink)',
    icon:  '🗳️',
    title: 'Civic Confidence',
    body:  'Users understand rights, voting, public issues, and institutions in simple, everyday language.',
    tag:   'Knowledge',
  },
  {
    id:    'better-participation',
    color: 'var(--orange)',
    icon:  '✊',
    title: 'Better Participation',
    body:  'Young people move from passive scrolling to small civic actions — asking, learning, sharing, and voting.',
    tag:   'Behaviour',
  },
  {
    id:    'accessible-knowledge',
    color: 'var(--mint)',
    icon:  '🌐',
    title: 'Accessible Knowledge',
    body:  'English and Pakistani Roman Urdu support makes civic learning easier for far more young people.',
    tag:   'Inclusion',
  },
  {
    id:    'safer-info',
    color: 'var(--lavender)',
    icon:  '🔍',
    title: 'Safer Information Habits',
    body:  'Users learn how to identify misinformation and verify important civic information themselves.',
    tag:   'Media Literacy',
  },
]

const METRICS = [
  { icon: '💬', label: 'Questions asked in Ask Awaaz' },
  { icon: '📖', label: 'Learn topics opened' },
  { icon: '✅', label: 'Quiz completion rate' },
  { icon: '📈', label: 'Average quiz score improvement' },
  { icon: '🃏', label: 'Civic cards saved / shared' },
  { icon: '🇵🇰', label: 'Roman Urdu usage rate' },
  { icon: '💪', label: 'Users reporting increased civic confidence' },
]

export default function ImpactSection() {
  return (
    <section className="impact-section" aria-labelledby="impact-heading">

      {/* ── Section label ── */}
      <div className="section-label">
        <span className="section-label-text mono" id="impact-label">Impact</span>
        <div className="section-label-line" aria-hidden="true" />
      </div>

      {/* ── Heading + Intro ── */}
      <div className="impact-header">
        <h2 className="impact-heading" id="impact-heading">
          Why <span className="impact-heading-accent">Awaaz-e-GenZ</span> matters
        </h2>
        <p className="impact-intro">
          Many young people — especially girls and first-time voters — feel disconnected from
          civic life because information about rights, voting, public institutions, and
          misinformation is often complex, boring, or not explained in language they actually
          use. <strong>Awaaz-e-GenZ turns civic knowledge into simple, interactive,
          bilingual learning.</strong>
        </p>
      </div>

      {/* ── 4 Impact Cards ── */}
      <div className="impact-cards-grid" role="list">
        {IMPACT_CARDS.map((card, i) => (
          <article
            key={card.id}
            id={`impact-${card.id}`}
            className="impact-card"
            role="listitem"
            style={{ '--card-accent': card.color, animationDelay: `${i * 0.07}s` }}
          >
            <div className="impact-card-top">
              <span className="impact-card-icon" aria-hidden="true">{card.icon}</span>
              <span className="impact-card-tag">{card.tag}</span>
            </div>
            <h3 className="impact-card-title">{card.title}</h3>
            <p className="impact-card-body">{card.body}</p>
            {/* Bottom accent bar */}
            <div className="impact-card-bar" aria-hidden="true" />
          </article>
        ))}
      </div>

      {/* ── Metrics Row ── */}
      <div className="impact-metrics-wrap">
        <div className="impact-metrics-header">
          <span className="impact-metrics-eyebrow mono">Metrics we would track</span>
        </div>
        <ul className="impact-metrics-list" aria-label="Metrics we would track">
          {METRICS.map((m, i) => (
            <li key={i} className="impact-metric-item">
              <span className="impact-metric-icon" aria-hidden="true">{m.icon}</span>
              <span className="impact-metric-label">{m.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Responsible AI mini-card ── */}
      <div className="impact-ai-card" id="responsible-ai">
        <div className="impact-ai-badge" aria-hidden="true">🤖</div>
        <div className="impact-ai-body">
          <p className="impact-ai-title">Built for neutral civic learning</p>
          <p className="impact-ai-text">
            Awaaz-e-GenZ is designed to explain civic concepts, not influence political
            choices. It does not recommend parties or candidates, and users are encouraged
            to verify official election and legal information from authoritative sources.
          </p>
        </div>
      </div>

    </section>
  )
}
