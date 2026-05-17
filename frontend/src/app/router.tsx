import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';

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
    path: '*',
    element: <NotFound />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
