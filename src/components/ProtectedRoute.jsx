import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children }) {
  const { user } = useSelector((s) => s.auth);
  const location = useLocation();
  if (!user) return <Navigate to="/auth" state={{ from: location }} replace />;
  return children;
}
