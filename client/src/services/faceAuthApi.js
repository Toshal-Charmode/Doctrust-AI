import api from './api';

export const faceAuthApi = {
  /**
   * Enrolls a live face capture with explicit consent (authenticated session).
   */
  async enroll({ image, consent }) {
    const res = await api.post('/face-auth/enroll', { image, consent });
    return res.data;
  },

  /**
   * Retrieves the current user's biometric enrollment status.
   */
  async getStatus() {
    const res = await api.get('/face-auth/status');
    return res.data;
  },

  /**
   * Generates a pending biometric challenge for login.
   */
  async createChallenge({ userId, email }) {
    const res = await api.post('/face-auth/challenge', { userId, email });
    return res.data;
  },

  /**
   * Verifies a captured live face against the enrolled profile for a pending challenge.
   */
  async verify({ challengeId, image }) {
    const res = await api.post('/face-auth/verify', { challengeId, image });
    return res.data;
  },

  /**
   * Fallback authentication using account password if face recognition is unavailable.
   */
  async fallback({ challengeId, password }) {
    const res = await api.post('/face-auth/fallback', { challengeId, password });
    return res.data;
  },

  /**
   * Disables face authentication for the account.
   */
  async disable({ password }) {
    const res = await api.post('/face-auth/disable', { password });
    return res.data;
  },

  /**
   * Re-enrolls a new facial template.
   */
  async reenroll({ password, image, consent }) {
    const res = await api.post('/face-auth/reenroll', { password, image, consent });
    return res.data;
  },

  /**
   * Permanently revokes biometric consent and deletes facial templates.
   */
  async revokeConsent({ password }) {
    const res = await api.post('/face-auth/revoke-consent', { password });
    return res.data;
  },
};

export default faceAuthApi;
