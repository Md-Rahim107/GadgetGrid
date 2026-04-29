import { useMemo, useState } from 'react';
import ProductCard from './ProductCard';
import { parsePrice } from '../utils/price';

export default function CategoryPage({ label, title, subtitle, emoji, products, filters }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sort, setSort] = useState('featured');

  const visible = useMemo(() => {
    let list = activeFilter === 'all' ? products : products.filter((p) => p.cat === activeFilter);
    list = [...list];
    if (sort === 'price-low') list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    else if (sort === 'price-high') list.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    else if (sort === 'rating') list.sort((a, b) => parseInt(b.reviews.replace(/,/g, '')) - parseInt(a.reviews.replace(/,/g, '')));
    return list;
  }, [products, activeFilter, sort]);

  return (
    <>
      <section className="hero-band">
        <div className="hero-band-inner">
          <div>
            <div className="hero-label">{label}</div>
            <h1 dangerouslySetInnerHTML={{ __html: title }} />
            <p>{subtitle}</p>
          </div>
          <div className="hero-emoji" aria-hidden="true">{emoji}</div>
        </div>
      </section>

      <div className="filter-bar">
        {filters.map((f) => (
          <button
            key={f}
            className={`filter-chip ${activeFilter === f ? 'active' : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
        <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="featured">Sort: Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      <div className="product-grid">
        {visible.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} showSpecs showWishlist />
        ))}
      </div>
    </>
  );
}
