import React from "react";

export const DataTable = ({ columns, data, onEdit, onDelete }) => (
  <div className="overflow-x-auto bg-white rounded-lg shadow">
    <table className="min-w-full table-auto">
      <thead className="bg-gray-50 border-b">
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {col.label}
            </th>
          ))}
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length + 1}
              className="px-6 py-4 text-center text-gray-500"
            >
              No hay registros disponibles.
            </td>
          </tr>
        ) : (
          data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {item[col.key]}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(item)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(item)}
                  className="text-red-600 hover:text-red-900"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);
