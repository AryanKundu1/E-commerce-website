import styles from './StateMessage.module.css';

export function EmptyState({ title, text, children }) {
  return (
    <div className={styles.box} role="status">
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {children}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className={`${styles.box} ${styles.error}`} role="alert">
      <h3>We couldn’t load this</h3>
      <p>{message || 'Something went wrong.'}</p>
      {onRetry && (
        <button type="button" className="btn" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
