import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { EmptyState } from '../components/StateMessage';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orderService';
import { formatPrice } from '../utils/pricing';
import { validateCard, validateShipping } from '../utils/validators';
import styles from './Checkout.module.css';

const DRAFT_KEY = 'elan_checkout_draft';
const empty = { fullName: '', email: '', phone: '', address: '', city: '', state: '', postalCode: '' };

// Form draft lives in sessionStorage: it survives a refresh but disappears when the tab closes.
const loadDraft = () => {
  try { return { ...empty, ...JSON.parse(sessionStorage.getItem(DRAFT_KEY)) }; } catch { return empty; }
};

export default function Checkout() {
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(loadDraft);
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' });
  const [payment, setPayment] = useState('COD');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(form)); } catch { /* ignore */ }
  }, [form]);

  if (items.length === 0 && !submitting) {
    return (
      <EmptyState title="Your bag is empty" text="Add something to your bag before checking out.">
        <Link to="/shop" className="btn btnPrimary">Continue shopping</Link>
      </EmptyState>
    );
  }

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const onBlur = (e) => {
    const all = validateShipping(form);
    setErrors((prev) => ({ ...prev, [e.target.name]: all[e.target.name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const found = { ...validateShipping(form), ...(payment === 'DEMO_CARD' ? validateCard(card) : {}) };
    setErrors(found);
    if (Object.keys(found).length) {
      toast.error('Please fix the highlighted fields');
      document.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    setSubmitting(true);
    try {
      if (payment === 'DEMO_CARD') await new Promise((r) => setTimeout(r, 900)); // simulated payment
      // Only product ids and quantities are sent; the server recalculates prices and totals.
      const order = await createOrder({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: form,
        paymentMethod: payment,
      });
      clearCart();
      try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      toast.success('Order placed. Thank you.');
      navigate(`/orders/${order._id}`, { state: { justPlaced: true } });
    } catch (err) {
      setServerError(err.message);
      toast.error(err.message);
      setSubmitting(false);
    }
  };

  const field = (name, label, props = {}) => (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name} name={name} className="input" value={form[name]} onChange={onChange} onBlur={onBlur}
        aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-err` : undefined} {...props}
      />
      {errors[name] && <p id={`${name}-err`} className="fieldError">{errors[name]}</p>}
    </div>
  );

  const cardField = (key, name, label, props = {}) => (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name} className="input" value={card[key]} onChange={(e) => setCard((c) => ({ ...c, [key]: e.target.value }))}
        aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-err` : undefined} {...props}
      />
      {errors[name] && <p id={`${name}-err`} className="fieldError">{errors[name]}</p>}
    </div>
  );

  return (
    <div className={`container ${styles.page}`}>
      <h1>Checkout</h1>
      <form className={styles.layout} onSubmit={handleSubmit} noValidate>
        <div className={styles.fields}>
          <h2>Delivery</h2>
          <div className={styles.grid}>
            <div className={styles.full}>{field('fullName', 'Full name', { autoComplete: 'name', maxLength: 60 })}</div>
            {field('email', 'Email', { type: 'email', autoComplete: 'email' })}
            {field('phone', 'Phone', { type: 'tel', inputMode: 'numeric', autoComplete: 'tel', maxLength: 10, placeholder: '10-digit mobile number' })}
            <div className={styles.full}>{field('address', 'Address', { autoComplete: 'street-address', maxLength: 150 })}</div>
            {field('city', 'City', { autoComplete: 'address-level2' })}
            {field('state', 'State', { autoComplete: 'address-level1' })}
            {field('postalCode', 'Postal code', { inputMode: 'numeric', maxLength: 6, autoComplete: 'postal-code' })}
          </div>

          <h2 className={styles.payTitle}>Payment</h2>
          <fieldset className={styles.pay}>
            <legend className="sr-only">Payment method</legend>
            <label><input type="radio" name="payment" checked={payment === 'COD'} onChange={() => setPayment('COD')} /> Cash on delivery</label>
            <label><input type="radio" name="payment" checked={payment === 'DEMO_CARD'} onChange={() => setPayment('DEMO_CARD')} /> Demo card payment</label>
          </fieldset>
          {payment === 'DEMO_CARD' && (
            <div className={styles.cardBox}>
              <p className={styles.demo}>This is a simulated payment. Do not enter a real card. Card details are never stored or sent.</p>
              <div className={styles.grid}>
                <div className={styles.full}>{cardField('number', 'cardNumber', 'Card number', { inputMode: 'numeric', placeholder: '4242 4242 4242 4242', maxLength: 19, autoComplete: 'off' })}</div>
                {cardField('expiry', 'cardExpiry', 'Expiry (MM/YY)', { placeholder: '08/29', maxLength: 5, autoComplete: 'off' })}
                {cardField('cvv', 'cardCvv', 'CVV', { inputMode: 'numeric', maxLength: 3, autoComplete: 'off', type: 'password' })}
              </div>
            </div>
          )}
        </div>

        <aside className={styles.summary} aria-label="Order summary">
          <h2>Your order</h2>
          <ul>
            {items.map((i) => (
              <li key={i.productId}><span>{i.name} × {i.quantity}</span><span>{formatPrice(i.price * i.quantity)}</span></li>
            ))}
          </ul>
          <dl>
            <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div><dt>Shipping</dt><dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd></div>
            <div className={styles.total}><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
          </dl>
          {serverError && <p className="fieldError" role="alert">{serverError}</p>}
          <button type="submit" className="btn btnPrimary btnBlock" disabled={submitting}>
            {submitting ? <><span className="spinner" aria-hidden="true" /> Placing order…</> : 'Place order'}
          </button>
          <Link to="/cart" className={styles.back}>Back to bag</Link>
        </aside>
      </form>
    </div>
  );
}
