import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, textAlign: 'center' }}>
      <div style={{ fontSize: '5rem' }}>🛸</div>
      <h1 style={{ fontFamily: 'Syne, sans-serif' }}>404 – Page not found</h1>
      <p style={{ color: 'var(--muted)' }}>The page you're looking for drifted into deep space.</p>
      <Link to="/" className="slide-cta" style={{ background: 'var(--accent)', color: '#000', padding: '12px 28px', borderRadius: 999 }}>
        ← Back to home
      </Link>
    </div>
  );
}
