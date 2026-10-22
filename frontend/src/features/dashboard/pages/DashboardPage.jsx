import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';

export default function DashboardPage() {
  const navigate = useNavigate();

  const modules = [
    {
      title: 'Catálogo de Libros',
      description: 'Gestión completa de libros, filtros combinados y ubicación física.',
      path: ROUTES.BOOKS,
      icon: '📚',
      color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    },
    {
      title: 'Autores',
      description: 'Administración de escritores y autores registrados en la biblioteca.',
      path: ROUTES.AUTHORS,
      icon: '✍️',
      color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
    },
    {
      title: 'Géneros Literarios',
      description: 'Clasificación y administración de géneros de libros.',
      path: ROUTES.GENRES,
      icon: '🏷️',
      color: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
    },
    {
      title: 'Sagas',
      description: 'Gestión de series literarias y colecciones de libros.',
      path: ROUTES.SAGAS,
      icon: '📖',
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
    },
    {
      title: 'Estantes Físicos',
      description: 'Control de pasillos, estantes y ubicación de almacenamiento.',
      path: ROUTES.SHELVES,
      icon: '🗄️',
      color: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
    },
    {
      title: 'Auditoría (Logs)',
      description: 'Visor de registros de eventos y seguridad del sistema.',
      path: ROUTES.LOGS,
      icon: '🛡️',
      color: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Control - Biblioteca</h1>
        <p className="text-gray-600 mt-2">
          Seleccione un módulo a continuación para comenzar con la gestión de los recursos académicos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod, index) => (
          <div
            key={index}
            onClick={() => navigate(mod.path)}
            className={`p-6 rounded-xl border cursor-pointer transition shadow-sm hover:shadow-md flex flex-col justify-between ${mod.color}`}
          >
            <div>
              <div className="text-4xl mb-4">{mod.icon}</div>
              <h2 className="text-xl font-semibold mb-2">{mod.title}</h2>
              <p className="text-sm opacity-90">{mod.description}</p>
            </div>
            <div className="mt-6 font-medium text-sm flex items-center gap-1">
              Acceder al módulo &rarr;
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}