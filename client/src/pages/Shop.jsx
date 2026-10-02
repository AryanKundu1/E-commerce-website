import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterPanel from '../components/FilterPanel';
import Pagination from '../components/Pagination';
import { ProductGridSkeleton } from '../components/Skeleton';
import { EmptyState, ErrorState } from '../components/StateMessage';
import useAsync from '../hooks/useAsync';
import useDebounce from '../hooks/useDebounce';
import { getFilterOptions, getProducts } from '../services/productService';
import styles from './Shop.module.css';

const SORTS = [
  ['featured', 'Featured'],
  ['price-low', 'Price: low to high'],
  ['price-high', 'Price: high to low'],
  ['name-asc', 'Name: A–Z'],
  ['name-desc', 'Name: Z–A'],
  ['rating', 'Rating'],
];

const list = (v) => (v ? v.split(',').filter(Boolean) : []);

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const searchRef = useRef(null);
  const [drawer, setDrawer] = useState(false);

  const urlSearch = params.get('search') || '';
  const selected = {
    categories: list(params.get('category')),
    types: list(params.get('type')),
    min: params.get('minPrice') || '',
    max: params.get('maxPrice') || '',
    inStock: params.get('inStock') === 'true',
  };
  const sort = params.get('sort') || 'featured';
  const page = Math.max(parseInt(params.get('page')) || 1, 1);

  const update = (changes, keepPage = false) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([k, v]) => {
      if (v === '' || v === null || v === false || (Array.isArray(v) && !v.length)) next.delete(k);
      else next.set(k, Array.isArray(v) ? v.join(',') : String(v));
    });
    if (!keepPage) next.delete('page');
    setParams(next, { replace: true });
  };

  const [searchText, setSearchText] = useState(urlSearch);
  const debounced = useDebounce(searchText, 350);
  const pushed = useRef(urlSearch);

  useEffect(() => {
    if (debounced.trim() !== urlSearch) {
      pushed.current = debounced.trim();
      update({ search: debounced.trim() });
    }
  }, [debounced]);

  useEffect(() => {
    if (urlSearch !== pushed.current) {
      pushed.current = urlSearch;
      setSearchText(urlSearch);
    }
  }, [urlSearch]);

  useEffect(() => {
    if (location.state?.focusSearch) searchRef.current?.focus();
  }, [location.state]);

  const apiParams = useMemo(
    () => ({
      search: urlSearch || undefined,
      category: selected.categories.join(',') || undefined,
      type: selected.types.join(',') || undefined,
      minPrice: selected.min || undefined,
      maxPrice: selected.max || undefined,
      inStock: selected.inStock || undefined,
      featured: params.get('featured') === 'true' || undefined,
      sort,
      page,
      limit: 9,
    }),
    [params]
  );

  const { data, loading, error, reload } = useAsync((signal) => getProducts(apiParams, signal), [params.toString()]);
  const options = useAsync((signal) => getFilterOptions(signal), []);

  const toggle = (key, value) => {
    const current = key === 'category' ? selected.categories : selected.types;
    update({ [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value] });
  };

  const clearAll = () => {
    pushed.current = '';
    setSearchText('');
    setParams({}, { replace: true });
  };

  const activeCount =
    selected.categories.length + selected.types.length + (selected.min || selected.max ? 1 : 0) + (selected.inStock ? 1 : 0);
  const hasQuery = !!urlSearch || activeCount > 0 || params.get('featured') === 'true';

  return (
    <div className={`container ${styles.shop}`}>
      <header className={styles.header}>
        <h1>Shop</h1>
        <div className={styles.searchWrap}>
          <label htmlFor="shop-search" className="sr-only">Search products</label>
          <input
            id="shop-search"
            ref={searchRef}
            type="search"
            className={styles.search}
            placeholder="Search by name, type or category"
            value={searchText}
            maxLength={60}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </header>

      <div className={styles.toolbar}>
        <button type="button" className={`btn ${styles.filterBtn}`} onClick={() => setDrawer(true)} aria-expanded={drawer}>
          Filters{activeCount > 0 ? ` (${activeCount})` : ''}
        </button>
        <p className={styles.count} role="status" aria-live="polite">
          {data && !loading ? `${data.totalProducts} ${data.totalProducts === 1 ? 'product' : 'products'}` : '\u00a0'}
        </p>
        <div className={styles.sort}>
          <label htmlFor="sort">Sort by</label>
          <select id="sort" value={sort} onChange={(e) => update({ sort: e.target.value === 'featured' ? '' : e.target.value })}>
            {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.layout}>
        {drawer && <div className={styles.overlay} onClick={() => setDrawer(false)} aria-hidden="true" />}
        <aside className={`${styles.sidebar} ${drawer ? styles.sidebarOpen : ''}`} aria-label="Filters">
          <div className={styles.drawerHead}>
            <h2>Filters</h2>
            <button type="button" onClick={() => setDrawer(false)} aria-label="Close filters">Close</button>
          </div>
          <FilterPanel
            options={options.data}
            optionsError={options.error}
            selected={selected}
            onToggle={toggle}
            onStock={(v) => update({ inStock: v })}
            onPrice={(min, max) => update({ minPrice: min, maxPrice: max })}
            onClear={clearAll}
            canClear={hasQuery}
          />
          <button type="button" className={`btn btnPrimary btnBlock ${styles.apply}`} onClick={() => setDrawer(false)}>
            Show results
          </button>
        </aside>

        <section aria-label="Products">
          {loading && !data && <ProductGridSkeleton count={6} />}
          {error && <ErrorState message={error} onRetry={reload} />}
          {data && !error && (
            <div className={loading ? styles.dim : ''}>
              {data.products.length === 0 ? (
                <EmptyState
                  title="No products found"
                  text={urlSearch ? `Nothing matches “${urlSearch}”. Try a different word or remove some filters.` : 'Nothing matches these filters. Try removing some.'}
                >
                  <button type="button" className="btn" onClick={clearAll}>Clear search and filters</button>
                </EmptyState>
              ) : (
                <>
                  <div className={styles.grid}>
                    {data.products.map((p) => <ProductCard key={p._id} product={p} />)}
                  </div>
                  <Pagination
                    currentPage={data.currentPage}
                    totalPages={data.totalPages}
                    onChange={(p) => { update({ page: p }, true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  />
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
