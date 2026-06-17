import { NavLink } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/',          label: 'Home' },
  { to: '/ask',       label: 'Ask Awaaz' },
  { to: '/sos',       label: 'Civic SOS' },
  { to: '/collab',    label: 'Collab Hub' },
  { to: '/learn',     label: 'Learn' },
  { to: '/cards',     label: 'Civic Cards' },
  { to: '/quiz',      label: 'Quiz' },
  { to: '/about',     label: 'About' },
]

export default function TopNav() {
  return (
    <nav className="top-nav" aria-label="Main navigation">
      <NavLink to="/" className="top-nav-logo" aria-label="Awaaz-e-GenZ Home">
        آواز-e-GenZ
      </NavLink>

      <ul className="top-nav-links" role="list">
        {NAV_LINKS.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `top-nav-link${isActive ? ' active' : ''}`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="top-nav-right">
        <span className="top-nav-badge">
          <span className="live-dot" aria-hidden="true" />
          Beta
        </span>
      </div>
    </nav>
  )
}
