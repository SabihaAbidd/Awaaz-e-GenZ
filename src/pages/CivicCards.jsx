const TODAY = new Date().toLocaleDateString('en-PK', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
})

const PAST_CARDS = [
  {
    id: 1,
    bg: '#ff2d7a',
    num: '18',
    fact: 'The minimum age to vote in Pakistan is 18 years.',
    date: 'Jun 12',
  },
  {
    id: 2,
    bg: '#c4a8ff',
    num: '336',
    fact: 'The National Assembly has 336 seats: 266 general, 60 women, and 10 non-Muslim seats.',
    date: 'Jun 11',
  },
  {
    id: 3,
    bg: '#3df5b4',
    num: '1973',
    fact: 'Pakistan\'s current Constitution was adopted in 1973.',
    date: 'Jun 10',
  },
  {
    id: 4,
    bg: '#ff6b47',
    num: '25',
    fact: 'Article 25 guarantees equality of all citizens before the law.',
    date: 'Jun 9',
  },
  {
    id: 5,
    bg: '#ffd23f',
    num: '4',
    fact: 'Pakistan has 4 provinces: Punjab, Sindh, KPK, and Balochistan.',
    date: 'Jun 8',
  },
  {
    id: 6,
    bg: '#7dbb8a',
    num: '96',
    fact: 'The Senate has 96 seats, with equal provincial representation and seats for Islamabad.',
    date: 'Jun 7',
  },
]

export default function CivicCards() {
  return (
    <div className="cards-page page-wrap">
      <div className="page-header">
        <p className="page-eyebrow">Daily Drop</p>
        <h1 className="page-title">
          Civic <span className="page-title-accent">Cards</span>
        </h1>
        <p className="page-sub">One fact. One day. Every day.</p>
      </div>

      {/* Today's featured card */}
      <section aria-labelledby="todays-card">
        <div className="section-label">
          <span className="section-label-text mono" id="todays-card">Today's Card</span>
          <div className="section-label-line" />
        </div>

        <div className="daily-card-featured" id="featured-civic-card">
          <p className="daily-card-date">{TODAY}</p>
          <div className="daily-card-stat">25A</div>
          <p className="daily-card-fact">
            Article 25A says the State shall provide free and compulsory education
            for children aged 5 to 16.
          </p>
          <p className="daily-card-source">Source: Constitution of Pakistan, Article 25A</p>
        </div>

        <div className="swipe-hint" aria-hidden="true">
          ← swipe to browse past cards →
        </div>
      </section>

      {/* Past cards */}
      <section aria-labelledby="past-cards-heading" style={{ paddingBottom: '32px' }}>
        <div className="section-label">
          <span className="section-label-text mono" id="past-cards-heading">Archive</span>
          <div className="section-label-line" />
        </div>

        <div className="past-cards-grid">
          {PAST_CARDS.map((card, i) => (
            <div
              key={card.id}
              className="past-card anim-fade-up"
              style={{
                background: card.bg,
                animationDelay: `${i * 0.06}s`,
              }}
              tabIndex={0}
              role="article"
              aria-label={`Civic card: ${card.fact}`}
              id={`past-card-${card.id}`}
            >
              <div className="past-card-num">{card.num}</div>
              <p className="past-card-fact">{card.fact}</p>
              <p className="past-card-date">{card.date}</p>
            </div>
          ))}
        </div>
      </section>

      <div style={{ paddingBottom: '16px', textAlign: 'center' }}>
        <span className="coming-soon-chip">📬 Daily cards delivered soon</span>
      </div>
    </div>
  )
}
