import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const FILTERS = ['All', 'Rights', 'Government', 'Elections', 'Law', 'Budget']

const SERVICE_CONTROLS = [
  {
    key: 'sanitation',
    label: 'Waste & sanitation',
    low: 'Garbage pickup slows down and street complaints rise.',
    high: 'Cleaner streets, faster pickup, and fewer health complaints.',
  },
  {
    key: 'health',
    label: 'Public health',
    low: 'Clinics get crowded and basic medicine runs short.',
    high: 'Clinics can handle more patients and prevention improves.',
  },
  {
    key: 'education',
    label: 'Schools & youth',
    low: 'School repairs, libraries, and youth programs are delayed.',
    high: 'More support for classrooms, skills, and young people.',
  },
  {
    key: 'transport',
    label: 'Roads & transport',
    low: 'Road repairs slow down and commute frustration grows.',
    high: 'Road maintenance and transport access improve.',
  },
]

function getBudgetOutcome(taxRate, services) {
  const revenue = Math.round(90 + taxRate * 3)
  const spending = Object.values(services).reduce((total, value) => total + value, 0)
  const balance = revenue - spending
  const serviceAverage = Math.round(spending / SERVICE_CONTROLS.length)
  const taxPressure = Math.max(0, taxRate - 45)
  const satisfaction = Math.max(0, Math.min(100, Math.round(serviceAverage + balance * 0.25 - taxPressure * 0.35)))
  const weakServices = SERVICE_CONTROLS.filter((service) => services[service.key] < 35)
  const strongServices = SERVICE_CONTROLS.filter((service) => services[service.key] > 70)

  const alerts = []
  if (balance < -25) alerts.push('Deficit warning: you are promising more services than the city can pay for.')
  if (balance > 25) alerts.push('Surplus: you have money left, but citizens may ask why services are still underfunded.')
  if (taxRate < 30) alerts.push('Low tax pressure feels popular today, but revenue becomes fragile.')
  if (taxRate > 70) alerts.push('High taxes fund services, but households and small businesses feel pressure.')
  weakServices.slice(0, 2).forEach((service) => alerts.push(service.low))
  if (!alerts.length && strongServices.length >= 2) alerts.push('Balanced momentum: citizens can feel visible improvements in daily life.')
  if (!alerts.length) alerts.push('Stable but watchful: the budget works, but one shock could expose weak services.')

  return {
    revenue,
    spending,
    balance,
    satisfaction,
    alerts,
    mood: satisfaction >= 72 ? 'Trust rising' : satisfaction >= 45 ? 'Mixed public mood' : 'Public frustration',
  }
}

function BudgetSimulator({ onAskAwaaz }) {
  const [taxRate, setTaxRate] = useState(45)
  const [services, setServices] = useState({
    sanitation: 55,
    health: 55,
    education: 55,
    transport: 55,
  })
  const outcome = getBudgetOutcome(taxRate, services)

  function updateService(key, value) {
    setServices((current) => ({
      ...current,
      [key]: Number(value),
    }))
  }

  function loadScenario(type) {
    if (type === 'tax-cut') {
      setTaxRate(25)
      setServices({ sanitation: 32, health: 42, education: 38, transport: 35 })
      return
    }

    if (type === 'service-push') {
      setTaxRate(68)
      setServices({ sanitation: 78, health: 74, education: 72, transport: 66 })
      return
    }

    setTaxRate(45)
    setServices({ sanitation: 55, health: 55, education: 55, transport: 55 })
  }

  return (
    <section className="budget-sim" aria-label="Budget simulator">
      <div className="budget-sim-header">
        <div>
          <p className="budget-sim-kicker mono">Playable civic lab</p>
          <h2>SimCity Pakistan: Balance the Budget</h2>
          <p>
            Move taxes and services, then watch what happens to everyday life.
          </p>
        </div>
        <div className="budget-score" aria-label={`Citizen mood score ${outcome.satisfaction}`}>
          <span>{outcome.satisfaction}</span>
          <small>{outcome.mood}</small>
        </div>
      </div>

      <div className="budget-sim-grid">
        <div className="budget-controls">
          <label className="budget-slider">
            <span>
              Tax/revenue effort
              <strong>{taxRate}%</strong>
            </span>
            <input
              type="range"
              min="10"
              max="90"
              value={taxRate}
              onChange={(event) => setTaxRate(Number(event.target.value))}
            />
          </label>

          {SERVICE_CONTROLS.map((service) => (
            <label className="budget-slider" key={service.key}>
              <span>
                {service.label}
                <strong>{services[service.key]}</strong>
              </span>
              <input
                type="range"
                min="10"
                max="90"
                value={services[service.key]}
                onChange={(event) => updateService(service.key, event.target.value)}
              />
            </label>
          ))}
        </div>

        <div className="budget-dashboard">
          <div className="budget-metrics" aria-label="Budget metrics">
            <div>
              <span>Revenue</span>
              <strong>{outcome.revenue}</strong>
            </div>
            <div>
              <span>Spending</span>
              <strong>{outcome.spending}</strong>
            </div>
            <div className={outcome.balance < 0 ? 'danger' : 'good'}>
              <span>{outcome.balance < 0 ? 'Deficit' : 'Surplus'}</span>
              <strong>{Math.abs(outcome.balance)}</strong>
            </div>
          </div>

          <div className="budget-consequence">
            <p className="budget-sim-kicker mono">What citizens feel</p>
            <ul>
              {outcome.alerts.map((alert) => (
                <li key={alert}>{alert}</li>
              ))}
            </ul>
          </div>

          <div className="budget-actions">
            <button type="button" onClick={() => loadScenario('tax-cut')}>Try tax cut</button>
            <button type="button" onClick={() => loadScenario('service-push')}>Fund services</button>
            <button type="button" onClick={() => loadScenario('balanced')}>Reset</button>
          </div>

          <button
            className="budget-ask-btn"
            type="button"
            onClick={() => onAskAwaaz(`Explain this budget tradeoff: revenue ${outcome.revenue}, spending ${outcome.spending}, balance ${outcome.balance}, citizen mood ${outcome.mood}. What should a young citizen learn from it?`)}
          >
            Ask Awaaz to explain my result
          </button>
        </div>
      </div>
    </section>
  )
}

const ARTICLES = [
  {
    id: 1,
    emoji: '🗳️',
    bg: '#ff2d7a',
    tag: 'Elections',
    title: 'How to Register as a Voter — Step by Step',
    excerpt: 'Turning 18 soon? Here\'s everything you need to know about getting on the voters list — NADRA, NICOP, and what to do if your address changed.',
    details: [
      'Check whether your name is on the electoral roll before election season.',
      'Keep your CNIC details and address updated so your vote is linked to the right area.',
      'If details look wrong, verify the official correction process instead of relying on forwarded messages.',
    ],
    prompts: [
      'How do I check my voter registration in Pakistan?',
      'What should I compare before voting for a candidate?',
    ],
    resources: [
      { label: 'ECP voter registration', type: 'Official', url: 'https://ecp.gov.pk/check-your-registration' },
      { label: 'Short election videos', type: 'Video', url: 'https://www.youtube.com/results?search_query=Pakistan+election+explained+voter+registration' },
    ],
    readTime: '3 min read',
    filter: 'Elections',
  },
  {
    id: 2,
    emoji: '⚖️',
    bg: '#ff6b47',
    tag: 'Rights',
    title: "Your Fundamental Rights — Explained Like You're 17",
    excerpt: "The Constitution gives you rights you've probably never heard of. Article 9 to 28 broken down — no law school required.",
    details: [
      'Rights are not just textbook words; they protect how the State deals with you.',
      'Start with basics: dignity, equality, education, information, movement, and speech.',
      'When a problem happens, write down what happened, who was involved, and what fair outcome you want.',
    ],
    prompts: [
      'What are my fundamental rights in simple words?',
      'What should I do if my rights are violated?',
    ],
    resources: [
      { label: 'Constitution rights overview', type: 'Source', url: 'https://pakistani.org/pakistan/constitution/part2.ch1.html' },
      { label: 'Rights explained videos', type: 'Video', url: 'https://www.youtube.com/results?search_query=fundamental+rights+Pakistan+explained' },
    ],
    readTime: '5 min read',
    filter: 'Rights',
  },
  {
    id: 3,
    emoji: '🏛️',
    bg: '#ff9c2a',
    tag: 'Government',
    title: 'National Assembly vs Senate — What\'s the Difference?',
    excerpt: 'Two houses, one parliament. Why do we need both? Who has more power? And why does it matter for you? Let\'s break it down.',
    details: [
      'The National Assembly is more population-based and directly connected to constituencies.',
      'The Senate balances representation for federating units.',
      'Together, they shape national laws, budgets, debates, and oversight.',
    ],
    prompts: [
      'What is the Senate in Pakistan?',
      'What is the difference between National Assembly and Senate?',
    ],
    resources: [
      { label: 'National Assembly', type: 'Official', url: 'https://na.gov.pk/' },
      { label: 'Senate of Pakistan', type: 'Official', url: 'https://senate.gov.pk/' },
      { label: 'Parliament explained videos', type: 'Video', url: 'https://www.youtube.com/results?search_query=Pakistan+parliament+National+Assembly+Senate+explained' },
    ],
    readTime: '4 min read',
    filter: 'Government',
  },
  {
    id: 4,
    emoji: '📋',
    bg: '#3df5b4',
    tag: 'Law',
    title: 'Right to Information — Your Secret Weapon',
    excerpt: 'RTI laws let you demand answers from the government. Like, actually. Here\'s how to file an RTI and what you can ask for.',
    details: [
      'RTI requests work best when they are specific and polite.',
      'Ask for a record, decision, budget, policy, or status update from the relevant public body.',
      'Save your request and follow up with dates so there is a paper trail.',
    ],
    prompts: [
      'RTI request kaise file karun?',
      'What can I ask for in an RTI request?',
    ],
    resources: [
      { label: 'Pakistan Information Commission', type: 'Official', url: 'https://rti.gov.pk/' },
      { label: 'RTI tutorial videos', type: 'Video', url: 'https://www.youtube.com/results?search_query=Pakistan+RTI+request+how+to+file' },
    ],
    readTime: '3 min read',
    filter: 'Law',
  },
  {
    id: 5,
    emoji: '💰',
    bg: '#c4a8ff',
    tag: 'Budget',
    title: "Pakistan's Federal Budget — Where Does Your Tax Money Go?",
    excerpt: 'The budget is just the government\'s spending plan. But whose priorities are in it? And how does it actually affect your life?',
    details: [
      'A budget shows what government says it values: services, infrastructure, salaries, subsidies, and development.',
      'For citizens, the useful question is: what changed for education, health, transport, jobs, and local services?',
      'Follow public budget summaries, but look for plain-language explainers and official documents where possible.',
    ],
    prompts: [
      'Pakistan budget simple words mein samjhao',
      'How does the federal budget affect students?',
    ],
    resources: [
      { label: 'Ministry of Finance budget', type: 'Official', url: 'https://www.finance.gov.pk/budget/budget.html' },
      { label: 'Budget explained videos', type: 'Video', url: 'https://www.youtube.com/results?search_query=Pakistan+federal+budget+explained' },
    ],
    readTime: '6 min read',
    filter: 'Budget',
  },
]

export default function Learn() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [openArticleId, setOpenArticleId] = useState(null)
  const navigate = useNavigate()

  const filtered = activeFilter === 'All'
    ? ARTICLES
    : ARTICLES.filter(a => a.filter === activeFilter)

  function askAwaaz(prompt) {
    navigate('/ask', { state: { prompt } })
  }

  return (
    <div className="learn-page page-wrap">
      <div className="page-header">
        <p className="page-eyebrow">Explainers</p>
        <h1 className="page-title">
          Explain Like I'm <span className="page-title-accent">GenZ</span>
        </h1>
        <p className="page-sub">Heavy civic topics — made actually understandable.</p>
      </div>

      {/* Filter chips */}
      <div className="filter-chips" role="group" aria-label="Filter articles">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`filter-chip${activeFilter === f ? ' active' : ''}`}
            onClick={() => setActiveFilter(f)}
            aria-pressed={activeFilter === f}
            id={`filter-${f.toLowerCase()}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Article list */}
      <div className="article-list" role="list">
        {filtered.map((article, i) => (
          <article
            key={article.id}
            className="article-card anim-fade-up"
            style={{ animationDelay: `${i * 0.07}s` }}
            role="listitem"
            tabIndex={0}
            aria-label={article.title}
            id={`article-${article.id}`}
            onClick={() => setOpenArticleId(openArticleId === article.id ? null : article.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                setOpenArticleId(openArticleId === article.id ? null : article.id)
              }
            }}
          >
            <div
              className="article-thumb"
              style={{ background: article.bg }}
              aria-hidden="true"
            >
              {article.emoji}
            </div>
            <div className="article-body">
              <span className="article-tag">{article.tag}</span>
              <h2 className="article-title">{article.title}</h2>
              <p className="article-excerpt">{article.excerpt}</p>
              {openArticleId === article.id && (
                <div className="article-expanded">
                  <ul className="article-details">
                    {article.details.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <div className="article-action-panel" onClick={(event) => event.stopPropagation()}>
                    <div>
                      <p className="article-panel-label">Ask Awaaz next</p>
                      <div className="article-question-list">
                        {article.prompts.map((prompt) => (
                          <button
                            key={prompt}
                            type="button"
                            className="article-question-chip"
                            onClick={() => askAwaaz(prompt)}
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="article-panel-label">Watch or verify</p>
                      <div className="article-resource-list">
                        {article.resources.map((resource) => (
                          <a
                            key={resource.url}
                            className="article-resource-link"
                            href={resource.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <span>{resource.label}</span>
                            <em>{resource.type}</em>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  {article.filter === 'Budget' && (
                    <div className="article-simulator-wrap" onClick={(event) => event.stopPropagation()}>
                      <div className="article-simulator-intro">
                        <p className="article-panel-label">Try a simulator to better understand</p>
                        <p>
                          Play with taxes and services to see why budgets create real tradeoffs.
                        </p>
                      </div>
                      <BudgetSimulator onAskAwaaz={askAwaaz} />
                    </div>
                  )}
                </div>
              )}
              <span className="article-read-more">
                {openArticleId === article.id ? 'Hide' : 'Read'} → &nbsp;
                <span style={{ opacity: 0.5, fontWeight: 400 }}>{article.readTime}</span>
              </span>
            </div>
          </article>
        ))}
      </div>

      <div style={{ padding: '32px 0 16px', textAlign: 'center' }}>
        <span className="coming-soon-chip">✍️ More articles coming soon</span>
      </div>
    </div>
  )
}
