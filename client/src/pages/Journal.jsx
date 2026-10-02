import { useState } from 'react';
import SmartImage from '../components/SmartImage';
import { articles } from '../utils/journal';
import styles from './Static.module.css';

export default function Journal() {
  const [openId, setOpenId] = useState(null);
  return (
    <div className={`container ${styles.page}`} style={{ maxWidth: 1000 }}>
      <h1>Journal</h1>
      <div className={styles.articles}>
        {articles.map((a) => (
          <article key={a.id} className={styles.article}>
            <SmartImage src={a.image} alt="" />
            <div>
              <span className={styles.tag}>{a.tag}</span>
              <h2>{a.title}</h2>
              <p>{openId === a.id ? a.body : a.excerpt}</p>
              <button type="button" className={styles.toggle} aria-expanded={openId === a.id} onClick={() => setOpenId(openId === a.id ? null : a.id)}>
                {openId === a.id ? 'Show less' : 'Read more'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
