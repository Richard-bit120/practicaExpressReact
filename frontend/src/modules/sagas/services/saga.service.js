import axios from 'axios';

// Endpoint base para la gestión de sagas/series de libros
const API_URL = '/api/sagas';

/**
 * Obtiene la lista completa de sagas registradas.
 * @returns {Promise<Array>} Lista de sagas.
 */
export const getAllSagas = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

/**
 * Obtiene una saga específica por su ID.
 * @param {string|number} id - ID de la saga.
 * @returns {Promise<Object>} Datos de la saga.
 */
export const getSagaById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

/**
 * Crea una nueva saga en el sistema.
 * @param {Object} sagaData - Datos de la saga (ej: { name: 'Harry Potter' }).
 * @returns {Promise<Object>} Saga creada.
 */
export const createSaga = async (sagaData) => {
    const response = await axios.post(API_URL, sagaData);
    return response.data;
};

/**
 * Actualiza la información de una saga existente.
 * @param {string|number} id - ID de la saga a editar.
 * @param {Object} sagaData - Nuevos datos de la saga.
 * @returns {Promise<Object>} Saga actualizada.
 */
export const updateSaga = async (id, sagaData) => {
    const response = await axios.put(`${API_URL}/${id}`, sagaData);
    return response.data;
};

/**
 * Elimina una saga por su ID.
 * Regla de negocio: Al ejecutarse, los libros asociados quedarán con saga_id = NULL.
 * @param {string|number} id - ID de la saga a eliminar.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const deleteSaga = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
