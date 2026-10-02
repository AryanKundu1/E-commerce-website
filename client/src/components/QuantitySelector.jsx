import styles from './QuantitySelector.module.css';

export default function QuantitySelector({ value, max, onChange, label = 'Quantity' }) {
  return (
    <div className={styles.wrap} role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        −
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}
