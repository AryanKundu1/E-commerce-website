import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Skeleton';
import { ErrorState } from '../components/StateMessage';
import SmartImage from '../components/SmartImage';
import Newsletter from '../components/Newsletter';
import useAsync from '../hooks/useAsync';
import { getProducts } from '../services/productService';
import { articles } from '../utils/journal';
import styles from './Home.module.css';

const categories = [
  { name: 'Skin', note: 'Cleansers, serums, moisturisers' },
  { name: 'Body', note: 'Washes, oils, hand balms' },
  { name: 'Hair', note: 'Shampoo, conditioner, scalp care' },
  { name: 'Fragrance', note: 'Eau de parfum and roll-ons' },
  { name: 'Home', note: 'Candles and room sprays' },
];

export default function Home() {
  const { data, loading, error, reload } = useAsync(
    (signal) => getProducts({ featured: true, limit: 4 }, signal),
    []
  );

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1>Rituals, thoughtfully considered.</h1>
          <p>Explore formulations created for everyday moments of care.</p>
          <Link to="/shop" className="btn btnPrimary">Explore the collection</Link>
        </div>
        <div className={styles.heroImage}>
          <SmartImage src="https://picsum.photos/seed/elan-hero/1000/1200" alt="A quiet arrangement of ÉLAN bottles on a stone shelf" eager />
        </div>
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="featured">
        <div className={styles.head}>
          <h2 id="featured">Featured</h2>
          <Link to="/shop?featured=true">View all products</Link>
        </div>
        {loading && <ProductGridSkeleton count={4} />}
        {error && <ErrorState message={error} onRetry={reload} />}
        {data && <div className={styles.grid4}>{data.products.map((p) => <ProductCard key={p._id} product={p} />)}</div>}
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="cats">
        <h2 id="cats">Shop by category</h2>
        <ul className={styles.cats}>
          {categories.map((c) => (
            <li key={c.name}>
              <Link to={`/shop?category=${c.name}`}>
                <span className={styles.catName}>{c.name}</span>
                <span className={styles.catNote}>{c.note}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.philosophy}>
        <div className={`container ${styles.philInner}`}>
          <h2>Fewer products, used with more attention.</h2>
          <div>
            <p>ÉLAN makes a small range of formulations for daily use. We choose gentle ingredients, plain packaging and scents that stay in the background.</p>
            <p>Our products are designed to be part of a routine you actually keep, not one more thing to manage.</p>
            <Link to="/about">Read our story</Link>
          </div>
        </div>
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="journal">
        <div className={styles.head}>
          <h2 id="journal">From the Journal</h2>
          <Link to="/journal">All articles</Link>
        </div>
        <div className={styles.journal}>
          {articles.map((a) => (
            <Link to="/journal" key={a.id} className={styles.article}>
              <SmartImage src={a.image} alt="" />
              <span>{a.tag}</span>
              <h3>{a.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className={`container ${styles.news}`}>
        <h2>Letters, occasionally.</h2>
        <p>New formulations and journal entries, a few times a year.</p>
        <Newsletter />
      </section>
    </>
  );
}
