import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideToast } from '../store/slices/uiSlice';

export default function Toast() {
  const dispatch = useDispatch();
  const { show, message, isError } = useSelector((s) => s.ui.toast);

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => dispatch(hideToast()), 5000);
    return () => clearTimeout(t);
  }, [show, message, dispatch]);

  return (
    <div className={`toast ${show ? 'show' : ''} ${isError ? 'error' : ''}`}>
      {message}
    </div>
  );
}
