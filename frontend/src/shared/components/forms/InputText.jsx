export const InputText = ({
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  type = "text",
  disabled,
}) => (
  <input
    id={name}
    name={name}
    type={type}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    placeholder={placeholder}
    disabled={disabled}
    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
      error ? "border-red-500" : "border-gray-300"
    }`}
  />
);
