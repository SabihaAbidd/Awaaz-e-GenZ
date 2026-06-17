import { NavLink } from 'react-router-dom'

/* Pixel nav icons */
function HomeIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="3" y="10" width="16" height="10" rx="1" fill={active ? '#0d0d0d' : 'none'} stroke="#0d0d0d" strokeWidth="2"/>
      <path d="M1 11L11 3L21 11" stroke="#0d0d0d" strokeWidth="2" strokeLinecap="square"/>
      <rect x="8" y="14" width="6" height="6" fill={active ? '#f5f0e8' : '#0d0d0d'} rx="1"/>
    </svg>
  )
}

function AskIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="14" height="12" rx="2" fill={active ? '#0d0d0d' : 'none'} stroke="#0d0d0d" strokeWidth="2"/>
      <rect x="4" y="14" width="4" height="4" fill="#0d0d0d"/>
      <rect x="6" y="16" width="4" height="4" fill="#0d0d0d"/>
      <rect x="8" y="6" width="2" height="4" fill={active ? '#f5f0e8' : '#0d0d0d'}/>
      <rect x="8" y="11" width="2" height="2" fill={active ? '#f5f0e8' : '#0d0d0d'}/>
    </svg>
  )
}

function SOSIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="2" y="3" width="18" height="16" rx="2" fill={active ? '#0d0d0d' : 'none'} stroke="#0d0d0d" strokeWidth="2"/>
      <rect x="5" y="6" width="12" height="2" fill={active ? '#f5f0e8' : '#0d0d0d'}/>
      <rect x="5" y="10" width="8" height="2" fill={active ? '#f5f0e8' : '#0d0d0d'}/>
      <rect x="5" y="14" width="4" height="2" fill={active ? '#ff2d7a' : '#0d0d0d'}/>
      <rect x="11" y="13" width="6" height="3" fill={active ? '#3df5b4' : '#0d0d0d'}/>
    </svg>
  )
}

function LearnIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="18" height="18" rx="2" fill={active ? '#0d0d0d' : 'none'} stroke="#0d0d0d" strokeWidth="2"/>
      <rect x="5" y="6" width="12" height="2" fill={active ? '#f5f0e8' : '#0d0d0d'}/>
      <rect x="5" y="10" width="8" height="2" fill={active ? '#f5f0e8' : '#0d0d0d'}/>
      <rect x="5" y="14" width="10" height="2" fill={active ? '#f5f0e8' : '#0d0d0d'}/>
    </svg>
  )
}

function CardsIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="2" y="5" width="16" height="12" rx="2" fill={active ? '#0d0d0d' : 'none'} stroke="#0d0d0d" strokeWidth="2"/>
      <rect x="4" y="3" width="14" height="2" rx="1" fill="#0d0d0d"/>
      <rect x="6" y="1" width="10" height="2" rx="1" fill="#0d0d0d" opacity="0.4"/>
      <rect x="6" y="9" width="4" height="2" fill={active ? '#f5f0e8' : '#0d0d0d'}/>
      <rect x="6" y="12" width="8" height="1.5" fill={active ? '#f5f0e8' : '#0d0d0d'} opacity="0.5"/>
    </svg>
  )
}

function QuizIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="3" y="2" width="16" height="18" rx="2" fill={active ? '#0d0d0d' : 'none'} stroke="#0d0d0d" strokeWidth="2"/>
      <rect x="7" y="2" width="8" height="3" rx="1" fill="#0d0d0d"/>
      <rect x="6" y="8" width="2" height="2" fill={active ? '#f5f0e8' : '#0d0d0d'}/>
      <rect x="9" y="8" width="6" height="2" fill={active ? '#f5f0e8' : '#0d0d0d'} opacity="0.5"/>
      <rect x="6" y="12" width="2" height="2" fill={active ? '#f5f0e8' : '#0d0d0d'}/>
      <rect x="9" y="12" width="6" height="2" fill={active ? '#f5f0e8' : '#0d0d0d'} opacity="0.5"/>
    </svg>
  )
}

function CollabIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="7" r="4" fill={active ? '#0d0d0d' : 'none'} stroke="#0d0d0d" strokeWidth="2"/>
      <path d="M4 18 C4 14 7 12 11 12 C15 12 18 14 18 18" stroke="#0d0d0d" strokeWidth="2"/>
      <circle cx="5" cy="11" r="2.5" fill={active ? '#f5f0e8' : 'none'} stroke="#0d0d0d" strokeWidth="1.5"/>
      <circle cx="17" cy="11" r="2.5" fill={active ? '#f5f0e8' : 'none'} stroke="#0d0d0d" strokeWidth="1.5"/>
    </svg>
  )
}

const NAV_ITEMS = [
  { to: '/',      label: 'Home',   Icon: HomeIcon  },
  { to: '/ask',   label: 'Ask',    Icon: AskIcon   },
  { to: '/sos',   label: 'SOS',    Icon: SOSIcon   },
  { to: '/collab', label: 'Collab', Icon: CollabIcon },
  { to: '/learn', label: 'Learn',  Icon: LearnIcon },
  { to: '/cards', label: 'Cards',  Icon: CardsIcon },
  { to: '/quiz',  label: 'Quiz',   Icon: QuizIcon  },
]

const ACCENT_MAP = {
  '/':      'var(--hot-pink)',
  '/ask':   'var(--hot-pink)',
  '/sos':   'var(--yellow)',
  '/collab': 'var(--lavender)',
  '/learn': 'var(--coral)',
  '/cards': 'var(--orange)',
  '/quiz':  'var(--mint)',
  '/about': 'var(--lavender)',
}

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {NAV_ITEMS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `bottom-nav-item${isActive ? ' active' : ''}`
          }
          style={({ isActive }) =>
            isActive ? { '--page-accent': ACCENT_MAP[to] } : {}
          }
          aria-label={label}
          id={`bottom-nav-${label.toLowerCase()}`}
        >
          {({ isActive }) => (
            <>
              <span className="bottom-nav-icon">
                <Icon active={isActive} />
                {isActive && <span className="bottom-nav-dot" />}
              </span>
              <span className="bottom-nav-label">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
