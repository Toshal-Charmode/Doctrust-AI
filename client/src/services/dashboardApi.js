import api from './api';

export const dashboardApi = {
  async getStats() {
    const res = await api.get('/dashboard/stats');
    return res.data;
  },
};

export const chatApi = {
  async sendMessage(message, documentIds = []) {
    const res = await api.post('/chat', { message, documentIds });
    return res.data;
  },

  async getHistory() {
    const res = await api.get('/chat/history');
    return res.data;
  },
};

export const demoApi = {
  async seedDemo() {
    const res = await api.post('/demo/seed');
    return res.data;
  },

  async getStatus() {
    const res = await api.get('/demo/status');
    return res.data;
  },

  async updateApiKey(apiKey) {
    const res = await api.post('/demo/api-key', { apiKey });
    return res.data;
  },
};

export default {
  dashboardApi,
  chatApi,
  demoApi,
};
