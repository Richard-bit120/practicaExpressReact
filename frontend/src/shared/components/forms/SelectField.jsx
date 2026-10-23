export const SelectField = ({
  name,
  value,
  onChange,
  onBlur,
  error,
  options,
  placeholder,
  disabled,
}) => (
  <select
    id={name}
    name={name}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    disabled={disabled}
    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
      error ? "border-red-500" : "border-gray-300"
    }`}
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);
