import axios from 'axios';

// Asumimos que tienes una instancia de Axios configurada en shared (ej: con la baseURL)
// Si no la tienes, puedes importar 'axios' directamente o usar tu instancia personalizada:
// import api from '../../../shared/api/axiosInstance'; 

const API_URL = '/api/genres';

/**
 * Obtiene la lista completa de géneros literarios.
 * @returns {Promise<Array>} Lista de géneros.
 */
export const getAllGenres = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

/**
 * Obtiene un género específico por su ID.
 * @param {string|number} id - ID del género.
 * @returns {Promise<Object>} Datos del género.
 */
export const getGenreById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

/**
 * Crea un nuevo género literario.
 * @param {Object} genreData - Datos del nuevo género (ej: { name: 'Fantasía' }).
 * @returns {Promise<Object>} Género creado.
 */
export const createGenre = async (genreData) => {
    const response = await axios.post(API_URL, genreData);
    return response.data;
};

/**
 * Actualiza un género existente.
 * @param {string|number} id - ID del género a editar.
 * @param {Object} genreData - Nuevos datos del género.
 * @returns {Promise<Object>} Género actualizado.
 */
export const updateGenre = async (id, genreData) => {
    const response = await axios.put(`${API_URL}/${id}`, genreData);
    return response.data;
};

/**
 * Elimina un género por su ID.
 * Nota: El backend validará que no tenga libros asociados antes de borrarlo.
 * @param {string|number} id - ID del género a eliminar.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const deleteGenre = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
