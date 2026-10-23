export const TextArea = ({
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  rows = 4,
  disabled,
}) => (
  <textarea
    id={name}
    name={name}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    placeholder={placeholder}
    rows={rows}
    disabled={disabled}
    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
      error ? "border-red-500" : "border-gray-300"
    }`}
  />
);
