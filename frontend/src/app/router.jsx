import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "../shared/context/AuthContext";
import LoginPage from "../modules/auth/pages/LoginPage";
import MainLayout from "../shared/components/layout/MainLayout";

// Componente para proteger rutas privadas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Componente para evitar que un admin logueado vea el login
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: (
          <div>Bienvenido al Panel de Administración de la Biblioteca</div>
        ), // Placeholder para el futuro
      },
      // Aquí irán las futuras rutas: /books, /authors, etc.
    ],
  },
]);

export default router;
