import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const linkClass = ({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <button
          type="button"
          className={styles.burger}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className={open ? styles.barOpen : ''} />
        </button>

        <Link to="/" className={styles.logo} aria-label="ÉLAN home">ÉLAN</Link>

        <nav className={styles.desktopNav} aria-label="Main">
          <NavLink to="/shop" className={linkClass}>Shop</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/journal" className={linkClass}>Journal</NavLink>
        </nav>

        <div className={styles.actions}>
          <button type="button" className={styles.link} onClick={() => navigate('/shop', { state: { focusSearch: true } })}>
            Search
          </button>
          <NavLink to="/cart" className={linkClass} aria-label={`Bag, ${count} items`}>
            Bag{count > 0 && <span className={styles.count}>{count}</span>}
          </NavLink>
        </div>
      </div>

      <nav id="mobile-menu" className={`${styles.mobile} ${open ? styles.mobileOpen : ''}`} aria-label="Mobile" hidden={!open && undefined}>
        <NavLink to="/shop" tabIndex={open ? 0 : -1}>Shop</NavLink>
        <NavLink to="/about" tabIndex={open ? 0 : -1}>About</NavLink>
        <NavLink to="/journal" tabIndex={open ? 0 : -1}>Journal</NavLink>
        <NavLink to="/cart" tabIndex={open ? 0 : -1}>Bag {count > 0 && `(${count})`}</NavLink>
      </nav>
    </header>
  );
}
