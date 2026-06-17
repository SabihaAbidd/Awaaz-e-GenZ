import { Outlet, useLocation } from 'react-router-dom'
import TopNav from './TopNav.jsx'
import BottomNav from './BottomNav.jsx'

const STRIP_COLORS = ['#ff2d7a', '#ff6b47', '#ff9c2a', '#ffd23f', '#3df5b4', '#7dbb8a', '#c4a8ff']

function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <span className="footer-brand">Awaaz-e-GenZ © 2025</span>
      <div className="footer-dots" aria-hidden="true">
        {['#ff2d7a', '#ff9c2a', '#3df5b4', '#c4a8ff'].map((c, i) => (
          <div key={i} className="footer-dot" style={{ background: c }} />
        ))}
      </div>
    </footer>
  )
}

function ColorStrip() {
  return (
    <div className="color-strip" aria-hidden="true">
      {STRIP_COLORS.map((color, i) => (
        <span key={i} style={{ background: color }} />
      ))}
    </div>
  )
}

export default function Layout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="app-shell">
      <TopNav />

      <main className="main-content" id="main-content">
        <Outlet />
      </main>

      {isHome && <ColorStrip />}
      <Footer />
      <BottomNav />
    </div>
  )
}
