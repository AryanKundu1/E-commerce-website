import { useState } from 'react';
import toast from 'react-hot-toast';
import { isEmail } from '../utils/validators';
import styles from './Newsletter.module.css';

export default function Newsletter({ tone = 'light' }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return setError('Enter your email address');
    if (!isEmail(email)) return setError('Enter a valid email, like name@example.com');
    setError('');
    try {
      const list = JSON.parse(localStorage.getItem('elan_newsletter') || '[]');
      if (!list.includes(email.trim().toLowerCase())) list.push(email.trim().toLowerCase());
      localStorage.setItem('elan_newsletter', JSON.stringify(list));
    } catch { /* ignore storage problems */ }
    toast.success('Thank you for subscribing');
    setEmail('');
  };

  return (
    <form className={`${styles.form} ${tone === 'dark' ? styles.dark : ''}`} onSubmit={handleSubmit} noValidate>
      <label htmlFor={`nl-${tone}`} className="sr-only">Email address</label>
      <div className={styles.row}>
        <input
          id={`nl-${tone}`}
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `nl-err-${tone}` : undefined}
        />
        <button type="submit">Subscribe</button>
      </div>
      {error && <p id={`nl-err-${tone}`} className={styles.error} role="alert">{error}</p>}
    </form>
  );
}
