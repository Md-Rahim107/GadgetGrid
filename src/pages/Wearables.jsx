import CategoryPage from '../components/CategoryPage';
import { WEARABLE_PRODUCTS, WEARABLE_FILTERS } from '../data/products';

export default function Wearables() {
  return (
    <CategoryPage
      label="⌚ Wearables"
      title="Wear the<br/>Future"
      subtitle="Smartwatches and fitness trackers that keep you ahead — stylish, powerful and always connected."
      emoji="⌚"
      products={WEARABLE_PRODUCTS}
      filters={WEARABLE_FILTERS}
    />
  );
}
