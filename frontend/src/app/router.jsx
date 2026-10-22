import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/pages/LoginPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import BooksPage from '../features/books/pages/BooksPage';
import BookDetailPage from '../features/books/pages/BookDetailPage';
import AuthorsPage from '../features/authors/pages/AuthorsPage';
import GenresPage from '../features/genres/pages/GenresPage';
import SagasPage from '../features/sagas/pages/SagasPage';
import ShelvesPage from '../features/shelves/pages/ShelvesPage';
import LogsPage from '../features/logs/pages/LogsPage';
import Layout from '../shared/components/layout/Layout';
import ProtectedRoute from '../shared/components/layout/ProtectedRoute';
import { ROUTES } from '../shared/constants/routes';

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
      {
        path: ROUTES.DASHBOARD,
        element: <DashboardPage />,
      },
      {
        path: ROUTES.BOOKS,
        element: <BooksPage />,
      },
      {
        path: `${ROUTES.BOOKS}/:id`,
        element: <BookDetailPage />,
      },
      {
        path: ROUTES.AUTHORS,
        element: <AuthorsPage />,
      },
      {
        path: ROUTES.GENRES,
        element: <GenresPage />,
      },
      {
        path: ROUTES.SAGAS,
        element: <SagasPage />,
      },
      {
        path: ROUTES.SHELVES,
        element: <ShelvesPage />,
      },
      {
        path: ROUTES.LOGS,
        element: <LogsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
]);