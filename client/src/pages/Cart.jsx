import { Link, useNavigate } from 'react-router-dom';
import QuantitySelector from '../components/QuantitySelector';
import SmartImage from '../components/SmartImage';
import { EmptyState } from '../components/StateMessage';
import { useCart } from '../context/CartContext';
import { FREE_SHIPPING_ABOVE, formatPrice } from '../utils/pricing';
import styles from './Cart.module.css';

export default function Cart() {
  const { items, subtotal, shipping, total, setQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <EmptyState title="Your bag is empty" text="Products you add will appear here.">
        <Link to="/shop" className="btn btnPrimary">Continue shopping</Link>
      </EmptyState>
    );
  }

  const remaining = FREE_SHIPPING_ABOVE - subtotal;

  return (
    <div className={`container ${styles.page}`}>
      <h1>Your bag</h1>
      <div className={styles.layout}>
        <ul className={styles.list}>
          {items.map((i) => (
            <li key={i.productId} className={styles.item}>
              <Link to={`/product/${i.slug}`} className={styles.thumb}><SmartImage src={i.image} alt={i.name} /></Link>
              <div className={styles.details}>
                <Link to={`/product/${i.slug}`} className={styles.name}>{i.name}</Link>
                <span className={styles.unit}>{formatPrice(i.price)}</span>
                <div className={styles.controls}>
                  <QuantitySelector value={i.quantity} max={i.stock} label={`Quantity for ${i.name}`} onChange={(n) => setQuantity(i.productId, n)} />
                  <button type="button" className={styles.remove} onClick={() => removeItem(i.productId)}>Remove</button>
                </div>
                {i.quantity >= i.stock && <span className={styles.limit}>Maximum available quantity</span>}
              </div>
              <span className={styles.line}>{formatPrice(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>

        <aside className={styles.summary} aria-label="Order summary">
          <h2>Summary</h2>
          <dl>
            <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div><dt>Shipping</dt><dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd></div>
            <div className={styles.total}><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
          </dl>
          {remaining > 0 && <p className={styles.hint}>Add {formatPrice(remaining)} more for free shipping.</p>}
          <button type="button" className="btn btnPrimary btnBlock" onClick={() => navigate('/checkout')}>Proceed to checkout</button>
          <button type="button" className={styles.clear} onClick={() => { clearCart(); }}>Clear bag</button>
        </aside>
      </div>
    </div>
  );
}
