import api from './api';

export const documentApi = {
  async upload(formData, onProgress) {
    const res = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
    return res.data;
  },

  async getAll(params = {}) {
    const res = await api.get('/documents', { params });
    return res.data;
  },

  async getById(id) {
    const res = await api.get(`/documents/${id}`);
    return res.data;
  },

  async reprocess(id) {
    const res = await api.post(`/documents/${id}/process`);
    return res.data;
  },

  async delete(id) {
    const res = await api.delete(`/documents/${id}`);
    return res.data;
  },
};

export default documentApi;
