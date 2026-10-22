import React from "react";

export const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
}) => (
  <div className="mb-4">
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
        error
          ? "border-red-500 focus:ring-red-200"
          : "border-gray-300 focus:ring-blue-200"
      }`}
    />
    {error && <span className="text-sm text-red-500 mt-1">{error}</span>}
  </div>
);
