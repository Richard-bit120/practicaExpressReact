export const LoadingSpinner = ({ text = "Cargando..." }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    <p className="mt-4 text-gray-600 text-sm">{text}</p>
  </div>
);
