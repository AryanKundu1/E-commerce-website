import { Link, useLocation, useParams } from 'react-router-dom';
import { SkeletonBlock } from '../components/Skeleton';
import { EmptyState, ErrorState } from '../components/StateMessage';
import SmartImage from '../components/SmartImage';
import useAsync from '../hooks/useAsync';
import { getOrder } from '../services/orderService';
import { formatDate, formatPrice } from '../utils/pricing';
import styles from './OrderDetails.module.css';

export default function OrderDetails() {
  const { id } = useParams();
  const { state } = useLocation();
  const { data: order, loading, error, status, reload } = useAsync((signal) => getOrder(id, signal), [id]);

  if (loading) {
    return (
      <div className={`container ${styles.page}`} role="status" aria-label="Loading order">
        <SkeletonBlock height={48} width="50%" />
        <SkeletonBlock height={200} style={{ marginTop: 24 }} />
      </div>
    );
  }
  if (error && status === 404) {
    return (
      <EmptyState title="Order not found" text="Check the link and try again.">
        <Link to="/shop" className="btn">Back to shop</Link>
      </EmptyState>
    );
  }
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const a = order.shippingAddress;
  return (
    <div className={`container ${styles.page}`}>
      {state?.justPlaced && <p className={styles.thanks} role="status">Thank you, {a.fullName.split(' ')[0]}. Your order has been placed.</p>}
      <h1>Order {order._id.slice(-8).toUpperCase()}</h1>
      <p className={styles.meta}>
        Placed on {formatDate(order.createdAt)} · Status: <strong>{order.status}</strong> · Payment: {order.paymentMethod === 'COD' ? 'Cash on delivery' : 'Demo card'}
      </p>

      <div className={styles.layout}>
        <ul className={styles.items}>
          {order.items.map((i) => (
            <li key={i._id}>
              <div className={styles.thumb}><SmartImage src={i.image} alt={i.name} /></div>
              <div><Link to={`/shop?search=${encodeURIComponent(i.name)}`}>{i.name}</Link><br /><span>Quantity {i.quantity}</span></div>
              <span>{formatPrice(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className={styles.side}>
          <h2>Delivery</h2>
          <address>{a.fullName}<br />{a.address}<br />{a.city}, {a.state} {a.postalCode}<br />{a.phone}<br />{a.email}</address>
          <h2>Totals</h2>
          <dl>
            <div><dt>Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
            <div><dt>Shipping</dt><dd>{order.shippingFee === 0 ? 'Free' : formatPrice(order.shippingFee)}</dd></div>
            <div className={styles.total}><dt>Total</dt><dd>{formatPrice(order.totalAmount)}</dd></div>
          </dl>
        </div>
      </div>
      <Link to="/shop" className="btn">Continue shopping</Link>
    </div>
  );
}
