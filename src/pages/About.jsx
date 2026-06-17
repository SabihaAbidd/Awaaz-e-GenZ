const STACK = [
  'AI-assisted',
  'Pakistan-focused',
  'Urdu + English',
  'Mobile-first',
  'Gen Z first',
  'Action plans',
  'Demo-safe',
]

const TEAM = [
  { emoji: '👩🏽‍💻', name: 'Rafia Ali',     role: ''  },
  { emoji: '👩🏽‍🎨', name: 'Sabiha Abid',    role: ''  },
]

export default function About() {
  return (
    <div className="about-page page-wrap">
      <div className="page-header">
        <p className="page-eyebrow">Our Story</p>
        <h1 className="page-title">
          About <span className="page-title-accent">Awaaz</span>
        </h1>
        <p className="page-sub">
          Built by young Pakistanis, for young Pakistanis.
        </p>
      </div>

      {/* Mission + Quote */}
      <div className="about-grid" style={{ marginBottom: '28px' }}>
        <div className="about-mission-block">
          <h2 className="about-mission-title">Our Mission</h2>
          <p className="about-mission-text">
            Civic knowledge in Pakistan is locked behind textbooks nobody reads,
            jargon nobody understands, and conversations nobody has.
          </p>
          <br />
          <p className="about-mission-text">
            Awaaz-e-GenZ breaks that open. We use AI to make civic awareness
            accessible, bilingual, and actually interesting for the generation
            that will shape Pakistan's next chapter.
          </p>
          <br />
          <p className="about-mission-text">
            آواز اُٹھاؤ۔ حق مانگو۔ — Raise your voice. Claim your rights.
          </p>
        </div>

        <div className="about-quote-block">
          <p className="about-quote">
            "Young people do not need another long guide. They need a clear next step when civic life gets confusing."
          </p>
          <p className="about-quote-attr">— The Awaaz Team</p>
        </div>
      </div>

      {/* Stack pills */}
      <div className="section-label">
        <span className="section-label-text mono">Built with</span>
        <div className="section-label-line" />
      </div>
      <div className="about-stack-row">
        {STACK.map((s, i) => (
          <span key={i} className="about-stack-pill">{s}</span>
        ))}
      </div>

      {/* Team */}
      <div className="about-team-section">
        <div className="section-label">
          <span className="section-label-text mono">Team</span>
          <div className="section-label-line" />
        </div>

        <div className="about-team-grid">
          {TEAM.map((member, i) => (
            <div
              key={i}
              className="about-team-card anim-fade-up"
              style={{ animationDelay: `${i * 0.06}s` }}
              id={`team-${member.name.toLowerCase().replace(' ', '-')}`}
            >
              <div
                className="about-team-avatar"
                style={{ background: ['#ff2d7a','#ff9c2a','#3df5b4','#c4a8ff','#ff6b47','#7dbb8a'][i] }}
                aria-hidden="true"
              >
                {member.emoji}
              </div>
              <p className="about-team-name">{member.name}</p>
              {member.role && <p className="about-team-role">{member.role}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          border: 'var(--border)',
          borderRadius: 'var(--radius)',
          background: 'var(--lavender)',
          padding: '24px 20px',
          boxShadow: 'var(--shadow)',
          marginBottom: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          alignItems: 'flex-start',
        }}
      >
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
          Join the movement
        </p>
        <p style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.3 }}>
          Want to contribute, partner, or just say salaam?
        </p>
        <button
          id="about-contact-btn"
          className="cta-btn"
          style={{ background: 'var(--ink)', border: '2px solid var(--ink)', boxShadow: '4px 4px 0 var(--lavender), 4px 4px 0 2px var(--ink)' }}
          type="button"
          onClick={() => window.location.href = 'mailto:hello@awaaz.local?subject=Awaaz-e-GenZ%20Collaboration'}
        >
          Get in Touch
        </button>
      </div>

      <div style={{ paddingBottom: '16px' }} />
    </div>
  )
}
