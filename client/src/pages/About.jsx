import styles from './Static.module.css';

const values = [
  ['Thoughtful formulations', 'Each product has a clear purpose and a short, readable ingredient list.'],
  ['Everyday rituals', 'We design for the ordinary moments: washing, applying, resting.'],
  ['Simplicity', 'A small range, plain labels, no unnecessary steps.'],
  ['Quality', 'Made in small batches with attention to texture, scent and finish.'],
  ['Responsible design', 'Recyclable glass and card packaging, and refill-friendly sizes where we can.'],
];

export default function About() {
  return (
    <div className={`container ${styles.page}`}>
      <h1>About ÉLAN</h1>
      <p className={styles.lead}>We believe care is best when it is quiet, regular and considered.</p>
      <p>ÉLAN began with a simple question: what would a daily routine look like if every product earned its place? The answer is this range of cleansers, serums, balms, fragrances and candles, each made to be used and enjoyed without fuss.</p>
      <h2>What we hold to</h2>
      <div className={styles.values}>
        {values.map(([t, d]) => (<div key={t}><h3>{t}</h3><p>{d}</p></div>))}
      </div>
      <p className={styles.note}>ÉLAN is a fictional brand created for a college project. Descriptions are general and make no medical claims.</p>
    </div>
  );
}
