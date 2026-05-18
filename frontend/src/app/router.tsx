import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';

// E-Commerce Pages
import ProductListPage from '@/pages/catalog/ProductListPage';
import ProductDetailPage from '@/pages/catalog/ProductDetailPage';
import CartPage from '@/pages/cart/CartPage';
import CheckoutPage from '@/pages/checkout/CheckoutPage';
import OrdersPage from '@/pages/orders/OrdersPage';
import OrderDetailPage from '@/pages/orders/OrderDetailPage';
import WishlistPage from '@/pages/wishlist/WishlistPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import AddressPage from '@/pages/profile/AddressPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/register',
    element: <SignupPage />,
  },
  {
    path: '/products',
    element: <ProductListPage />,
  },
  {
    path: '/products/:slug',
    element: <ProductDetailPage />,
  },
  {
    path: '/cart',
    element: <CartPage />,
  },
  {
    path: '/checkout',
    element: <CheckoutPage />,
  },
  {
    path: '/orders',
    element: <OrdersPage />,
  },
  {
    path: '/orders/:id',
    element: <OrderDetailPage />,
  },
  {
    path: '/wishlist',
    element: <WishlistPage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/addresses',
    element: <AddressPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
