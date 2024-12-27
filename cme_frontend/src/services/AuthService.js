import api from './api';

class AuthService {
  // Salvar tokens no localStorage
  saveTokens(accessToken, refreshToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  // Obter o token de acesso do localStorage
  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  // Remover tokens do localStorage
  removeTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Login
  async login(username, password) {
    try {
      const response = await api.post('token/', { username, password });
      const { access, refresh } = response.data;
      this.saveTokens(access, refresh);
      return response.data; // Retorna os dados para a tela
    } catch (error) {
      throw new Error('Falha na autenticação');
    }
  }

  // Logout
  logout() {
    this.removeTokens();
  }

  // Refresh Token (se necessário)
  async refreshToken() {
    try {
      const refresh = localStorage.getItem('refreshToken');
      const response = await api.post('/token/refresh/', { refresh });
      const { access } = response.data;
      localStorage.setItem('accessToken', access); // Atualiza o access token
      return access;
    } catch (error) {
      throw new Error('Falha ao renovar o token');
    }
  }
}

export default new AuthService();
