// src/modules/books/pages/BookDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000/api",
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const BookDetailPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await api.get(`/books/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookDetails();
  }, [id]);

  if (loading) return <div>Cargando detalles...</div>;
  if (!book) return <div>Libro no encontrado.</div>;

  return (
    <div className="max-w-3xl mx-auto border rounded-lg shadow-sm p-6 bg-white">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-3xl font-bold text-gray-800">{book.title}</h2>
        <Link
          to={`/books/edit/${book.id}`}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Editar
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-gray-500 font-semibold text-sm uppercase">
            Detalles Generales
          </p>
          <div className="mt-2 space-y-2">
            <p>
              <span className="font-semibold">Autor:</span>{" "}
              {book.author?.name || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Género:</span>{" "}
              {book.genre?.name || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Año de Publicación:</span>{" "}
              {book.publishYear}
            </p>
            <p>
              <span className="font-semibold">ISBN:</span>{" "}
              {book.isbn || "No registrado"}
            </p>
          </div>
        </div>

        <div>
          <p className="text-gray-500 font-semibold text-sm uppercase">
            Ubicación y Colección
          </p>
          <div className="mt-2 space-y-2">
            <p>
              <span className="font-semibold">Saga:</span>{" "}
              {book.saga?.name || "Independiente"}
            </p>
            <p>
              <span className="font-semibold">Ubicación Física:</span>
              {book.shelf
                ? ` Estante ${book.shelf.code} (${book.shelf.location})`
                : " Sin asignar"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-gray-500 font-semibold text-sm uppercase mb-2">
          Descripción
        </p>
        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded border">
          {book.description || "Sin descripción disponible."}
        </p>
      </div>

      <div className="mt-6">
        <Link to="/books" className="text-blue-600 hover:underline">
          ← Volver al catálogo
        </Link>
      </div>
    </div>
  );
};
