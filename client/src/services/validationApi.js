import api from './api';

export const validationApi = {
  async compare(documentIds, title) {
    const res = await api.post('/validation/compare', { documentIds, title });
    return res.data;
  },

  async getAll() {
    const res = await api.get('/validation');
    return res.data;
  },

  async getById(id) {
    const res = await api.get(`/validation/${id}`);
    return res.data;
  },
};

export default validationApi;
