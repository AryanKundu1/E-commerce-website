import { useState } from 'react';

// Image with lazy loading and a fallback when the URL fails.
export default function SmartImage({ src, alt, className, eager = false }) {
  const [failed, setFailed] = useState(false);
  return (
    <img
      className={className}
      src={failed || !src ? '/placeholder.svg' : src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
