export const Pagination = ({ meta, onPageChange, onLimitChange }) => {
  if (!meta || meta.totalPages <= 1) return null;

  const { page, totalPages, total, limit } = meta;

  return (
    <div className="flex items-center justify-between mt-4 px-2">
      <p className="text-sm text-gray-500">
        Mostrando {Math.min((page - 1) * limit + 1, total)} -{" "}
        {Math.min(page * limit, total)} de {total} registros
      </p>
      <div className="flex items-center space-x-2">
        <select
          value={limit}
          onChange={(e) => onLimitChange(parseInt(e.target.value, 10))}
          className="text-sm border border-gray-300 rounded-md px-2 py-1"
        >
          {[5, 10, 20, 50].map((opt) => (
            <option key={opt} value={opt}>
              {opt} por página
            </option>
          ))}
        </select>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
        >
          ← Anterior
        </button>
        <span className="text-sm text-gray-600">
          Página {page} de {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
};
