import { useEffect, useState } from 'react';
import styles from './Skeleton.module.css';

export function SkeletonBlock({ height = 16, width = '100%', style }) {
  return <div className={styles.block} style={{ height, width, ...style }} aria-hidden="true" />;
}

export function ProductCardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={`${styles.block} ${styles.image}`} />
      <SkeletonBlock height={12} width="40%" />
      <SkeletonBlock height={20} width="80%" />
      <SkeletonBlock height={12} />
      <SkeletonBlock height={12} width="60%" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }) {
  const [slow, setSlow] = useState(false);

  
  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {slow && (
        <p role="status" style={{ color: 'var(--gray)', fontSize: 14, marginBottom: 20 }}>
          Waking up the server. This can take up to a minute on the free hosting plan.
        </p>
      )}
      <div className={styles.grid} role="status" aria-label="Loading products">
        {Array.from({ length: count }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}
