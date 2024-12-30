import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export function Navigation() {
  const { items } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isVendor = user?.role === 'vendor';
  
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">Food Ordering</Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-blue-600">Menu</Link>
            {!isVendor && (
              <Link to="/cart" className="hover:text-blue-600">
                Cart ({items.length})
              </Link>
            )}
            {isVendor && (
              <Link to="/vendor" className="hover:text-blue-600">Vendor Dashboard</Link>
            )}
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}