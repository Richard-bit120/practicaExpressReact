// src/modules/books/components/BookForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000/api",
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const schema = yup.object().shape({
  title: yup.string().required("El título es obligatorio"),
  publishYear: yup
    .number()
    .typeError("Debe ser un número")
    .required("El año es obligatorio"),
  authorId: yup
    .number()
    .typeError("Debe seleccionar un autor")
    .required("Autor obligatorio"),
  genreId: yup
    .number()
    .typeError("Debe seleccionar un género")
    .required("Género obligatorio"),
  shelfId: yup
    .number()
    .typeError("Debe seleccionar un estante")
    .required("Estante obligatorio"),
  sagaId: yup.number().nullable(),
  isbn: yup.string().nullable(),
  description: yup.string().nullable(),
});

export const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    publishYear: "",
    isbn: "",
    description: "",
    authorId: "",
    genreId: "",
    sagaId: "",
    shelfId: "",
  });

  const [lookups, setLookups] = useState({
    authors: [],
    genres: [],
    sagas: [],
    shelves: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [authorsRes, genresRes, sagasRes, shelvesRes] = await Promise.all(
          [
            api.get("/authors"),
            api.get("/genres"),
            api.get("/sagas"),
            api.get("/shelves"),
          ],
        );

        setLookups({
          authors: authorsRes.data,
          genres: genresRes.data,
          sagas: sagasRes.data,
          shelves: shelvesRes.data,
        });

        if (id) {
          const bookRes = await api.get(`/books/${id}`);
          const b = bookRes.data;
          setFormData({
            title: b.title,
            publishYear: b.publishYear,
            isbn: b.isbn || "",
            description: b.description || "",
            authorId: b.author?.id || "",
            genreId: b.genre?.id || "",
            sagaId: b.saga?.id || "",
            shelfId: b.shelf?.id || "",
          });
        }
      } catch (error) {
        console.error("Error loading form data", error);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Limpiar valores vacíos para campos opcionales
      const payload = { ...formData };
      if (!payload.sagaId) payload.sagaId = null;
      if (!payload.isbn) payload.isbn = null;

      await schema.validate(payload, { abortEarly: false });
      setErrors({});

      if (id) {
        await api.put(`/books/${id}`, payload);
      } else {
        await api.post("/books", payload);
      }
      navigate("/books");
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else {
        console.error("API Error:", err);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">
        {id ? "Editar Libro" : "Nuevo Libro"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Título</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.title && (
            <span className="text-red-500 text-sm">{errors.title}</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">
              Año de Publicación
            </label>
            <input
              type="number"
              name="publishYear"
              value={formData.publishYear}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {errors.publishYear && (
              <span className="text-red-500 text-sm">{errors.publishYear}</span>
            )}
          </div>
          <div>
            <label className="block font-semibold mb-1">ISBN</label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Autor</label>
            <select
              name="authorId"
              value={formData.authorId}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Seleccione...</option>
              {lookups.authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            {errors.authorId && (
              <span className="text-red-500 text-sm">{errors.authorId}</span>
            )}
          </div>

          <div>
            <label className="block font-semibold mb-1">Género</label>
            <select
              name="genreId"
              value={formData.genreId}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Seleccione...</option>
              {lookups.genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            {errors.genreId && (
              <span className="text-red-500 text-sm">{errors.genreId}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Saga (Opcional)</label>
            <select
              name="sagaId"
              value={formData.sagaId}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Ninguna</option>
              {lookups.sagas.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Estante</label>
            <select
              name="shelfId"
              value={formData.shelfId}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Seleccione...</option>
              {lookups.shelves.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.location}
                </option>
              ))}
            </select>
            {errors.shelfId && (
              <span className="text-red-500 text-sm">{errors.shelfId}</span>
            )}
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full border p-2 rounded"
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={() => navigate("/books")}
            className="px-4 py-2 border rounded text-gray-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};
