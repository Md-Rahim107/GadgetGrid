import Carousel from '../components/Carousel';
import ProductCard from '../components/ProductCard';
import { FEATURED_PRODUCTS } from '../data/products';

export default function Home() {
  return (
    <>
      <Carousel />
      <section id="products">
        <div className="section-label">
          <h2>Featured <span>Products</span></h2>
          <a href="#products" className="see-all">View all products →</a>
        </div>
        <div className="product-grid">
          {FEATURED_PRODUCTS.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
