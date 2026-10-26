import { useLogs } from '../hooks/useLogs';
import { LoadingSpinner } from '../../../shared/components/feedback/LoadingSpinner';
import { ErrorMessage } from '../../../shared/components/feedback/ErrorMessage';
import { EmptyState } from '../../../shared/components/feedback/EmptyState';
import { PageHeader } from '../../../shared/components/layout/PageHeader';
import { SelectField } from '../../../shared/components/forms/SelectField';
import { InputText } from '../../../shared/components/forms/InputText';

const LOG_LEVELS = [
  { value: '', label: 'Todos los niveles' },
  { value: 'INFO', label: 'INFO' },
  { value: 'WARN', label: 'WARN' },
  { value: 'ERROR', label: 'ERROR' },
  { value: 'DEBUG', label: 'DEBUG' },
];

const levelBadgeColors = {
  INFO: 'bg-blue-100 text-blue-800',
  WARN: 'bg-yellow-100 text-yellow-800',
  ERROR: 'bg-red-100 text-red-800',
  DEBUG: 'bg-gray-100 text-gray-800',
};

export const LogsPage = () => {
  const { logs, loading, error, filters, updateFilters, refetch } = useLogs();

  return (
    <div>
      <PageHeader
        title="Logs del sistema"
        subtitle="Registro de eventos, peticiones y errores"
        action={
          <button onClick={refetch} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            🔄 Actualizar
          </button>
        }
      />

      {error && <ErrorMessage message={error} onRetry={refetch} />}

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Nivel</label>
            <SelectField
              name="level"
              value={filters.level}
              onChange={(e) => updateFilters({ level: e.target.value })}
              options={LOG_LEVELS}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Desde</label>
            <InputText
              name="dateFrom"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => updateFilters({ dateFrom: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Hasta</label>
            <InputText
              name="dateTo"
              type="date"
              value={filters.dateTo}
              onChange={(e) => updateFilters({ dateTo: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Tabla de logs */}
      {loading ? (
        <LoadingSpinner text="Cargando logs..." />
      ) : logs.length === 0 ? (
        <EmptyState title="Sin registros" message="No se encontraron logs con los filtros aplicados." />
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nivel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mensaje</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log, idx) => (
                <tr key={log.id || idx} className="hover:bg-gray-50">
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                    {log.timestamp || log.createdAt || '-'}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${levelBadgeColors[log.level] || 'bg-gray-100 text-gray-800'}`}>
                      {log.level}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-900 max-w-lg truncate">
                    {log.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};