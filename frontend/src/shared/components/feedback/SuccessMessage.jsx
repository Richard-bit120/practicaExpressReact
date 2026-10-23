export const SuccessMessage = ({ message }) => (
  <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-4">
    <div className="flex items-center">
      <svg
        className="h-5 w-5 text-green-400 mr-3"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      <p className="text-green-700 text-sm">{message}</p>
    </div>
  </div>
);
