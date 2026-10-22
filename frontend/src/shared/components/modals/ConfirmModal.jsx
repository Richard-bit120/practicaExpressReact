export default function ConfirmModal({ isOpen, title, message, onConfirm, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full shadow-xl">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title || 'Confirmar acción'}</h3>
        <p className="text-sm text-gray-600 mb-6">{message || '¿Está seguro de realizar esta acción?'}</p>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 font-medium"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 font-medium"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}