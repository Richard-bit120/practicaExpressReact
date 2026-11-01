import { Button } from '../ui/Button'; // Verifica que esta ruta apunte correctamente a donde creaste Button.jsx

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onCancel}
        ></div>
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-2 text-sm text-gray-600">{message}</p>
          <div className="mt-6 flex justify-end space-x-3">
            
            {/* Botón de Cancelar: Usamos la variante 'secondary' */}
            <Button
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>

            {/* Botón de Confirmar/Eliminar: Usamos 'danger' y aprovechamos la prop isLoading */}
            <Button
              variant="danger"
              onClick={onConfirm}
              isLoading={loading}
            >
              Eliminar
            </Button>

          </div>
        </div>
      </div>
    </div>
  );
};