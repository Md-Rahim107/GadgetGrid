import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { openModal } from '../store/slices/orderSlice';

const badgeText = (b) => (b === 'hot' ? '🔥 Hot' : b === 'new' ? '✦ New' : '% Sale');

export default function ProductCard({ product, index = 0, showSpecs = false, showWishlist = false }) {
  const dispatch = useDispatch();
  const [wished, setWished] = useState(false);

  return (
    <article className="product-card" style={{ animationDelay: `${index * 0.05}s` }}>
      {product.badge && (
        <div className={`product-badge badge-${product.badge}`}>{badgeText(product.badge)}</div>
      )}
      <div className="product-img">
        <span aria-hidden="true">{product.emoji}</span>
        {showWishlist && (
          <button
            className={`wishlist-btn ${wished ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); setWished((w) => !w); }}
            aria-label="Toggle wishlist"
          >
            {wished ? '❤️' : '🤍'}
          </button>
        )}
      </div>
      <div className="product-info">
        <div className="product-brand">{product.brand}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-stars">{product.rating} <span>({product.reviews})</span></div>
        {showSpecs && product.specs && (
          <div className="product-specs">
            {product.specs.map((s) => <span className="spec-tag" key={s}>{s}</span>)}
          </div>
        )}
        <div className="product-price-row">
          <div>
            <span className="product-price">{product.price}</span>
            {product.old && <span className="product-old-price">{product.old}</span>}
          </div>
          <button
            className="buy-now-btn"
            onClick={(e) => { e.stopPropagation(); dispatch(openModal(product)); }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </article>
  );
}
