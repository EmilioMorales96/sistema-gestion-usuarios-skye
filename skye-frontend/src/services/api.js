import axios from 'axios';

/**
 * @fileoverview Configuración de API para CatWare Systems
 * Cliente Axios configurado para conectar con Laravel backend
 */

// Configuración base de la API
const API_BASE_URL = 'http://localhost/api';

// Crear instancia de Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para añadir token de autenticación automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si el token expiró, limpiar storage y redirigir
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Servicios de API
 */
export const authAPI = {
  /**
   * Login de usuario
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise} Respuesta con usuario y token
   */
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Registro de nuevo usuario
   * @param {string} name 
   * @param {string} email 
   * @param {string} password 
   * @param {string} password_confirmation 
   * @returns {Promise} Respuesta con usuario y token
   */
  register: async (name, email, password, password_confirmation) => {
    const response = await api.post('/auth/register', { 
      name, 
      email, 
      password, 
      password_confirmation 
    });
    return response.data;
  },

  /**
   * Logout de usuario
   * @returns {Promise} Respuesta de logout
   */
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  }
};

export const usersAPI = {
  /**
   * Obtener lista de usuarios con ordenamiento
   * @param {string} sortBy - Campo de ordenamiento
   * @param {string} sortDirection - Dirección (asc/desc)
   * @returns {Promise} Lista de usuarios
   */
  getUsers: async (sortBy = 'name', sortDirection = 'asc') => {
    const response = await api.get('/users', {
      params: {
        sort_by: sortBy,
        sort_direction: sortDirection
      }
    });
    return response.data;
  }
};

export default api;