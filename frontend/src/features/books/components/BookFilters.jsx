export default function BookFilters({ filters, setFilters, genres, authors, sagas }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-4 flex-wrap items-center">
      <select
        value={filters.genreId}
        onChange={(e) => setFilters({ ...filters, genreId: e.target.value })}
        className="border p-2 rounded text-sm bg-white"
      >
        <option value="">Todos los géneros</option>
        {genres.map((g) => (
          <option key={g.id} value={g.id}>{g.name}</option>
        ))}
      </select>

      <select
        value={filters.authorId}
        onChange={(e) => setFilters({ ...filters, authorId: e.target.value })}
        className="border p-2 rounded text-sm bg-white"
      >
        <option value="">Todos los autores</option>
        {authors.map((a) => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>

      <select
        value={filters.sagaId}
        onChange={(e) => setFilters({ ...filters, sagaId: e.target.value })}
        className="border p-2 rounded text-sm bg-white"
      >
        <option value="">Todas las sagas</option>
        {sagas.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      <button
        onClick={() => setFilters({ genreId: '', authorId: '', year: '', sagaId: '' })}
        className="text-sm text-blue-600 hover:underline font-medium"
      >
        Limpiar Filtros
      </button>
    </div>
  );
}