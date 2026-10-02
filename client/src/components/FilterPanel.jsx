import { useEffect, useState } from 'react';
import styles from './FilterPanel.module.css';

export default function FilterPanel({ options, optionsError, selected, onToggle, onStock, onPrice, onClear, canClear }) {
  const [min, setMin] = useState(selected.min);
  const [max, setMax] = useState(selected.max);
  const [priceError, setPriceError] = useState('');

  useEffect(() => { setMin(selected.min); setMax(selected.max); setPriceError(''); }, [selected.min, selected.max]);

  const applyPrice = (e) => {
    e.preventDefault();
    const a = min.trim();
    const b = max.trim();
    if ((a && !/^\d+$/.test(a)) || (b && !/^\d+$/.test(b))) return setPriceError('Use whole numbers only');
    if (a && b && Number(a) > Number(b)) return setPriceError('Minimum cannot be higher than maximum');
    setPriceError('');
    onPrice(a, b);
  };

  return (
    <div className={styles.panel}>
      <fieldset>
        <legend>Category</legend>
        {optionsError && <p className={styles.note}>Filters unavailable right now.</p>}
        {(options?.categories || []).map((c) => (
          <label key={c} className={styles.check}>
            <input type="checkbox" checked={selected.categories.includes(c)} onChange={() => onToggle('category', c)} />
            {c}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Product type</legend>
        {(options?.types || []).map((t) => (
          <label key={t} className={styles.check}>
            <input type="checkbox" checked={selected.types.includes(t)} onChange={() => onToggle('type', t)} />
            {t}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Price (₹)</legend>
        <form onSubmit={applyPrice} className={styles.price} noValidate>
          <input aria-label="Minimum price" inputMode="numeric" placeholder="Min" value={min} onChange={(e) => setMin(e.target.value)} aria-invalid={!!priceError} />
          <span aria-hidden="true">–</span>
          <input aria-label="Maximum price" inputMode="numeric" placeholder="Max" value={max} onChange={(e) => setMax(e.target.value)} aria-invalid={!!priceError} />
          <button type="submit" className="btn">Apply</button>
        </form>
        {priceError && <p className="fieldError" role="alert">{priceError}</p>}
      </fieldset>

      <fieldset>
        <legend>Availability</legend>
        <label className={styles.check}>
          <input type="checkbox" checked={selected.inStock} onChange={(e) => onStock(e.target.checked)} />
          In stock only
        </label>
      </fieldset>

      {canClear && <button type="button" className={styles.clear} onClick={onClear}>Clear search and filters</button>}
    </div>
  );
}
