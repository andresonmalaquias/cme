import api from '../services/api';
import AuthService from '../services/AuthService';

const Interceptor = () => {
  api.interceptors.request.use(
    (config) => {
      console.log('interceptou');
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

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Se o token expirou, tenta renovar o token
      if (error.response.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        const newToken = await AuthService.refreshToken();
        api.defaults.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest); // Refaça a requisição com o novo token
      }
      return Promise.reject(error);
    }
  );
};

export default Interceptor;
