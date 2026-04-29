import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal, submitOrder } from '../store/slices/orderSlice';
import { showToast } from '../store/slices/uiSlice';
import { parsePrice, formatPrice } from '../utils/price';

const initial = { name: '', email: '', phone: '', address: '', qty: 1 };

export default function BuyModal() {
  const dispatch = useDispatch();
  const { isOpen, selectedProduct, submitting } = useSelector((s) => s.order);
  const { user } = useSelector((s) => s.auth);
  const [form, setForm] = useState(initial);

  useEffect(() => {
    if (isOpen) {
      setForm({
        ...initial,
        email: user?.email || '',
        name: user?.user_metadata?.full_name || '',
      });
    }
  }, [isOpen, user]);

  const summary = useMemo(() => {
    if (!selectedProduct) return { unit: 0, total: 0 };
    const unit = parsePrice(selectedProduct.price);
    return { unit, total: unit * form.qty };
  }, [selectedProduct, form.qty]);

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: k === 'qty' ? parseInt(e.target.value) : e.target.value }));

  const handleConfirm = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      dispatch(showToast('⚠️ Name and email are required', true));
      return;
    }
    const result = await dispatch(submitOrder({ form, product: selectedProduct, user }));
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(showToast(`✅ Order placed for ${form.qty}× ${selectedProduct.name} — Total: ${formatPrice(summary.total)}`));
    } else {
      dispatch(showToast('⚠️ Network error — order may not have saved - Please check email'));
    }
  };

  const onOverlayClick = (e) => {
    if (e.target === e.currentTarget) dispatch(closeModal());
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onOverlayClick}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Place your order">
        <h3>🛒 Place Your Order</h3>
        {selectedProduct && (
          <p className="modal-product-name">
            {selectedProduct.brand} {selectedProduct.name} — {selectedProduct.price}
          </p>
        )}

        <label>Full Name</label>
        <input type="text" value={form.name} onChange={onChange('name')} placeholder="Your name" />

        <label>Email Address</label>
        <input type="email" value={form.email} onChange={onChange('email')} placeholder="you@example.com" />

        <label>Phone Number</label>
        <input type="tel" value={form.phone} onChange={onChange('phone')} placeholder="+880 1XXXXXXXXX" />

        <label>Shipping Address</label>
        <input type="text" value={form.address} onChange={onChange('address')} placeholder="Street, City, Zip" />

        <label>Quantity</label>
        <select value={form.qty} onChange={onChange('qty')}>
          {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>

        <div className="order-summary">
          <div className="order-summary-row">
            <span>Unit Price</span>
            <span>{selectedProduct ? formatPrice(summary.unit) : '—'}</span>
          </div>
          <div className="order-summary-row">
            <span>Quantity</span>
            <span>{form.qty}</span>
          </div>
          <div className="order-summary-row total">
            <span>Total</span>
            <span>{selectedProduct ? formatPrice(summary.total) : '—'}</span>
          </div>
        </div>

        <div className="modal-actions">
          <button className="modal-cancel" onClick={() => dispatch(closeModal())}>Cancel</button>
          <button className="modal-confirm" disabled={submitting} onClick={handleConfirm}>
            {submitting ? 'Processing…' : 'Confirm Order ✓'}
          </button>
        </div>
      </div>
    </div>
  );
}
