import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../shared/components/layout/MainLayout";
import { ProtectedRoute } from "../shared/components/ProtectedRoute";
import { ROUTES } from "../shared/constants/routes";

// Páginas (se importarán en las siguientes etapas)
import { LoginPage } from "../modules/auth/pages/LoginPage";
import { DashboardPage } from "../modules/dashboard/pages/DashboardPage";
import { BooksListPage } from "../modules/books/pages/BooksListPage";
import { BookDetailPage } from "../modules/books/pages/BookDetailPage";
import { BookFormPage } from "../modules/books/pages/BookFormPage";
import { AuthorsListPage } from "../modules/authors/pages/AuthorsListPage";
import { AuthorFormPage } from "../modules/authors/pages/AuthorFormPage";
import { GenresListPage } from "../modules/genres/pages/GenresListPage";
import { GenreFormPage } from "../modules/genres/pages/GenreFormPage";
import { SagasListPage } from "../modules/sagas/pages/SagasListPage";
import { SagaFormPage } from "../modules/sagas/pages/SagaFormPage";
import { ShelvesListPage } from "../modules/shelves/pages/ShelvesListPage";
import { ShelfFormPage } from "../modules/shelves/pages/ShelfFormPage";
import { LogsPage } from "../modules/logs/pages/LogsPage";

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "books", element: <BooksListPage /> },
      { path: "books/create", element: <BookFormPage /> },
      { path: "books/:id", element: <BookDetailPage /> },
      { path: "books/:id/edit", element: <BookFormPage /> },
      { path: "authors", element: <AuthorsListPage /> },
      { path: "authors/create", element: <AuthorFormPage /> },
      { path: "authors/:id/edit", element: <AuthorFormPage /> },
      { path: "genres", element: <GenresListPage /> },
      { path: "genres/create", element: <GenreFormPage /> },
      { path: "genres/:id/edit", element: <GenreFormPage /> },
      { path: "sagas", element: <SagasListPage /> },
      { path: "sagas/create", element: <SagaFormPage /> },
      { path: "sagas/:id/edit", element: <SagaFormPage /> },
      { path: "shelves", element: <ShelvesListPage /> },
      { path: "shelves/create", element: <ShelfFormPage /> },
      { path: "shelves/:id/edit", element: <ShelfFormPage /> },
      { path: "logs", element: <LogsPage /> },
    ],
  },
]);
