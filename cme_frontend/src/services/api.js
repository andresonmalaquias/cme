import axios from 'axios';
import AuthService from './AuthService';

// Configuração inicial do Axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Ajuste para o endereço do seu backend
  timeout: 5000,
});

// Interceptor de requisição para adicionar o token
api.interceptors.request.use(
  (config) => {
    const token = AuthService.getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta para tratar 401 e renovar token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se o token expirou, tenta renovar o token
    if (error.response.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await AuthService.refreshToken();
        api.defaults.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest); // Refaz a requisição com o novo token
      } catch (refreshError) {
        // Se a renovação falhou, redireciona para o login
        AuthService.logout(); // Remove tokens
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
