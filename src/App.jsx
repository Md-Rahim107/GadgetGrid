import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { initAuth } from './store/slices/authSlice';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import Toast from './components/Toast';

import Home from './pages/Home';
import Auth from './pages/Auth';
import Phones from './pages/Phones';
import Laptops from './pages/Laptops';
import Wearables from './pages/Wearables';
import NotFound from './pages/NotFound';

export default function App() {
  const dispatch = useDispatch();
  const { initialized } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);

  if (!initialized) return <LoadingScreen text="Checking authentication..." />;

  return (
    <>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/phones" element={<Phones />} />
          <Route path="/laptops" element={<Laptops />} />
          <Route path="/wearables" element={<Wearables />} />
        </Route>
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      <Toast />
    </>
  );
}
