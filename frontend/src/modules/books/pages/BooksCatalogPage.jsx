// src/modules/books/pages/BooksCatalogPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000/api",
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const BooksCatalogPage = () => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);

  const [filters, setFilters] = useState({
    authorId: "",
    genreId: "",
    year: "",
    page: 1,
    limit: 10,
  });

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [authorsRes, genresRes] = await Promise.all([
          api.get("/authors"),
          api.get("/genres"),
        ]);
        setAuthors(authorsRes.data);
        setGenres(genresRes.data);
      } catch (error) {
        console.error("Error fetching lookups:", error);
      }
    };
    fetchLookups();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const params = new URLSearchParams();
        if (filters.authorId) params.append("authorId", filters.authorId);
        if (filters.genreId) params.append("genreId", filters.genreId);
        if (filters.year) params.append("year", filters.year);
        params.append("page", filters.page);
        params.append("limit", filters.limit);

        const response = await api.get(`/books?${params.toString()}`);
        setBooks(response.data.data);
        setTotalPages(response.data.meta.totalPages);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Catálogo de Libros</h2>
        <Link
          to="/books/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Nuevo Libro
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded border">
        <select
          name="authorId"
          value={filters.authorId}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">Todos los Autores</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <select
          name="genreId"
          value={filters.genreId}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">Todos los Géneros</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="year"
          value={filters.year}
          onChange={handleFilterChange}
          placeholder="Filtrar por Año"
          className="border p-2 rounded"
        />
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-3">Título</th>
            <th className="p-3">Autor</th>
            <th className="p-3">Género</th>
            <th className="p-3">Año</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{book.title}</td>
              <td className="p-3">{book.author?.name}</td>
              <td className="p-3">{book.genre?.name}</td>
              <td className="p-3">{book.publishYear}</td>
              <td className="p-3">
                <Link
                  to={`/books/${book.id}`}
                  className="text-blue-600 hover:underline mr-3"
                >
                  Ver Detalle
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          disabled={filters.page === 1}
          onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span>
          Página {filters.page} de {totalPages || 1}
        </span>
        <button
          disabled={filters.page === totalPages || totalPages === 0}
          onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};
