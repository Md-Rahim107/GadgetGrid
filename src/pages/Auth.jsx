import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signIn, signUp, signInWithGoogle, clearError } from '../store/slices/authSlice';
import { showToast } from '../store/slices/uiSlice';

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const Eye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

function Particles() {
  const particles = useMemo(() => {
    const colors = ['#00e5ff', '#ff3cac', '#f7b731', '#80ff72'];
    return Array.from({ length: 22 }).map((_, i) => {
      const size = Math.random() * 4 + 2;
      return {
        key: i,
        style: {
          width: `${size}px`, height: `${size}px`,
          left: `${Math.random() * 100}%`,
          background: colors[Math.floor(Math.random() * colors.length)],
          animationDuration: `${8 + Math.random() * 12}s`,
          animationDelay: `${Math.random() * 10}s`,
        },
      };
    });
  }, []);
  return (
    <div className="particles">
      {particles.map((p) => <div key={p.key} className="p" style={p.style} />)}
    </div>
  );
}

export default function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((s) => s.auth);
  const [tab, setTab] = useState('signin');
  const [showSiPw, setShowSiPw] = useState(false);
  const [showSuPw, setShowSuPw] = useState(false);
  const [si, setSi] = useState({ email: '', password: '' });
  const [su, setSu] = useState({ name: '', email: '', password: '', confirm: '' });

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    if (error) dispatch(showToast('❌ ' + error, true));
    return () => { if (error) dispatch(clearError()); };
  }, [error, dispatch]);

  const handleSignIn = async () => {
    if (!si.email || !si.password) return dispatch(showToast('⚠️ Please fill in all fields', true));
    await dispatch(signIn(si));
  };

  const handleSignUp = async () => {
    if (!su.name || !su.email || !su.password || !su.confirm) return dispatch(showToast('⚠️ Please fill in all fields', true));
    if (su.password.length < 6) return dispatch(showToast('⚠️ Password min 6 characters', true));
    if (su.password !== su.confirm) return dispatch(showToast('⚠️ Passwords do not match', true));
    const r = await dispatch(signUp({ email: su.email, password: su.password, fullName: su.name }));
    if (r.meta.requestStatus === 'fulfilled') dispatch(showToast('✅ Check your email to confirm your account!'));
  };

  const handleGoogle = () => dispatch(signInWithGoogle());

  return (
    <div className="auth-page">
      <div className="bg-mesh" />
      <Particles />

      <div className="auth-grid">
        {/* LEFT */}
        <aside className="panel-left">
          <div className="brand">
            <div className="brand-icon">⚡</div>
            <span className="brand-name">Gadget<span>Grid</span></span>
          </div>
          <h1 className="headline">Tech.<br /><span className="grad">Reimagined.</span><br />Delivered.</h1>
          <p className="tagline">The ultimate destination for next-gen gadgets. Sign in to unlock exclusive deals, track your orders, and discover what's new in tech.</p>
          <div className="features">
            <div className="feature"><div className="feature-icon">🔥</div><div className="feature-text"><strong>Flash Deals — 48hrs Only</strong><span>Up to 40% off flagship devices every weekend</span></div></div>
            <div className="feature"><div className="feature-icon">📦</div><div className="feature-text"><strong>Order Tracking</strong><span>Real-time updates from cart to doorstep</span></div></div>
            <div className="feature"><div className="feature-icon">🤖</div><div className="feature-text"><strong>GadgetBot AI</strong><span>24/7 smart assistant for product advice</span></div></div>
          </div>
          <div className="stats">
            <div><div className="stat-num">50K+</div><div className="stat-label">Happy Customers</div></div>
            <div><div className="stat-num">8K+</div><div className="stat-label">Products Listed</div></div>
            <div><div className="stat-num">4.9★</div><div className="stat-label">Average Rating</div></div>
          </div>
        </aside>

        {/* RIGHT */}
        <section className="panel-right">
          <div className="auth-card">
            <div className="tabs">
              <button className={`tab-btn ${tab === 'signin' ? 'active' : ''}`} onClick={() => setTab('signin')}>Sign In</button>
              <button className={`tab-btn ${tab === 'signup' ? 'active' : ''}`} onClick={() => setTab('signup')}>Sign Up</button>
            </div>

            {tab === 'signin' ? (
              <div>
                <p className="form-title">Welcome back 👋</p>
                <p className="form-sub">Sign in to continue to GadgetGrid</p>
                <div className="field">
                  <label>Email</label>
                  <input type="email" autoComplete="email" placeholder="you@example.com"
                         value={si.email} onChange={(e) => setSi({ ...si, email: e.target.value })} />
                </div>
                <div className="field">
                  <label>Password</label>
                  <div className="pw-wrap">
                    <input type={showSiPw ? 'text' : 'password'} autoComplete="current-password" placeholder="••••••••"
                           value={si.password} onChange={(e) => setSi({ ...si, password: e.target.value })} />
                    <button className="pw-eye" onClick={() => setShowSiPw((v) => !v)} tabIndex={-1} type="button"><Eye /></button>
                  </div>
                </div>
                <button className="btn-submit" disabled={loading} onClick={handleSignIn}>
                  {loading ? 'Signing in…' : 'Sign In →'}
                </button>
                <div className="divider">or continue with</div>
                <button className="btn-oauth" disabled={loading} onClick={handleGoogle}>
                  <GoogleIcon /> Continue with Google
                </button>
              </div>
            ) : (
              <div>
                <p className="form-title">Create account ✦</p>
                <p className="form-sub">Join 50,000+ gadget enthusiasts today</p>
                <div className="field">
                  <label>Full Name</label>
                  <input type="text" autoComplete="name" placeholder="Jane Doe"
                         value={su.name} onChange={(e) => setSu({ ...su, name: e.target.value })} />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input type="email" autoComplete="email" placeholder="you@example.com"
                         value={su.email} onChange={(e) => setSu({ ...su, email: e.target.value })} />
                </div>
                <div className="field">
                  <label>Password</label>
                  <div className="pw-wrap">
                    <input type={showSuPw ? 'text' : 'password'} autoComplete="new-password" placeholder="Min. 6 characters"
                           value={su.password} onChange={(e) => setSu({ ...su, password: e.target.value })} />
                    <button className="pw-eye" onClick={() => setShowSuPw((v) => !v)} tabIndex={-1} type="button"><Eye /></button>
                  </div>
                </div>
                <div className="field">
                  <label>Confirm Password</label>
                  <input type="password" autoComplete="new-password" placeholder="Repeat password"
                         value={su.confirm} onChange={(e) => setSu({ ...su, confirm: e.target.value })} />
                </div>
                <button className="btn-submit" disabled={loading} onClick={handleSignUp}>
                  {loading ? 'Creating…' : 'Create Account →'}
                </button>
                <div className="divider">or sign up with</div>
                <button className="btn-oauth" disabled={loading} onClick={handleGoogle}>
                  <GoogleIcon /> Sign Up with Google
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
