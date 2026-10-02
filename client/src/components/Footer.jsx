import { Link } from 'react-router-dom';
import Newsletter from './Newsletter';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <span className={styles.logo}>ÉLAN</span>
          <p>Rituals, thoughtfully considered.</p>
          <Newsletter tone="dark" />
        </div>
        <nav aria-label="Shop">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/shop?category=Skin">Skin</Link></li>
            <li><Link to="/shop?category=Body">Body</Link></li>
            <li><Link to="/shop?category=Hair">Hair</Link></li>
            <li><Link to="/shop?category=Fragrance">Fragrance</Link></li>
            <li><Link to="/shop?category=Home">Home</Link></li>
          </ul>
        </nav>
        <nav aria-label="Company">
          <h4>ÉLAN</h4>
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/journal">Journal</Link></li>
            <li><Link to="/cart">Your bag</Link></li>
          </ul>
        </nav>
        <div>
          <h4>Help</h4>
          <ul>
            <li>Shipping: free above ₹2,000</li>
            <li>Returns within 14 days</li>
            <li>hello@elan.example</li>
          </ul>
        </div>
      </div>
      <div className={`container ${styles.legal}`}>
        <span>© {new Date().getFullYear()} ÉLAN. A college project with fictional products.</span>
      </div>
    </footer>
  );
}
