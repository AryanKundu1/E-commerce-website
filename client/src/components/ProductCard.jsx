import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/pricing';
import SmartImage from './SmartImage';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef();
  const outOfStock = product.stock < 1;

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleAdd = () => {
    if (addItem(product, 1)) {
      setJustAdded(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setJustAdded(false), 1400);
    }
  };

  return (
    <article className={styles.card}>
      <Link to={`/product/${product.slug}`} className={styles.imageWrap} aria-label={`View ${product.name}`}>
        <SmartImage src={product.image} alt={`${product.name}, ${product.productType.toLowerCase()}`} className={styles.image} />
        {outOfStock && <span className={styles.badge}>Out of stock</span>}
        {!outOfStock && product.stock <= 5 && <span className={styles.badge}>Only {product.stock} left</span>}
      </Link>
      <div className={styles.meta}>
        <span className={styles.category}>{product.category} · {product.productType}</span>
        <h3 className={styles.name}>
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className={styles.desc}>{product.description}</p>
        <div className={styles.row}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          <span className={styles.rating} aria-label={`Rated ${product.rating} out of 5`}>★ {product.rating.toFixed(1)}</span>
        </div>
        <button type="button" className="btn btnBlock" onClick={handleAdd} disabled={outOfStock}>
          {outOfStock ? 'Out of stock' : justAdded ? 'Added to bag' : 'Add to bag'}
        </button>
      </div>
    </article>
  );
}
