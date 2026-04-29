import CategoryPage from '../components/CategoryPage';
import { LAPTOP_PRODUCTS, LAPTOP_FILTERS } from '../data/products';

export default function Laptops() {
  return (
    <CategoryPage
      label="💻 Laptops"
      title="Power Meets<br/>Portability"
      subtitle="From creators to coders — find the perfect machine. Latest CPUs, premium displays, and all-day battery."
      emoji="💻"
      products={LAPTOP_PRODUCTS}
      filters={LAPTOP_FILTERS}
    />
  );
}
