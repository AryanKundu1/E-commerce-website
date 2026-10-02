import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import QuantitySelector from '../components/QuantitySelector';
import SmartImage from '../components/SmartImage';
import { SkeletonBlock } from '../components/Skeleton';
import { EmptyState, ErrorState } from '../components/StateMessage';
import { useCart } from '../context/CartContext';
import useAsync from '../hooks/useAsync';
import { getProduct } from '../services/productService';
import { formatPrice } from '../utils/pricing';
import styles from './ProductDetails.module.css';

export default function ProductDetails() {
  const { slug } = useParams();
  const { addItem, items } = useCart();
  const [qty, setQty] = useState(1);
  const { data, loading, error, status, reload } = useAsync((signal) => getProduct(slug, signal), [slug]);

  useEffect(() => setQty(1), [slug]);

  if (loading && !data) {
    return (
      <div className={`container ${styles.wrap}`} role="status" aria-label="Loading product">
        <SkeletonBlock height={560} />
        <div className={styles.info}>
          <SkeletonBlock height={14} width="30%" />
          <SkeletonBlock height={44} width="80%" />
          <SkeletonBlock height={90} />
          <SkeletonBlock height={48} width="50%" />
        </div>
      </div>
    );
  }
  if (error && status === 404) {
    return (
      <EmptyState title="Product not found" text="This product may have been removed or the link is incorrect.">
        <Link to="/shop" className="btn">Back to shop</Link>
      </EmptyState>
    );
  }
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data) return null;

  const { product, related } = data;
  const inBag = items.find((i) => i.productId === product._id)?.quantity || 0;
  const available = Math.max(product.stock - inBag, 0);
  const stockText =
    product.stock < 1 ? 'Out of stock' : product.stock <= 5 ? `Only ${product.stock} left` : 'In stock';

  return (
    <div className="container">
      <nav aria-label="Breadcrumb" className={styles.crumbs}>
        <Link to="/shop">Shop</Link> / <Link to={`/shop?category=${product.category}`}>{product.category}</Link> / {product.name}
      </nav>

      <div className={styles.wrap}>
        <div className={styles.imageBox}>
          <SmartImage src={product.image} alt={`${product.name}, ${product.productType.toLowerCase()}, ${product.size}`} eager />
        </div>

        <div className={styles.info}>
          <span className={styles.cat}>{product.category} · {product.productType}</span>
          <h1>{product.name}</h1>
          <p className={styles.rating} aria-label={`Rated ${product.rating} out of 5`}>★ {product.rating.toFixed(1)}</p>
          <p className={styles.price}>{formatPrice(product.price)} <span>{product.size}</span></p>
          <p className={styles.desc}>{product.description}</p>

          <p className={`${styles.stock} ${product.stock < 1 ? styles.out : ''}`}>{stockText}</p>

          <div className={styles.buy}>
            <QuantitySelector value={qty} max={Math.max(available, 1)} onChange={(n) => setQty(Math.max(1, Math.min(n, Math.max(available, 1))))} />
            <button
              type="button"
              className="btn btnPrimary"
              disabled={available < 1}
              onClick={() => { if (addItem(product, qty)) setQty(1); }}
            >
              {product.stock < 1 ? 'Out of stock' : available < 1 ? 'Maximum in your bag' : 'Add to bag'}
            </button>
          </div>
          {inBag > 0 && <p className={styles.inBag}>{inBag} in your bag. <Link to="/cart">View bag</Link></p>}

          <details className={styles.details} open>
            <summary>Ingredients</summary>
            <p>{product.ingredients.join(', ')}.</p>
          </details>
          <details className={styles.details}>
            <summary>Shipping and returns</summary>
            <p>Free shipping on orders above ₹2,000, otherwise ₹99. Unopened products can be returned within 14 days.</p>
          </details>
        </div>
      </div>

      {related.length > 0 && (
        <section className={styles.related} aria-labelledby="related">
          <h2 id="related">You may also like</h2>
          <div className={styles.relGrid}>{related.map((p) => <ProductCard key={p._id} product={p} />)}</div>
        </section>
      )}
    </div>
  );
}
