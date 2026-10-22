import axios from 'axios';

// Endpoint base para la gestión de estantes
const API_URL = '/api/shelves';

/**
 * Obtiene la lista completa de estantes de la biblioteca.
 * @returns {Promise<Array>} Lista de estantes.
 */
export const getAllShelves = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

/**
 * Obtiene un estante específico por su ID.
 * @param {string|number} id - ID del estante.
 * @returns {Promise<Object>} Datos del estante.
 */
export const getShelfById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

/**
 * Crea un nuevo estante en el sistema.
 * @param {Object} shelfData - Datos del estante (ej: { name: 'Estante A1', location: 'Piso 1' }).
 * @returns {Promise<Object>} Estante creado.
 */
export const createShelf = async (shelfData) => {
    const response = await axios.post(API_URL, shelfData);
    return response.data;
};

/**
 * Actualiza la información de un estante existente.
 * @param {string|number} id - ID del estante a editar.
 * @param {Object} shelfData - Nuevos datos del estante.
 * @returns {Promise<Object>} Estante actualizado.
 */
export const updateShelf = async (id, shelfData) => {
    const response = await axios.put(`${API_URL}/${id}`, shelfData);
    return response.data;
};

/**
 * Elimina un estante por su ID.
 * Nota de negocio: El backend validará que no tenga libros asociados antes de borrarlo.
 * @param {string|number} id - ID del estante a eliminar.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const deleteShelf = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
