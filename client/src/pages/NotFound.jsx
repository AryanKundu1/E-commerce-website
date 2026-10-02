import { Link } from 'react-router-dom';
import styles from './Static.module.css';

export default function NotFound() {
  return (
    <div className={`container ${styles.center}`}>
      <h1>Page not found</h1>
      <p>The page you’re looking for doesn’t exist or has moved.</p>
      <Link to="/shop" className="btn btnPrimary">Go to the shop</Link>
    </div>
  );
}
