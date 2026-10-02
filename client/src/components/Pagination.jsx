import styles from './Pagination.module.css';

export default function Pagination({ currentPage, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <nav className={styles.nav} aria-label="Pagination">
      <button type="button" onClick={() => onChange(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </button>
      <ul>
        {pages.map((p) => (
          <li key={p}>
            <button
              type="button"
              onClick={() => onChange(p)}
              aria-current={p === currentPage ? 'page' : undefined}
              aria-label={`Page ${p}`}
              className={p === currentPage ? styles.active : ''}
            >
              {p}
            </button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => onChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </button>
    </nav>
  );
}
