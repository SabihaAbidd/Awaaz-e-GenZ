import { useNavigate } from 'react-router-dom'

export default function BackHeader({ eyebrow, title, accent, subtitle }) {
  const navigate = useNavigate()

  return (
    <header className="page-header back-header">
      <button
        className="back-header-btn"
        type="button"
        aria-label="Go back"
        onClick={() => navigate('/more')}
      >
        <span aria-hidden="true">←</span>
        <span>Back</span>
      </button>

      <p className="page-eyebrow">{eyebrow}</p>
      <h1 className="page-title">
        {title} <span className="page-title-accent">{accent}</span>
      </h1>
      {subtitle && <p className="page-sub">{subtitle}</p>}
    </header>
  )
}
