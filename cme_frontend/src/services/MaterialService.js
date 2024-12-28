import api from './api';
import ServiceBase from './ServiceBase';

class MaterialService extends ServiceBase {
  async get(limit = 5, offset = 0, search = '') {
    try {
      const response = await api.get('/material/', {
        params: { limit, offset, search },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar materiais:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const response = await api.get(`/material/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar material:', error);
      throw error;
    }
  }

  async add(payload) {
    try {
      const response = await api.post('/material/', payload);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar material:', error);
      throw error;
    }
  }

  async edit(id, payload) {
    try {
      const response = await api.put(`/material/${id}/`, payload);
      return response.data;
    } catch (error) {
      console.error('Erro ao editar material:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      await api.delete(`/material/${id}/`);
    } catch (error) {
      console.error('Erro ao excluir material:', error);
      throw error;
    }
  }

  async getStepSerial(id) {
    try {
      const response = await api.get(`/material/${id}/get_step_serial/`);
      return response.data;;
    } catch (error) {
      console.error('Erro ao consultar processos do material:', error);
      throw error;
    }
  }

  async addNextStep(id, payload) {
    try {
      const response = await api.post(`/material/${id}/next_step/`, payload);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar material:', error);
      throw error;
    }
  }

  async downloadReportPdf() {
    try {
      const response = await api.get(`/material/generate_pdf_report/`, { responseType: 'blob' });
      return response;
    } catch (error) {
      console.error('Erro ao consultar processos do material:', error);
      throw error;
    }
  }

  async downloadReportXlsx() {
    try {
      const response = await api.get(`/material/generate_xlsx_report/`, { responseType: 'blob' });
      return response;
    } catch (error) {
      console.error('Erro ao consultar processos do material:', error);
      throw error;
    }
  }
}

const MaterialServiceInsctance = new MaterialService()
export default MaterialServiceInsctance;
