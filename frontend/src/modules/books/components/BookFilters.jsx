import { useState } from "react";
import Select from "react-select";
import { InputText } from "../../../shared/components/forms/InputText";
import { Button } from "../../../shared/components/ui/Button";

const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "38px",
    height: "38px",
    borderRadius: "0.375rem",
    borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
    "&:hover": {
      borderColor: "#9ca3af",
    },
  }),
  valueContainer: (base) => ({
    ...base,
    height: "38px",
    padding: "0 12px",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#9ca3af",
    fontSize: "0.875rem",
    fontWeight: "400",
    fontFamily: "inherit",
    margin: 0,
  }),
  input: (base) => ({
    ...base,
    color: "#111827",
    fontSize: "0.875rem",
    fontFamily: "inherit",
    margin: 0,
    padding: 0,
  }),
  singleValue: (base) => ({
    ...base,
    color: "#111827",
    fontSize: "0.875rem",
    fontFamily: "inherit",
    margin: 0,
  }),
  option: (base, state) => ({
    ...base,
    fontSize: "0.875rem",
    fontFamily: "inherit",
    backgroundColor: state.isSelected
      ? "#3b82f6"
      : state.isFocused
      ? "#eff6ff"
      : "white",
    color: state.isSelected ? "white" : "#111827",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 50,
  }),
  indicatorsContainer: (base) => ({
    ...base,
    height: "38px",
  }),
};

export const BookFilters = ({
  books = [], // Asegúrate de pasar 'books' desde BooksListPage
  authors = [],
  genres = [],
  shelves = [],
  sagas = [],
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

  // Mapeo de opciones
  // Obtenemos los títulos únicos del arreglo de libros
  const titleOptions = Array.from(new Set(books.map((b) => b.title))).map((title) => ({
    value: title,
    label: title,
  }));
  const authorOptions = authors.map((a) => ({ value: a.id, label: a.name }));
  const genreOptions = genres.map((g) => ({ value: g.id, label: g.name }));
  const shelfOptions = shelves.map((s) => ({
    value: s.id,
    label: `${s.code} - ${s.location || "Sin ubicación"}`,
  }));
  const sagaOptions = sagas.map((s) => ({ value: s.id, label: s.name }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, selectedOption) => {
    setFilters((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }));
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
        {/* Título - Ahora con Select */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Buscar por título
          </label>
          <Select
            options={titleOptions}
            value={filters.search ? { value: filters.search, label: filters.search } : null}
            onChange={(opt) => handleSelectChange("search", opt)}
            placeholder="Título del libro..."
            isSearchable
            isClearable
            styles={customSelectStyles}
          />
        </div>

        {/* Autor */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Autor
          </label>
          <Select
            options={authorOptions}
            value={authorOptions.find((opt) => opt.value === Number(filters.authorId)) || null}
            onChange={(opt) => handleSelectChange("authorId", opt)}
            placeholder="Todos los autores..."
            isSearchable
            isClearable
            styles={customSelectStyles}
          />
        </div>

        {/* Género */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Género
          </label>
          <Select
            options={genreOptions}
            value={genreOptions.find((opt) => opt.value === Number(filters.genreId)) || null}
            onChange={(opt) => handleSelectChange("genreId", opt)}
            placeholder="Todos los géneros..."
            isSearchable
            isClearable
            styles={customSelectStyles}
          />
        </div>

        {/* Estante */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Estante
          </label>
          <Select
            options={shelfOptions}
            value={shelfOptions.find((opt) => opt.value === Number(filters.shelfId)) || null}
            onChange={(opt) => handleSelectChange("shelfId", opt)}
            placeholder="Todos los estantes..."
            isSearchable
            isClearable
            styles={customSelectStyles}
          />
        </div>

        {/* Saga */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Saga
          </label>
          <Select
            options={sagaOptions}
            value={sagaOptions.find((opt) => opt.value === Number(filters.sagaId)) || null}
            onChange={(opt) => handleSelectChange("sagaId", opt)}
            placeholder="Todas las sagas..."
            isSearchable
            isClearable
            styles={customSelectStyles}
          />
        </div>

        {/* Año */}
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