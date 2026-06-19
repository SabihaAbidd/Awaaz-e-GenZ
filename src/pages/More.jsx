import { NavLink } from 'react-router-dom'

const MORE_ITEMS = [
  {
    to: '/learn',
    icon: '📚',
    label: 'Learn',
    desc: 'Explore civic topics and guides',
    accent: 'var(--coral)',
  },
  {
    to: '/cards',
    icon: '🃏',
    label: 'Cards',
    desc: 'Quick civic knowledge cards',
    accent: 'var(--orange)',
  },
  {
    to: '/quiz',
    icon: '📝',
    label: 'Quiz',
    desc: 'Test your civic awareness',
    accent: 'var(--mint)',
  },
  {
    to: '/collab',
    icon: '🤝',
    label: 'Collaborate',
    desc: 'Join initiatives and projects',
    accent: 'var(--lavender)',
  },
  {
    to: '/about',
    icon: 'ℹ️',
    label: 'About',
    desc: 'Learn about Awaaz-e-GenZ',
    accent: 'var(--hot-pink)',
  },
]

function MoreMenuItem({ item }) {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) => `more-menu-item${isActive ? ' active' : ''}`}
      style={{ '--item-accent': item.accent }}
    >
      <span className="more-menu-icon" aria-hidden="true">{item.icon}</span>
      <span className="more-menu-copy">
        <span className="more-menu-label">{item.label}</span>
        <span className="more-menu-desc">{item.desc}</span>
      </span>
      <span className="more-menu-arrow" aria-hidden="true">→</span>
    </NavLink>
  )
}

export default function More() {
  return (
    <div className="more-page page-wrap">
      <header className="page-header more-header">
        <p className="page-eyebrow">Navigation</p>
        <h1 className="page-title">More</h1>
        <p className="page-sub">Explore the rest of Awaaz-e-GenZ.</p>
      </header>

      <nav className="more-menu" aria-label="More navigation">
        {MORE_ITEMS.map((item) => (
          <MoreMenuItem key={item.to} item={item} />
        ))}
      </nav>
    </div>
  )
}
