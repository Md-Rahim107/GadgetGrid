import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../store/slices/authSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [openMenu, setOpenMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const ddRef = useRef(null);

  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
  const displayName = name.length > 14 ? name.substring(0, 14) + '…' : name;

  useEffect(() => {
    const onClick = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) setOpenDropdown(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const handleSignOut = async () => {
    await dispatch(signOut());
    navigate('/auth', { replace: true });
  };

  const links = [
    { to: '/', label: 'Home', end: true },
    { to: '/phones', label: 'Phones' },
    { to: '/laptops', label: 'Laptops' },
    { to: '/wearables', label: 'Wearables' },
  ];

  return (
    <nav className="nav">
      <div className="logo">Gadget<span>Grid</span></div>

      <ul className={openMenu ? 'open' : ''}>
        {links.map((l) => (
          <li key={l.to}>
            <NavLink
              to={l.to}
              end={l.end}
              onClick={() => setOpenMenu(false)}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {l.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="nav-right">
        <button
          className="menu-toggle"
          onClick={() => setOpenMenu((o) => !o)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>

        <div className="user-menu" ref={ddRef}>
          <button
            className="user-btn"
            onClick={(e) => { e.stopPropagation(); setOpenDropdown((o) => !o); }}
          >
            <div className="user-avatar">{initials}</div>
            <span className="username">{displayName}</span>
          </button>
          <div className={`user-dropdown ${openDropdown ? 'show' : ''}`}>
            <button className="dropdown-item danger" onClick={handleSignOut}>
              🚪 Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
