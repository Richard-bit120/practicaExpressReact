import { useState } from "react";
import { SelectField } from "../../../shared/components/forms/SelectField";
import { InputText } from "../../../shared/components/forms/InputText";
import { Button } from "../../../shared/components/ui/Button"; // Importamos el componente Button

export const BookFilters = ({
  authors,
  genres,
  shelves,
  sagas,
  onFilter,
  onClear,
}) => {
  const [filters, setFilters] = useState({
    search: "",
    authorId: "",
    genreId: "",
    shelfId: "",
    sagaId: "",
    year: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const activeFilters = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        activeFilters[key] = value;
      }
    });
    onFilter(activeFilters);
  };

  const handleClear = () => {
    setFilters({
      search: "",
      authorId: "",
      genreId: "",
      shelfId: "",
      sagaId: "",
      year: "",
    });
    onClear();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow p-4 mb-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Buscar por título
          </label>
          <InputText
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Título del libro..."
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Autor
          </label>
          <SelectField
            name="authorId"
            value={filters.authorId}
            onChange={handleChange}
            placeholder="Todos los autores"
            options={authors.map((a) => ({ value: a.id, label: a.name }))}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Género
          </label>
          <SelectField
            name="genreId"
            value={filters.genreId}
            onChange={handleChange}
            placeholder="Todos los géneros"
            options={genres.map((g) => ({ value: g.id, label: g.name }))}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Estante
          </label>
          <SelectField
            name="shelfId"
            value={filters.shelfId}
            onChange={handleChange}
            placeholder="Todos los estantes"
            options={shelves.map((s) => ({
              value: s.id,
              label: `${s.code} - ${s.location || "Sin ubicación"}`,
            }))}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Saga
          </label>
          <SelectField
            name="sagaId"
            value={filters.sagaId}
            onChange={handleChange}
            placeholder="Todas las sagas"
            options={sagas.map((s) => ({ value: s.id, label: s.name }))}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Año
          </label>
          <InputText
            name="year"
            type="number"
            value={filters.year}
            onChange={handleChange}
            placeholder="Ej: 2020"
          />
        </div>
      </div>
      <div className="flex space-x-3 mt-4">
        
        <Button type="submit" variant="primary">
          Aplicar filtros
        </Button>
        
        <Button type="button" variant="secondary" onClick={handleClear}>
          Limpiar filtros
        </Button>

      </div>
    </form>
  );
};