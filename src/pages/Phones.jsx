import CategoryPage from '../components/CategoryPage';
import { PHONE_PRODUCTS, PHONE_FILTERS } from '../data/products';

export default function Phones() {
  return (
    <CategoryPage
      label="📱 Smartphones"
      title="The Latest<br/>in Your Hand"
      subtitle="Flagship phones from top brands. Cutting-edge cameras, processors, and displays — all in one place."
      emoji="📱"
      products={PHONE_PRODUCTS}
      filters={PHONE_FILTERS}
    />
  );
}
