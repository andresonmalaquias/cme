import api from './api';
import ServiceBase from './ServiceBase'; // Importando a interface

class UserService extends ServiceBase {
  // Implementando o método 'get' que vai buscar os usuários
  async get(limit = 5, offset = 0, search = '') {
    try {
      const response = await api.get('/user/', {
        params: { limit, offset, search },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  }

  // Implementando o método 'getById' que vai buscar um usuário pelo ID
  async getById(id) {
    try {
      const response = await api.get(`/user/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }

  // Implementando o método 'add' para adicionar um novo usuário
  async add(payload) {
    try {
      const response = await api.post('/user/', payload);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      throw error;
    }
  }

  // Implementando o método 'detail' (Detalhes do usuário) - pode ser similar ao 'getById'
  async detail(id) {
    try {
      const response = await api.get(`/user/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar detalhes do usuário:', error);
      throw error;
    }
  }

  // Implementando o método 'edit' para editar um usuário
  async edit(id, payload) {
    try {
      const response = await api.put(`/user/${id}/`, payload);
      return response.data;
    } catch (error) {
      console.error('Erro ao editar usuário:', error);
      throw error;
    }
  }

  // Implementando o método 'delete' para excluir um usuário
  async delete(id) {
    try {
      await api.delete(`/user/${id}/`);
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      throw error;
    }
  }
}

const UserServiceInstance = new UserService();
export default UserServiceInstance;
